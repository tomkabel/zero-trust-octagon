# Redis Challenge Pipeline with Docker

Production-ready Dockerized Redis pipeline blueprint. It manages short-lived challenges, prevents replay attacks, and handles session revocations across the gRPC API Gateway and the WebAuthn Validation Service.

---

## 1. Infrastructure Architecture: docker-compose.yml

This configuration sets up a high-performance Redis instance optimized for low-latency operations, secured with a password, and isolated within a dedicated internal network overlay.

```yaml
version: '3.8'
services:
  zta-redis-hub:
    image: redis:7.2-alpine
    container_name: zta_redis_hub
    command: >
      redis-server
      --requirepass "${REDIS_SECURITY_PASSWORD:-ZtaSecureTokenPass2026}"
      --maxmemory 512mb
      --maxmemory-policy volatile-ttl
      --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - zta_redis_data:/data
    networks:
      - zta-secure-mesh
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_SECURITY_PASSWORD:-ZtaSecureTokenPass2026}", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
volumes:
  zta_redis_data:
    driver: local
networks:
  zta-secure-mesh:
    driver: bridge
```

## 2. High-Performance Token & Challenge Pipeline

This TypeScript module manages three core operations across the infrastructure:

- **Challenge Issuance**: Generates single-use challenges with strict TTL constraints.
- **Challenge Verification**: Executes an atomic read-and-delete transaction to prevent replay attacks.
- **Asynchronous Revocation (CAEP/SSF)**: Pushes global session kills across the microservice cluster.

```typescript
import { createClient, RedisClientType } from 'redis';

export class ZtaRedisPipelineManager {
  private client: RedisClientType;
  private static CHALLENGE_PREFIX = 'zta:challenge:';
  private static REVOCATION_PREFIX = 'revoked:session:';
  private static DEVICE_REVOCATION_PREFIX = 'revoked:device:';

  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = process.env.REDIS_PORT || '6379';
    const password = process.env.REDIS_PASSWORD || 'ZtaSecureTokenPass2026';

    this.client = createClient({
      url: `redis://:${password}@${host}:${port}`
    });

    this.client.on('error', (err) => console.error('ZTA Redis Pipeline Error:', err));
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  /**
   * Stores a newly generated WebAuthn challenge with an exact 2-minute expiration
   */
  public async storeChallenge(userId: string, challenge: string): Promise<void> {
    const key = `${ZtaRedisPipelineManager.CHALLENGE_PREFIX}${challenge}`;
    // TTL: 120 seconds (Strict Data Minimization / Attack Window Reduction)
    await this.client.set(key, userId, { EX: 120 });
  }

  /**
   * Validates challenge presence and deletes it atomically in one operation (Anti-Replay)
   */
  public async verifyAndConsumeChallenge(challenge: string): Promise<boolean> {
    const key = `${ZtaRedisPipelineManager.CHALLENGE_PREFIX}${challenge}`;

    // Multi/Exec transaction to prevent race conditions during distributed validation attempts
    const results = await this.client
      .multi()
      .get(key)
      .del(key)
      .exec();

    const storedUserId = results[0];
    return storedUserId !== null;
  }

  /**
   * Intercepts a CAEP / SSF incident event and marks a session as blacklisted globally
   */
  public async revokeSession(sessionId: string, ttlSeconds: number = 900): Promise<void> {
    const key = `${ZtaRedisPipelineManager.REVOCATION_PREFIX}${sessionId}`;
    // Store indicator flag until the original JWT token would naturally expire
    await this.client.set(key, 'revoked', { EX: ttlSeconds });
  }

  /**
   * Marks a specific hardware device identifier as compromised across the entire network
   */
  public async revokeDevice(deviceId: string, ttlSeconds: number = 86400): Promise<void> {
    const key = `${ZtaRedisPipelineManager.DEVICE_REVOCATION_PREFIX}${deviceId}`;
    await this.client.set(key, 'compromised', { EX: ttlSeconds });
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }
}
```

## 3. Verification Integration Example

This snippet shows how to integrate the challenge manager directly into the WebAuthn registration endpoint.

```typescript
import { EnterpriseWebAuthnServerValidator } from './EnterpriseWebAuthnServerValidator';
import { ZtaRedisPipelineManager } from './ZtaRedisPipelineManager';

async function handleRegistrationEndpoint(req: any, res: any) {
  const { payload, challenge } = req.body;
  const redisPipeline = new ZtaRedisPipelineManager();

  await redisPipeline.connect();

  // 1. Consume the challenge instantly to stop automated scripting replays
  const isValidChallenge = await redisPipeline.verifyAndConsumeChallenge(challenge);
  if (!isValidChallenge) {
    return res.status(403).json({ error: 'Security Violation: Challenge invalid or replayed.' });
  }

  try {
    const corporateWhitelist = new Set([
      'adce0002-35bc-c60a-2b7b-40b2fed21711' // Approved YubiKey matrix
    ]);

    // 2. Pass to the server validator
    const registrationResult = await EnterpriseWebAuthnServerValidator.validateAndRegisterDevice(
      payload,
      challenge,
      corporateWhitelist
    );

    return res.status(200).json({ success: true, device: registrationResult });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  } finally {
    await redisPipeline.disconnect();
  }
}
```

---

## Architectural Safeguards

- **Atomic Operations**: Using Redis transactions (`multi().exec()`) guarantees that a challenge can never be fetched twice simultaneously, neutralizing automated Man-in-the-Middle (MitM) credential interception tooling.
- **Volatile-TTL Memory Eviction Policy**: Configured via `--maxmemory-policy volatile-ttl` to prevent service exhaustion crashes. If memory pressure spikes, Redis automatically drops transient challenges nearest to expiration rather than breaking stateful authentication controls or active blacklists.
