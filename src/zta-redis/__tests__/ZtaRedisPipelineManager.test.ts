import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZtaRedisPipelineManager } from '../ZtaRedisPipelineManager';

const mockGet = vi.fn();
const mockDel = vi.fn();
const mockExec = vi.fn();
const mockSet = vi.fn();
const mockDisconnect = vi.fn();
const mockOn = vi.fn();
const mockConnect = vi.fn();
let capturedConfig: any;

let isOpen = false;

function makeMultiChain() {
  const chain: Record<string, any> = {
    get: mockGet.mockReturnThis(),
    del: mockDel.mockReturnThis(),
    exec: mockExec
  };
  Object.assign(chain, { get: vi.fn().mockReturnThis(), del: vi.fn().mockReturnThis(), exec: mockExec });
  chain.get = vi.fn().mockReturnValue(chain);
  chain.del = vi.fn().mockReturnValue(chain);
  chain.exec = mockExec;
  return chain;
}

vi.mock('redis', () => ({
  createClient: (config: any) => {
    capturedConfig = config;
    return {
      get isOpen() { return isOpen; },
      connect: mockConnect.mockImplementation(async () => { isOpen = true; }),
      on: mockOn,
      set: mockSet,
      multi: () => makeMultiChain(),
      disconnect: mockDisconnect.mockImplementation(async () => { isOpen = false; })
    };
  }
}));

describe('ZtaRedisPipelineManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isOpen = false;
    process.env.REDIS_SECURITY_PASSWORD = 'test-password';
    process.env.REDIS_PORT = '6379';
    capturedConfig = undefined;
  });

  it('throws when REDIS_SECURITY_PASSWORD is missing', () => {
    delete process.env.REDIS_SECURITY_PASSWORD;
    expect(() => new ZtaRedisPipelineManager()).toThrow('Infrastructure Fault');
  });

  it('connects successfully', async () => {
    const manager = new ZtaRedisPipelineManager();
    await manager.connect();
    expect(mockConnect).toHaveBeenCalled();
  });

  it('issueChallenge generates a base64url token and stores it with TTL', async () => {
    mockSet.mockResolvedValue('OK');
    const manager = new ZtaRedisPipelineManager();
    await manager.connect();
    const challenge = await manager.issueChallenge(120);
    expect(challenge).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(mockSet).toHaveBeenCalledWith(expect.stringContaining('zta:challenge:'), '1', { EX: 120 });
  });

  it('verifyChallenge successfully verifies and consumes a challenge', async () => {
    mockExec.mockResolvedValue(['user-123', 1]);
    const manager = new ZtaRedisPipelineManager();
    await manager.connect();
    const result = await manager.verifyChallenge('test-challenge-uuid');
    expect(result).toBe(true);
    expect(mockExec).toHaveBeenCalled();
  });

  it('verifyChallenge rejects a replayed challenge', async () => {
    mockExec.mockResolvedValue([null, 0]);
    const manager = new ZtaRedisPipelineManager();
    await manager.connect();
    const result = await manager.verifyChallenge('replayed-challenge');
    expect(result).toBe(false);
  });

  it('revokeSession stores revocation with TTL', async () => {
    mockSet.mockResolvedValue('OK');
    const manager = new ZtaRedisPipelineManager();
    await manager.connect();
    await manager.revokeSession('session-abc');
    expect(mockSet).toHaveBeenCalledWith('revoked:session:session-abc', 'revoked', { EX: 900 });
  });

  it('disconnects cleanly', async () => {
    const manager = new ZtaRedisPipelineManager();
    await manager.connect();
    await manager.disconnect();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('parses REDIS_PORT as a number for node-redis socket config', () => {
    process.env.REDIS_PORT = '6380';
    new ZtaRedisPipelineManager();
    expect(capturedConfig.socket.port).toBe(6380);
  });

  it('throws when REDIS_PORT is invalid', () => {
    process.env.REDIS_PORT = 'not-a-port';
    expect(() => new ZtaRedisPipelineManager()).toThrow('REDIS_PORT must be a valid TCP port number');
  });
});
