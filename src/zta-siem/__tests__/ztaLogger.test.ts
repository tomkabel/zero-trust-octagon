import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ztaLogger, logSecurityEvent } from '../ztaLogger';

describe('ztaLogger', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('info writes structured JSON to stdout', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    ztaLogger.info('Service started', { pid: 1234 });
    expect(writeSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(writeSpy.mock.calls[0][0] as string);
    expect(output.level).toBe('INFO');
    expect(output.message).toBe('Service started');
    expect(output.pid).toBe(1234);
    expect(output.timestamp).toBeDefined();
  });

  it('warn writes structured JSON to stdout', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    ztaLogger.warn('Rate limit approaching', { threshold: 0.9 });
    expect(writeSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(writeSpy.mock.calls[0][0] as string);
    expect(output.level).toBe('WARN');
    expect(output.threshold).toBe(0.9);
  });

  it('error writes to stderr and includes error.message only', () => {
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const err = new Error('Infrastructure Fault: Redis connection refused');
    ztaLogger.error('Redis connection failed', { error: err });
    expect(writeSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(writeSpy.mock.calls[0][0] as string);
    expect(output.level).toBe('ERROR');
    expect(output.error.message).toBe('Infrastructure Fault: Redis connection refused');
    expect(output.error.stack).toBeUndefined();
  });

  it('error never includes stack traces in log output', () => {
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    const err = new Error('Security Violation: Unauthorized access');
    ztaLogger.error('Auth failure', { error: err });
    const output = JSON.parse(writeSpy.mock.calls[0][0] as string);
    expect(output.error.stack).toBeUndefined();
  });
});

describe('logSecurityEvent', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('logs CHALLENGE_CONSUMED as info with regulatory tags', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logSecurityEvent({
      action: 'CHALLENGE_CONSUMED',
      userId: 'user-42',
      challenge: 'abc-123'
    });
    const output = JSON.parse(writeSpy.mock.calls[0][0] as string);
    expect(output.level).toBe('INFO');
    expect(output.regulatory_tags).toEqual(['NIS2_ART_21', 'ZTA_CONTINUOUS_AUTH']);
    expect(output.userId).toBe('user-42');
  });

  it('logs REPLAY_ATTACK_DETECTED as error', () => {
    const writeSpy = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
    logSecurityEvent({
      action: 'REPLAY_ATTACK_DETECTED',
      userId: 'user-99',
      challenge: 'replay-456'
    });
    const output = JSON.parse(writeSpy.mock.calls[0][0] as string);
    expect(output.level).toBe('ERROR');
    expect(output.action).toBe('REPLAY_ATTACK_DETECTED');
    expect(output.challenge).toBe('replay-456');
  });

  it('logs SESSION_REVOKED as info', () => {
    const writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    logSecurityEvent({
      action: 'SESSION_REVOKED',
      userId: 'user-7'
    });
    const output = JSON.parse(writeSpy.mock.calls[0][0] as string);
    expect(output.level).toBe('INFO');
    expect(output.action).toBe('SESSION_REVOKED');
  });
});

describe('fluent-bit.conf structural validation', () => {
  const fs = require('fs');
  const path = require('path');

  it('fluent-bit.conf exists and contains required sections', () => {
    const configPath = path.resolve(__dirname, '../../../fluent-bit.conf');
    const content = fs.readFileSync(configPath, 'utf-8');
    expect(content).toContain('[INPUT]');
    expect(content).toContain('Name         tail');
    expect(content).toContain('[FILTER]');
    expect(content).toContain('[OUTPUT]');
    expect(content).toContain('Splunk_Token');
  });

  it('fluent-bit.conf references JSON parser for Redis input', () => {
    const configPath = path.resolve(__dirname, '../../../fluent-bit.conf');
    const content = fs.readFileSync(configPath, 'utf-8');
    expect(content).toContain('Parser       json');
    expect(content).toContain('Message_Key  log');
  });
});
