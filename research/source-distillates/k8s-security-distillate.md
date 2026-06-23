---
type: bmad-distillate
sources:
  - "../../../../../books/sources/zt-downloads/11-Kubernetes-Security-Rice.md"
  - "../../../../../books/sources/zt-downloads/13-K8s-Security-Observability-Creane.md"
  - "../../../../../books/sources/zt-downloads/14-Container-Security-Rice.md"
  - "../../../../../books/sources/zt-downloads/15-Kubernetes-Book-Poulton.md"
  - "../../../../../books/sources/zt-downloads/23-Kubernetes-Up-Running-3Ed-Burns.md"
downstream_consumer: "Zero-Trust Octagon project — Archetypes C+D, D3, D7"
created: "2026-06-23"
token_estimate: 3500
---
## Core Security Principles (Common Across All)
- **Defense in depth**: Multiple layers — castle metaphor. Each layer can be compromised, but several layers together prevent success
- **Least privilege**: Restrict access to only what's needed. Microservice example — product-search service = read-only product tables, no user data access. Limits blast radius
- **Limit attack surface**: Minimize code, reduce complexity. Kubernetes is complex by nature — compensate with controls
- **3 stages of workload security**: Build → Deploy → Runtime. Different controls at each stage

## K8s Cluster Security (Rice, Ch 2-4)
- **Secure API server**: RBAC, authentication webhooks, audit logging. API = cluster control plane — most critical attack vector
- **etcd encryption**: Encrypt secrets at rest in etcd. Enable etcd TLS. Limit etcd access to API server only
- **Node security**: Regular OS patching. Minimize node access. Use container-optimized OS (COS, Flatcar, Bottlerocket)
- **Network policies**: Default-deny ingress/egress. Allow specific pod-to-pod communication. K8s NetworkPolicy API (L3/L4)
- **Admission controllers**: PodSecurityPolicy (deprecated) → Pod Security Admission (PSA). Also: OPA/Gatekeeper, Kyverno for custom policies
- **Authentication**: X.509 certs, bearer tokens (service accounts), OIDC, webhook token auth. ServiceAccount = pod identity
- **Authorization**: RBAC (primary), ABAC (deprecated), Webhook. Principle: create least-privilege Roles + RoleBindings (namespace-scoped). ClusterRole/ClusterRoleBinding for cluster-scoped

## Container Image Security (Rice Ch 5, Container Security Ch 4)
- **Image scanning**: Scan for known CVEs (Trivy, Clair, Anchore). Scan in CI/CD before push, scan registry periodically, scan at deploy time
- **Minimal base images**: Alpine, distroless, scratch. Smaller = fewer vulnerabilities. Avoid fat images with build tools
- **Image signing**: Cosign (Sigstore). Verify signatures at deploy time via admission controller
- **Supply chain**: SBOM generation (Syft). SLSA provenance levels. Signed attestations for build pipeline
- **Private registry**: Restrict which registries pods can pull from (ImagePolicyWebhook, OPA policy)

## Running Containers Securely (Rice Ch 6, Container Security Ch 5-6)
- **Don't run as root**: `runAsNonRoot: true`, `runAsUser: 1000`. Container default is often root — explicitly override
- **Read-only root filesystem**: `readOnlyRootFilesystem: true`. Prevents malware writing to container fs
- **Drop all capabilities**: `securityContext.capabilities.drop: ["ALL"]`. Add back only what's needed (e.g., NET_BIND_SERVICE)
- **Seccomp**: Default seccomp profile blocks ~50 syscalls. K8s v1.19+ enables seccomp by default for certain profiles
- **AppArmor/SELinux**: Node-level MAC. Profiles restrict program capabilities. Defense in depth beyond seccomp
- **Pod Security Standards**: Privileged, Baseline, Restricted — three profiles. Restricted = most secure, drops all caps, non-root, read-only rootfs
- **Resource limits**: CPU/memory limits prevent DoS. Also: `resources.requests` for scheduling guarantees
- **Runtime security**: Falco for behavioral monitoring (syscall-level). Detects anomalous container behavior

## K8s Security & Observability (Creane — Unique Contribution)
- **ZT principles applied to K8s**: Workload identity, mutual auth, least-privilege network, continuous verification
- **eBPF-based security**: Cilium uses eBPF for network policies + observability without sidecars. L3-L7 policy enforcement
- **Service mesh security**: Istio sidecars for mTLS, authz policies, telemetry. L7 aware — policy on HTTP methods, paths, headers
- **Hubble**: Cilium's observability layer. Real-time flow visibility. Service dependency graph. Security incident forensics
- **Workload deployment lifecycle security**:
  - **Build stage**: Scan images, sign artifacts, harden host OS, secure CI/CD pipeline
  - **Deploy stage**: Admission controllers (PSA, OPA/Gatekeeper), network policies, resource quotas, pod security context
  - **Runtime stage**: Runtime detection (Falco, Tracee), network visibility (Hubble), anomaly detection, response automation
- **Infrastructure security**: Node security, control plane hardening, etcd backup+encryption, audit logging
- **Key insight**: "K8s is a different world for security teams" — traditional network controls don't work. IPs are dynamic, workloads are ephemeral. Need identity-based (not network-based) security

## Secrets Management (Rice Ch 7)
- **K8s Secrets are base64-encoded, not encrypted** by default. Enable encryption at rest in etcd
- **External secrets operator**: Sync from HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, GCP Secret Manager
- **Sealed Secrets**: Encrypt secrets for safe storage in git (Bitnami Sealed Secrets)
- **Avoid**: Hardcoding secrets in images, env vars in manifests, sidecar containers for secret delivery
- **Best practice**: External secrets operator + encryption at rest + audit logging for secret access

## K8s Architecture & Operations (Burns/Up&Running, Poulton)
- **K8s is declarative**: Specify desired state, K8s converges. Fundamental shift from imperative management
- **RBAC depth**: Users, Groups, ServiceAccounts. Roles (namespace) vs ClusterRoles (cluster). RoleBinding vs ClusterRoleBinding
- **Admission control**: MutatingAdmissionWebhook (can modify resources) → ValidatingAdmissionWebhook (can only validate). Order matters
- **Gateway API**: Evolved Ingress. More expressive routing. Role-oriented (Infra, Platform, App teams)
- **Service mesh**: Istio, Linkerd, Consul. mTLS, traffic shifting, observability. Adds complexity — evaluate need
- **Workload isolation**: Namespaces as security boundaries. NetworkPolicies per namespace. ResourceQuotas prevent noisy neighbor
- **Pod security**: Pod Security Admission (PSA) replaces PSP. Three standards: Privileged (least), Baseline, Restricted (most). Enforce at namespace level
- **Audit logging**: Enable kube-apiserver audit. Log all API calls. Ship to SIEM. Critical for incident response

## Container Isolation & Runtime (Container Security — Rice)
- **Linux primitives**: Namespaces (mount, PID, net, IPC, UTS, user, cgroup), cgroups v2
- **Container = isolated process, not VM**: Same kernel as host. Container escape via kernel exploit is possible
- **Runtime isolation options** (increasing isolation): Runc (default) → gVisor (user-space kernel) → Kata Containers (lightweight VM) → Firecracker (microVM)
- **gVisor**: Intercepts syscalls, handles in user-space. Good balance of security + compatibility. ~50% performance overhead on syscall-heavy workloads
- **Kata Containers**: Each pod = lightweight VM. Hardware isolation. Best security, highest overhead. Needs hardware virtualization support
- **Firecracker**: AWS Lambda/Bottlerocket. MicroVM with minimal device model. Fast boot (~125ms). For multi-tenant workloads
- **Choosing isolation**: Depends on threat model. Same-org internal apps = runc with good config. Multi-tenant untrusted = gVisor/Kata/Firecracker

## Supply Chain & DevSecOps
- **CI/CD pipeline security**: Scan deps (npm/Gradle/Maven), scan IaC (tfsec, Checkov), scan containers (Trivy), sign artifacts (Cosign)
- **SLSA levels**: Level 1 (documented build) → Level 4 (hermetic, reproducible, two-party reviewed). Target SLSA 3 for production
- **In-toto attestations**: Cryptographically signed evidence of what happened in build pipeline. Verify at deploy time
- **SBOM**: Software Bill of Materials (SPDX, CycloneDX). Know what's in your containers. Crucial for vulnerability response
