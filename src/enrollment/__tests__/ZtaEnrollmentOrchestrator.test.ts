import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ZtaEnrollmentOrchestrator } from '../ZtaEnrollmentOrchestrator';

const mockRedis = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  issueChallenge: vi.fn(),
  verifyChallenge: vi.fn(),
  revokeSession: vi.fn(),
} as any;

vi.mock('../zta-siem/ztaLogger', () => ({
  ztaLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

const VALID_EIDAS_TOKEN = (() => {
  const payload = {
    pid: {
      isValid: true,
      assuranceLevel: 'high',
      nationalIdentifier: 'EE39102140124',
      givenName: 'Mari',
      familyName: 'Tamm',
    },
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
})();

const mockDeviceValidator = {
  verifyRegistration: vi.fn(),
};

describe('ZtaEnrollmentOrchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRedis.connect.mockResolvedValue(undefined);
    mockRedis.disconnect.mockResolvedValue(undefined);
    mockRedis.issueChallenge.mockResolvedValue('issued-challenge-token');
  });

  describe('initializeEnrollment', () => {
    it('verifies eIDAS 2.0 High LoA token and returns WebAuthn options', async () => {
      const orchestrator = new ZtaEnrollmentOrchestrator(mockRedis, mockDeviceValidator);
      const result = await orchestrator.initializeEnrollment({
        eidasToken: VALID_EIDAS_TOKEN,
        userEmail: 'mari.tamm@enterprise.eu',
      });

      expect(result.challenge).toBe('issued-challenge-token');
      expect(mockRedis.issueChallenge).toHaveBeenCalledWith(120);
      expect(result.rp.id).toBe('internal.enterprise.eu');
      expect(result.user.name).toBe('mari.tamm@enterprise.eu');
      expect(result.user.displayName).toBe('Mari Tamm');
      expect(result.pubKeyCredParams).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ alg: -7 }),
          expect.objectContaining({ alg: -37 }),
        ])
      );
    });

    it('rejects low assurance level tokens', async () => {
      const lowToken = Buffer.from(
        JSON.stringify({ pid: { isValid: true, assuranceLevel: 'low' } })
      ).toString('base64url');

      const orchestrator = new ZtaEnrollmentOrchestrator(mockRedis);
      await expect(
        orchestrator.initializeEnrollment({
          eidasToken: lowToken,
          userEmail: 'test@enterprise.eu',
        })
      ).rejects.toThrow('Security Violation: Identity verification requires eIDAS 2.0 High Level');
    });

    it('rejects invalid tokens', async () => {
      const invalidToken = Buffer.from(
        JSON.stringify({ pid: { isValid: false, assuranceLevel: 'high' } })
      ).toString('base64url');

      const orchestrator = new ZtaEnrollmentOrchestrator(mockRedis);
      await expect(
        orchestrator.initializeEnrollment({
          eidasToken: invalidToken,
          userEmail: 'test@enterprise.eu',
        })
      ).rejects.toThrow('Security Violation: Identity verification requires eIDAS 2.0 High Level');
    });

    it('throws on malformed tokens', async () => {
      const orchestrator = new ZtaEnrollmentOrchestrator(mockRedis);
      await expect(
        orchestrator.initializeEnrollment({
          eidasToken: 'not-a-valid-token!',
          userEmail: 'test@enterprise.eu',
        })
      ).rejects.toThrow('Security Violation: OID4VP token validation failed.');
    });
  });

  describe('finalizeEnrollment', () => {
    it('completes enrollment with valid challenge and device attestation', async () => {
      mockRedis.verifyChallenge.mockResolvedValue(true);
      mockDeviceValidator.verifyRegistration.mockResolvedValue({
        verified: true,
        aaguid: 'adce0002-35bc-c60a-2b7b-40b2fed21711',
        credentialId: 'cred-final-123',
        publicKey: 'pubkey-b64',
        counter: 0,
        deviceType: 'single_device',
      });

      const orchestrator = new ZtaEnrollmentOrchestrator(mockRedis, mockDeviceValidator);
      const result = await orchestrator.finalizeEnrollment({
        clientPayload: { id: 'test-payload' },
        challenge: 'valid-challenge',
      });

      expect(result.success).toBe(true);
      expect(result.credentialId).toBe('cred-final-123');
    });

    it('rejects replayed challenge', async () => {
      mockRedis.verifyChallenge.mockResolvedValue(false);

      const orchestrator = new ZtaEnrollmentOrchestrator(mockRedis);
      await expect(
        orchestrator.finalizeEnrollment({
          clientPayload: { id: 'test' },
          challenge: 'replayed-challenge',
        })
      ).rejects.toThrow('Security Violation: Challenge invalid or replayed.');
    });

    it('propagates device attestation rejection', async () => {
      mockRedis.verifyChallenge.mockResolvedValue(true);
      mockDeviceValidator.verifyRegistration.mockRejectedValue(
        new Error('Security Violation: Hardware authenticator not in enterprise whitelist')
      );

      const orchestrator = new ZtaEnrollmentOrchestrator(mockRedis, mockDeviceValidator);
      await expect(
        orchestrator.finalizeEnrollment({
          clientPayload: { id: 'evil-device' },
          challenge: 'valid-challenge',
        })
      ).rejects.toThrow('Hardware authenticator not in enterprise whitelist');
    });

    it('rejects enrollment when validator returns verified=false', async () => {
      mockRedis.verifyChallenge.mockResolvedValue(true);
      mockDeviceValidator.verifyRegistration.mockResolvedValue({
        verified: false,
        aaguid: 'adce0002-35bc-c60a-2b7b-40b2fed21711',
        credentialId: 'cred-final-123',
      });

      const orchestrator = new ZtaEnrollmentOrchestrator(mockRedis, mockDeviceValidator);
      await expect(
        orchestrator.finalizeEnrollment({
          clientPayload: { id: 'test-payload' },
          challenge: 'valid-challenge',
        })
      ).rejects.toThrow('Security Violation: Device registration verification failed.');
    });
  });
});
