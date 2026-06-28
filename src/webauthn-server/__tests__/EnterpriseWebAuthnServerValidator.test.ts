import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnterpriseWebAuthnServerValidator } from '../EnterpriseWebAuthnServerValidator';

const mockVerifyRegistrationResponse = vi.fn();
const mockVerifyAuthenticationResponse = vi.fn();

vi.mock('@simplewebauthn/server', () => ({
  verifyRegistrationResponse: (...args: any[]) => mockVerifyRegistrationResponse(...args),
  verifyAuthenticationResponse: (...args: any[]) => mockVerifyAuthenticationResponse(...args),
}));

const mockVerifyChallenge = vi.fn();
const mockRedis = {
  verifyChallenge: mockVerifyChallenge,
  connect: vi.fn(),
  disconnect: vi.fn(),
} as any;

describe('EnterpriseWebAuthnServerValidator', () => {
  const WHITELIST = new Set(['adce0002-35bc-c60a-2b7b-40b2fed21711']);
  const validPayload = {
    id: 'cred-id',
    rawId: 'cred-raw-id',
    type: 'public-key' as const,
    response: {
      clientDataJSON: 'eyJvcmlnaW4iOiJodHRwczovL2VudGVycHJpc2UuZXUifQ',
      attestationObject: 'o2NmbXRmcGFja2Vk',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('verifyRegistration', () => {
    it('rejects replayed challenge via Redis pipeline', async () => {
      mockVerifyChallenge.mockResolvedValue(false);
      const validator = new EnterpriseWebAuthnServerValidator(mockRedis);
      await expect(
        validator.verifyRegistration(validPayload, 'replayed-challenge', WHITELIST)
      ).rejects.toThrow('Security Violation: Challenge invalid or replayed.');
    });

    it('verifies a valid registration', async () => {
      mockVerifyChallenge.mockResolvedValue(true);
      mockVerifyRegistrationResponse.mockResolvedValue({
        verified: true,
        registrationInfo: {
          credentialID: Buffer.from('cred-01'),
          credentialPublicKey: Buffer.from('pubkey-01'),
          counter: 0,
          aaguid: Buffer.from('adce000235bcc60a2b7b40b2fed21711', 'hex'),
          credentialDeviceType: 'single_device' as const,
        },
      });

      const validator = new EnterpriseWebAuthnServerValidator(mockRedis);
      const result = await validator.verifyRegistration(validPayload, 'valid-challenge', WHITELIST);

      expect(result.verified).toBe(true);
      expect(result.aaguid).toBe('adce0002-35bc-c60a-2b7b-40b2fed21711');
      expect(result.deviceType).toBe('single_device');
    });

    it('rejects anonymized attestation', async () => {
      mockVerifyChallenge.mockResolvedValue(true);
      mockVerifyRegistrationResponse.mockResolvedValue({
        verified: true,
        registrationInfo: {
          credentialID: Buffer.from('cred-01'),
          credentialPublicKey: Buffer.from('pubkey-01'),
          counter: 0,
          aaguid: Buffer.alloc(16, 0),
          credentialDeviceType: 'multi_device' as const,
        },
      });

      const validator = new EnterpriseWebAuthnServerValidator(mockRedis);
      await expect(
        validator.verifyRegistration(validPayload, 'valid-challenge', WHITELIST)
      ).rejects.toThrow('Security Violation: Attestation metadata is anonymized');
    });

    it('rejects non-whitelisted hardware', async () => {
      mockVerifyChallenge.mockResolvedValue(true);
      mockVerifyRegistrationResponse.mockResolvedValue({
        verified: true,
        registrationInfo: {
          credentialID: Buffer.from('cred-01'),
          credentialPublicKey: Buffer.from('pubkey-01'),
          counter: 0,
          aaguid: Buffer.from('ffffffffffffffffffffffffffffffff', 'hex'),
          credentialDeviceType: 'single_device' as const,
        },
      });

      const validator = new EnterpriseWebAuthnServerValidator(mockRedis);
      await expect(
        validator.verifyRegistration(validPayload, 'valid-challenge', WHITELIST)
      ).rejects.toThrow('Security Violation: Hardware authenticator not in enterprise whitelist');
    });

    it('rejects invalid origin', async () => {
      mockVerifyChallenge.mockResolvedValue(true);
      mockVerifyRegistrationResponse.mockRejectedValue(
        new Error('Origin https://evil.com does not match expected origin')
      );

      const validator = new EnterpriseWebAuthnServerValidator(mockRedis);
      await expect(
        validator.verifyRegistration(validPayload, 'valid-challenge', WHITELIST)
      ).rejects.toThrow('Security Violation: Cryptographic validation failed');
    });
  });

  describe('verifyAuthentication', () => {
    const authPayload = {
      id: 'cred-id',
      rawId: 'cred-raw-id',
      type: 'public-key' as const,
      response: {
        clientDataJSON: 'eyJvcmlnaW4iOiJodHRwczovL2VudGVycHJpc2UuZXUifQ',
        authenticatorData: 'auth-data-b64',
        signature: 'sig-b64',
      },
    };

    it('rejects replayed challenge', async () => {
      mockVerifyChallenge.mockResolvedValue(false);
      const validator = new EnterpriseWebAuthnServerValidator(mockRedis);
      await expect(
        validator.verifyAuthentication(authPayload, 'replayed-challenge', 'stored-pubkey')
      ).rejects.toThrow('Security Violation: Challenge invalid or replayed.');
    });

    it('verifies a valid authentication', async () => {
      mockVerifyChallenge.mockResolvedValue(true);
      mockVerifyAuthenticationResponse.mockResolvedValue({
        verified: true,
        authenticationInfo: {
          credentialID: 'cred-id',
          newCounter: 5,
        },
      });

      const validator = new EnterpriseWebAuthnServerValidator(mockRedis);
      const result = await validator.verifyAuthentication(
        authPayload,
        'valid-challenge',
        'stored-pubkey'
      );

      expect(result.verified).toBe(true);
      expect(result.counter).toBe(5);
      expect(result.credentialId).toBe('cred-id');
    });
  });
});
