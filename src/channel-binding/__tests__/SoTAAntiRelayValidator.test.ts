import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SoTAAntiRelayValidator } from '../SoTAAntiRelayValidator';

vi.mock('../zta-siem/ztaLogger', () => ({
  ztaLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SoTAAntiRelayValidator', () => {
  let validator: SoTAAntiRelayValidator;

  beforeEach(() => {
    validator = new SoTAAntiRelayValidator();
    vi.clearAllMocks();
  });

  describe('createChannelBinding', () => {
    it('creates a cryptographic binding between NFC session and enrollment transaction', () => {
      const binding = validator.createChannelBinding(
        'nfc-session-001',
        'enroll-txn-001'
      );

      expect(binding.sessionId).toBe('nfc-session-001');
      expect(binding.channelHash).toHaveLength(64);
      expect(binding.transactionHash).toHaveLength(64);
      expect(binding.boundAt).toBeInstanceOf(Date);
      expect(binding.expiresAt.getTime()).toBeGreaterThan(binding.boundAt.getTime());
    });

    it('generates unique channel hashes for different sessions', () => {
      const b1 = validator.createChannelBinding('sess-a', 'txn-a');
      const b2 = validator.createChannelBinding('sess-b', 'txn-b');

      expect(b1.channelHash).not.toBe(b2.channelHash);
      expect(b1.transactionHash).not.toBe(b2.transactionHash);
    });
  });

  describe('validateChannelBinding', () => {
    it('validates a legitimate channel binding', () => {
      const binding = validator.createChannelBinding('nfc-123', 'enroll-456');

      expect(
        validator.validateChannelBinding('nfc-123', binding.channelHash, 'enroll-456')
      ).toBe(true);
    });

    it('rejects with wrong channel hash (relay attack detection)', () => {
      validator.createChannelBinding('nfc-123', 'enroll-456');

      expect(() =>
        validator.validateChannelBinding(
          'nfc-123',
          '0000000000000000000000000000000000000000000000000000000000000000',
          'enroll-456'
        )
      ).toThrow('Security Violation: Cryptographic channel hash mismatch');
    });

    it('rejects unknown NFC session', () => {
      expect(() =>
        validator.validateChannelBinding(
          'nonexistent-session',
          'some-hash',
          'some-txn'
        )
      ).toThrow('Security Violation: No channel binding found for this NFC session.');
    });

    it('rejects expired bindings (bypassing time via direct date manipulation)', () => {
      const binding = validator.createChannelBinding('nfc-exp', 'enroll-exp');

      const originalDate = Date;
      const mockDate = class extends Date {
        constructor() {
          super();
          return new originalDate(originalDate.now() + 10000000);
        }
        static now() {
          return originalDate.now() + 10000000;
        }
      } as any;
      globalThis.Date = mockDate;

      try {
        expect(() =>
          validator.validateChannelBinding('nfc-exp', binding.channelHash, 'enroll-exp')
        ).toThrow('Security Violation: Channel binding has expired');
      } finally {
        globalThis.Date = originalDate;
      }
    });
  });

  describe('revokeChannelBinding', () => {
    it('removes binding from active set', () => {
      validator.createChannelBinding('nfc-rm', 'enroll-rm');
      expect(validator.getActiveBindings()).toBe(1);

      validator.revokeChannelBinding('nfc-rm');
      expect(validator.getActiveBindings()).toBe(0);
    });

    it('does not throw when revoking non-existent binding', () => {
      expect(() => validator.revokeChannelBinding('nonexistent')).not.toThrow();
    });
  });

  describe('getActiveBindings', () => {
    it('returns count of active bindings and cleans expired ones', () => {
      validator.createChannelBinding('nfc-a', 'txn-a');
      validator.createChannelBinding('nfc-b', 'txn-b');

      expect(validator.getActiveBindings()).toBe(2);

      const originalDate = Date;
      const mockDate = class extends Date {
        constructor() {
          super();
          return new originalDate(originalDate.now() + 10000000);
        }
        static now() {
          return originalDate.now() + 10000000;
        }
      } as any;
      globalThis.Date = mockDate;

      try {
        expect(validator.getActiveBindings()).toBe(0);
      } finally {
        globalThis.Date = originalDate;
      }
    });
  });
});
