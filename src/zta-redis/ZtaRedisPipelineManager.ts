import { createClient, RedisClientType } from 'redis';
import { randomBytes } from 'crypto';

export class ZtaRedisPipelineManager {
  private client: RedisClientType;
  private static CHALLENGE_PREFIX = 'zta:challenge:';
  private static REVOCATION_PREFIX = 'revoked:session:';

  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = Number.parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_SECURITY_PASSWORD;
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error('Infrastructure Fault: REDIS_PORT must be a valid TCP port number');
    }
    if (!password) throw new Error('Infrastructure Fault: REDIS_SECURITY_PASSWORD environment variable is required');

    this.client = createClient({
      socket: { host, port },
      password,
    });

    this.client.on('error', (err) => console.error('ZTA Redis Pipeline Error:', err));
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  public async issueChallenge(ttlSeconds: number): Promise<string> {
    const challenge = randomBytes(32).toString('base64url');
    const key = `${ZtaRedisPipelineManager.CHALLENGE_PREFIX}${challenge}`;
    await this.client.set(key, '1', { EX: ttlSeconds });
    return challenge;
  }

  public async verifyChallenge(challengeToken: string): Promise<boolean> {
    const key = `${ZtaRedisPipelineManager.CHALLENGE_PREFIX}${challengeToken}`;
    const results = await this.client
      .multi()
      .get(key)
      .del(key)
      .exec();

    const storedValue = Array.isArray(results) && results.length > 0 ? results[0] : null;
    return storedValue !== null;
  }

  public async revokeSession(sessionId: string): Promise<void> {
    const key = `${ZtaRedisPipelineManager.REVOCATION_PREFIX}${sessionId}`;
    await this.client.set(key, 'revoked', { EX: 900 });
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
    }
  }
}
