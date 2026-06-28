import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { WebAuthnClientHandler } from '../WebAuthnClientHandler';

const mockCreate = vi.fn();
const mockGet = vi.fn();
const mockIsUVPAA = vi.fn();

beforeEach(() => {
  vi.restoreAllMocks();
  mockCreate.mockReset();
  mockGet.mockReset();
  mockIsUVPAA.mockReset();

  vi.stubGlobal('btoa', (s: string) => Buffer.from(s, 'binary').toString('base64'));
  vi.stubGlobal('atob', (s: string) => Buffer.from(s, 'base64').toString('binary'));
  vi.stubGlobal('PublicKeyCredential', class MockPKC {
    static isUserVerifyingPlatformAuthenticatorAvailable = mockIsUVPAA;
  });

  Object.defineProperty(globalThis, 'navigator', {
    value: { credentials: { create: mockCreate, get: mockGet } },
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('WebAuthnClientHandler', () => {
  describe('isPlatformAvailable', () => {
    it('returns true when platform authenticator is available', async () => {
      mockIsUVPAA.mockResolvedValue(true);
      const result = await WebAuthnClientHandler.isPlatformAvailable();
      expect(result).toBe(true);
    });

    it('returns false when not available', async () => {
      mockIsUVPAA.mockResolvedValue(false);
      const result = await WebAuthnClientHandler.isPlatformAvailable();
      expect(result).toBe(false);
    });

    it('returns false when PublicKeyCredential is missing', async () => {
      vi.stubGlobal('PublicKeyCredential', undefined);
      const result = await WebAuthnClientHandler.isPlatformAvailable();
      expect(result).toBe(false);
      vi.stubGlobal('PublicKeyCredential', class MockPKC {
        static isUserVerifyingPlatformAuthenticatorAvailable = mockIsUVPAA;
      });
    });
  });

  describe('createCredential', () => {
    const options = {
      challenge: Buffer.from('test-challenge').toString('base64url'),
      rp: { name: 'Enterprise ZTA', id: 'internal.enterprise.eu' },
      user: { id: Buffer.from('user-42').toString('base64url'), name: 'alice', displayName: 'Alice' },
      pubKeyCredParams: [
        { type: 'public-key' as const, alg: -7 },
        { type: 'public-key' as const, alg: -37 },
      ],
    };

    it('creates a credential with enterprise attestation parameters', async () => {
      const rawId = new ArrayBuffer(32);
      new Uint8Array(rawId).fill(0x42);
      const clientDataJSON = new TextEncoder().encode('{"origin":"https://enterprise.eu"}').buffer;
      const attestationObj = new ArrayBuffer(64);

      mockCreate.mockResolvedValue({
        id: 'cred-abc',
        rawId,
        type: 'public-key',
        response: {
          clientDataJSON,
          attestationObject: attestationObj,
        },
      });

      const result = await WebAuthnClientHandler.createCredential(options);

      expect(result.id).toBe('cred-abc');
      expect(result.type).toBe('public-key');
      expect(result.response.attestationObject).toBeDefined();
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          publicKey: expect.objectContaining({
            attestation: 'enterprise',
            authenticatorSelection: expect.objectContaining({
              residentKey: 'required',
              userVerification: 'required',
            }),
          }),
        })
      );
    });

    it('enforces ES256 (alg: -7) and RSASSA-PSS (alg: -37)', async () => {
      const rawId = new ArrayBuffer(32);
      mockCreate.mockResolvedValue({
        id: 'cred-abc',
        rawId,
        type: 'public-key',
        response: {
          clientDataJSON: new ArrayBuffer(128),
          attestationObject: new ArrayBuffer(64),
        },
      });

      await WebAuthnClientHandler.createCredential(options);

      const callArg = mockCreate.mock.calls[0][0];
      const params = callArg.publicKey.pubKeyCredParams;
      const algs = params.map((p: any) => p.alg);
      expect(algs).toContain(-7);
      expect(algs).toContain(-37);
    });

    it('rejects when user cancels (NotAllowedError)', async () => {
      const err = new DOMException('User cancelled', 'NotAllowedError');
      mockCreate.mockRejectedValue(err);
      await expect(WebAuthnClientHandler.createCredential(options)).rejects.toThrow(
        'User rejected biometric prompt'
      );
    });

    it('throws when navigator.credentials is missing', async () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: undefined,
        configurable: true,
        writable: true,
      });
      await expect(WebAuthnClientHandler.createCredential(options)).rejects.toThrow(
        'WebAuthn not supported'
      );
      Object.defineProperty(globalThis, 'navigator', {
        value: { credentials: { create: mockCreate, get: mockGet } },
        configurable: true,
        writable: true,
      });
    });

    it('throws when PublicKeyCredential is missing', async () => {
      vi.stubGlobal('PublicKeyCredential', undefined);
      await expect(WebAuthnClientHandler.createCredential(options)).rejects.toThrow(
        'WebAuthn not supported'
      );
      vi.stubGlobal('PublicKeyCredential', class MockPKC {
        static isUserVerifyingPlatformAuthenticatorAvailable = mockIsUVPAA;
      });
    });

    it('normalizes base64url challenge/input before decoding', async () => {
      vi.stubGlobal('atob', (s: string) => {
        if (/[-_]/.test(s) || s.length % 4 !== 0) {
          throw new Error('InvalidCharacterError');
        }
        return Buffer.from(s, 'base64').toString('binary');
      });

      mockCreate.mockResolvedValue({
        id: 'cred-urlsafe',
        rawId: new ArrayBuffer(32),
        type: 'public-key',
        response: {
          clientDataJSON: new ArrayBuffer(128),
          attestationObject: new ArrayBuffer(64),
        },
      });

      const optionsWithUrlSafeInput = {
        ...options,
        challenge: Buffer.from([251, 255, 239, 250]).toString('base64url'),
        user: {
          ...options.user,
          id: Buffer.from([251, 255, 239]).toString('base64url'),
        },
      };

      await expect(
        WebAuthnClientHandler.createCredential(optionsWithUrlSafeInput)
      ).resolves.toEqual(expect.objectContaining({ id: 'cred-urlsafe' }));
    });
  });

  describe('getCredential', () => {
    it('gets a credential assertion', async () => {
      const challenge = Buffer.from('assertion-challenge').toString('base64url');
      const rawId = new ArrayBuffer(32);
      new Uint8Array(rawId).fill(0x11);

      mockGet.mockResolvedValue({
        id: 'cred-xyz',
        rawId,
        type: 'public-key',
        response: {
          clientDataJSON: new TextEncoder().encode('{"origin":"https://enterprise.eu"}').buffer,
          authenticatorData: new ArrayBuffer(37),
          signature: new ArrayBuffer(64),
          userHandle: new TextEncoder().encode('user-42').buffer,
        },
      });

      const result = await WebAuthnClientHandler.getCredential(challenge);

      expect(result.id).toBe('cred-xyz');
      expect(result.response.authenticatorData).toBeDefined();
      expect(result.response.signature).toBeDefined();
      expect(result.response.userHandle).toBeDefined();
      expect(result.type).toBe('public-key');
    });

    it('rejects on NotAllowedError', async () => {
      const err = new DOMException('User cancelled', 'NotAllowedError');
      mockGet.mockRejectedValue(err);
      await expect(
        WebAuthnClientHandler.getCredential(
          Buffer.from('challenge').toString('base64url')
        )
      ).rejects.toThrow('User rejected biometric prompt');
    });

    it('throws when navigator is missing', async () => {
      Object.defineProperty(globalThis, 'navigator', {
        value: undefined,
        configurable: true,
        writable: true,
      });
      await expect(
        WebAuthnClientHandler.getCredential(
          Buffer.from('challenge').toString('base64url')
        )
      ).rejects.toThrow('WebAuthn not supported');
      Object.defineProperty(globalThis, 'navigator', {
        value: { credentials: { create: mockCreate, get: mockGet } },
        configurable: true,
        writable: true,
      });
    });
  });
});
