# Kubernetes Deployment Manifests for ZTA Infrastructure

To finalize the 2026/2027 Zero Trust Architecture (ZTA), the infrastructure must be deployed within a highly hardened container environment. The following manifests provide the Kubernetes Deployment, Service, and strict NetworkPolicy configuration. They securely host the gRPC external authorization service, isolate the Redis challenge-management pipeline, and protect the cluster in accordance with NIS2 infrastructure isolation mandates.

---

## 1. Hardened Redis Deployment & Cluster Service

This manifest spins up the Redis instance with a read-only root filesystem, drops non-essential Linux kernel privileges, and provisions a Kubernetes Service to allow internal cluster discovery.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zta-redis-hub
  namespace: zta-core
  labels:
    app: zta-redis-hub
    tier: storage
spec:
  replicas: 1
  selector:
    matchLabels:
      app: zta-redis-hub
  template:
    metadata:
      labels:
        app: zta-redis-hub
        tier: storage
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 999
        runAsGroup: 999
        fsGroup: 999
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: redis
        image: redis:7.2-alpine
        command:
          - "redis-server"
          - "--requirepass"
          - "$(REDIS_PASSWORD)"
          - "--maxmemory"
          - "512mb"
          - "--maxmemory-policy"
          - "volatile-ttl"
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zta-cluster-secrets
              key: redis-password
        ports:
        - containerPort: 6379
          name: redis
        resources:
          limits:
            cpu: "500m"
            memory: "512Mi"
          requests:
            cpu: "250m"
            memory: "256Mi"
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
        volumeMounts:
        - name: redis-tmp
          mountPath: /data
      volumes:
      - name: redis-tmp
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: zta-redis-service
  namespace: zta-core
spec:
  selector:
    app: zta-redis-hub
  ports:
  - protocol: TCP
    port: 6379
    targetPort: 6379
```

## 2. Envoy External gRPC Auth Service Manifest

This deploys the high-speed gRPC authorization service that evaluates CAEP/SSF revocation entries in real-time before Envoy passes requests downstream.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zta-grpc-authz
  namespace: zta-core
  labels:
    app: zta-grpc-authz
    tier: security-pep
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: zta-grpc-authz
  template:
    metadata:
      labels:
        app: zta-grpc-authz
    spec:
      securityContext:
        runAsNonRoot: true
        seccompProfile:
          type: RuntimeDefault
      containers:
      - name: authz-engine
        image: internal-registry.enterprise.eu/zta/grpc-authz:v1.0.0
        env:
        - name: REDIS_HOST
          value: "zta-redis-service.zta-core.svc.cluster.local"
        - name: REDIS_PORT
          value: "6379"
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: zta-cluster-secrets
              key: redis-password
        ports:
        - containerPort: 50051
          name: grpc-authz
        resources:
          limits:
            cpu: "1000m"
            memory: "256Mi"
          requests:
            cpu: "200m"
            memory: "128Mi"
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
            - ALL
---
apiVersion: v1
kind: Service
metadata:
  name: zta-grpc-authz-service
  namespace: zta-core
spec:
  selector:
    app: zta-grpc-authz
  ports:
  - protocol: TCP
    port: 50051
    targetPort: 50051
```

## 3. Strict Network Isolation Policy

Under NIS2 guidelines, critical infrastructure subcomponents must be network-isolated. This Default-Deny architecture ensures that only authorized entities can access the identity fabric and challenge stores.

```yaml
# 1. Enforce Default Deny Ingress and Egress for the entire Security Namespace
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: zta-core
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
# 2. Redis Access Isolation Rule
# Only the local gRPC validator and the SOAR webhook controller pods are permitted to call the data store
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-redis-only-from-auth-and-soar
  namespace: zta-core
spec:
  podSelector:
    matchLabels:
      app: zta-redis-hub
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: zta-grpc-authz
    - podSelector:
        matchLabels:
          app: zta-soar-controller
    ports:
    - protocol: TCP
      port: 6379
---
# 3. gRPC external-auth execution entry rule
# Allows the cluster's Ingress controller to query the validation engine
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-ingress-to-grpc-authz
  namespace: zta-core
spec:
  podSelector:
    matchLabels:
      app: zta-grpc-authz
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    # Adjust this selector to target your specific ingress gateway namespace/labels
    - namespaceSelector:
        matchLabels:
          kubernetes.io/metadata.name: ingress-nginx
    ports:
    - protocol: TCP
      port: 50051
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: zta-redis-hub
    ports:
    - protocol: TCP
      port: 6379
  - to:
    # Allow DNS resolution requests out to Kube-DNS
    - namespaceSelector: {}
      podSelector:
        matchLabels:
          k8s-app: kube-dns
    ports:
    - protocol: UDP
      port: 53
```

---

## Deployment & Runtime Verification

### 1. Provision Namespace and Core Cluster Secret

```bash
kubectl create namespace zta-core
kubectl create secret generic zta-cluster-secrets \
  --from-literal=redis-password=$(openssl rand -base64 32) \
  -n zta-core
```

### 2. Apply Identity Fabric Manifests

```bash
kubectl apply -f zta-redis.yaml
kubectl apply -f zta-grpc-authz.yaml
kubectl apply -f zta-network-policies.yaml
```

### 3. Verify Network Policy Restrictions

Spin up an unapproved pod in a different namespace and attempt to trace port 6379 on `zta-redis-service.zta-core.svc.cluster.local`. The execution should time out completely, confirming that the isolation layer successfully blocks network lateral movement.
