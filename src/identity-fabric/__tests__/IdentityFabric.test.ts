import { describe, it, expect, vi, beforeEach } from 'vitest';
import { IdentityFabric } from '../IdentityFabric';

describe('IdentityFabric', () => {
  let fabric: IdentityFabric;

  beforeEach(() => {
    fabric = new IdentityFabric();
  });

  describe('Verification Layer — eIDAS 2.0 / Smart-ID+', () => {
    it('verifies high assurance eIDAS identity', () => {
      const token = Buffer.from(
        JSON.stringify({
          assurance: 'high',
          pid: { isValid: true, nationalIdentifier: 'EE39102140124' },
        })
      ).toString('base64url');

      expect(fabric.verifyIdentity(token, 'high')).toBe(true);
    });

    it('rejects when assurance level does not match required', () => {
      const token = Buffer.from(
        JSON.stringify({
          assurance: 'substantial',
          pid: { isValid: true },
        })
      ).toString('base64url');

      expect(() => fabric.verifyIdentity(token, 'high')).toThrow(
        'Security Violation: Identity assurance level high required, got substantial'
      );
    });

    it('rejects invalid PID', () => {
      const token = Buffer.from(
        JSON.stringify({
          assurance: 'high',
          pid: { isValid: false },
        })
      ).toString('base64url');

      expect(() => fabric.verifyIdentity(token, 'high')).toThrow(
        'Security Violation: Identity verification failed — invalid PID.'
      );
    });
  });

  describe('Authentication Layer — WebAuthn / FIDO2', () => {
    const WHITELIST = new Set(['adce0002-35bc-c60a-2b7b-40b2fed21711']);

    it('authenticates whitelisted device with user verification', () => {
      expect(
        fabric.authenticateDevice('cred-01', 'adce0002-35bc-c60a-2b7b-40b2fed21711', WHITELIST, true)
      ).toBe(true);
    });

    it('rejects missing user verification', () => {
      expect(() =>
        fabric.authenticateDevice('cred-01', 'adce0002-35bc-c60a-2b7b-40b2fed21711', WHITELIST, false)
      ).toThrow('Security Violation: User verification required');
    });

    it('rejects non-whitelisted device', () => {
      expect(() =>
        fabric.authenticateDevice('cred-99', 'ffffffff-ffff-ffff-ffff-ffffffffffff', WHITELIST, true)
      ).toThrow('Security Violation: Device AAGUID');
    });
  });

  describe('Enforcement Layer — Continuous Adaptive Trust (CAT)', () => {
    it('routes low-risk session as allowed', () => {
      fabric.addSession({
        sessionId: 's1',
        userId: 'usr_1',
        deviceId: 'dev_1',
        trustScore: 0.3,
        lastVerified: new Date(),
        activeAccessTokens: ['tok_a'],
      });

      const result = fabric.routeSession(fabric.getSession('s1')!, 0.25);
      expect(result).toBe('allow');
    });

    it('routes high-risk session to step-up', () => {
      const mockFn = vi.fn();
      fabric.on('session:step_up', mockFn);

      fabric.addSession({
        sessionId: 's2',
        userId: 'usr_2',
        deviceId: 'dev_2',
        trustScore: 0.3,
        lastVerified: new Date(),
        activeAccessTokens: [],
      });

      const result = fabric.routeSession(fabric.getSession('s2')!, 0.75);
      expect(result).toBe('step_up');
      expect(mockFn).toHaveBeenCalled();
    });

    it('blocks session with risk >= 0.9', () => {
      fabric.addSession({
        sessionId: 's3',
        userId: 'usr_3',
        deviceId: 'dev_3',
        trustScore: 0.3,
        lastVerified: new Date(),
        activeAccessTokens: [],
      });

      const result = fabric.routeSession(fabric.getSession('s3')!, 0.92);
      expect(result).toBe('block');
    });
  });

  describe('EU AI Act — Deterministic Fallbacks', () => {
    it('routes risk >= 0.85 to eIDAS re-verification', () => {
      expect(fabric.applyAiActDeterministicFallback(0.88)).toBe('eidas_reverify');
    });

    it('routes risk 0.7-0.84 to WebAuthn touch', () => {
      expect(fabric.applyAiActDeterministicFallback(0.72)).toBe('webauthn_touch');
    });

    it('routes low risk to no fallback', () => {
      expect(fabric.applyAiActDeterministicFallback(0.4)).toBe('none');
    });
  });

  describe('CAEP/SSF Event Stream', () => {
    it('handles device compromised event by revoking all tokens', () => {
      const mockFn = vi.fn();
      fabric.on('caep:revoke_all', mockFn);

      fabric.addSession({
        sessionId: 's7',
        userId: 'usr_7',
        deviceId: 'dev_7',
        trustScore: 0.3,
        lastVerified: new Date(),
        activeAccessTokens: ['tok_1', 'tok_2'],
      });

      fabric.handleCaepSsfEvent('tenant.identity.device_compromised', {
        sessionId: 's7',
        deviceId: 'dev_7',
      });

      expect(mockFn).toHaveBeenCalled();
      expect(fabric.getSession('s7')!.activeAccessTokens).toEqual([]);
    });

    it('handles session revoked event by removing session', () => {
      fabric.addSession({
        sessionId: 's8',
        userId: 'usr_8',
        deviceId: 'dev_8',
        trustScore: 0.3,
        lastVerified: new Date(),
        activeAccessTokens: [],
      });

      fabric.handleCaepSsfEvent('tenant.identity.session_revoked', {
        sessionId: 's8',
      });

      expect(fabric.getSession('s8')).toBeUndefined();
    });

    it('emits step-up on risk threshold exceeded', () => {
      const mockFn = vi.fn();
      fabric.on('caep:step_up', mockFn);

      fabric.addSession({
        sessionId: 's9',
        userId: 'usr_9',
        deviceId: 'dev_9',
        trustScore: 0.3,
        lastVerified: new Date(),
        activeAccessTokens: [],
      });

      fabric.handleCaepSsfEvent('tenant.identity.risk_threshold_exceeded', {
        sessionId: 's9',
        riskScore: 0.82,
      });

      expect(mockFn).toHaveBeenCalled();
    });
  });

  describe('OID4VC Selective Disclosure', () => {
    it('discloses only allowed claims', () => {
      const result = fabric.requestOid4vcSelectiveDisclosure({
        requiredClaims: ['auditor_certification', 'date_of_birth', 'department_membership'],
        purpose: 'Access audit',
        verifier: 'compliance-engine',
      });

      expect(result.claims).toEqual(['auditor_certification', 'department_membership']);
      expect(result.selectiveDisclosure).toBe(true);
    });

    it('returns no claims when none are allowed', () => {
      const result = fabric.requestOid4vcSelectiveDisclosure({
        requiredClaims: ['date_of_birth', 'home_address'],
        purpose: 'Onboarding',
        verifier: 'hr-system',
      });

      expect(result.claims).toEqual([]);
      expect(result.selectiveDisclosure).toBe(true);
    });

    it('emits privacy violation event for blocked claims', () => {
      const mockFn = vi.fn();
      fabric.on('oid4vc:privacy_violation_blocked', mockFn);

      fabric.requestOid4vcSelectiveDisclosure({
        requiredClaims: ['date_of_birth'],
        purpose: 'Marketing',
        verifier: 'analytics',
      });

      expect(mockFn).toHaveBeenCalledWith(
        expect.objectContaining({
          blocked: ['date_of_birth'],
        })
      );
    });
  });

  describe('Trust Evaluation', () => {
    it('aggregates risk signals into composite trust score', () => {
      const signals = [
        { source: 'edr-agent', type: 'device_health' as const, risk: 0.8, timestamp: new Date() },
        { source: 'ueba-model', type: 'behavioral' as const, risk: 0.4, timestamp: new Date() },
      ];

      const score = fabric.evaluateTrust(signals);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThan(1);
    });

    it('produces high score for high-risk signals', () => {
      const signals = [
        { source: 'cve-scanner', type: 'cve' as const, risk: 1.0, timestamp: new Date() },
        { source: 'edr-agent', type: 'device_health' as const, risk: 0.9, timestamp: new Date() },
      ];

      const score = fabric.evaluateTrust(signals);
      expect(score).toBeGreaterThan(0.2);
    });
  });
});
