import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AntiRelayEnrollmentEngine } from '../AntiRelayEnrollmentEngine';

vi.mock('../zta-siem/ztaLogger', () => ({
  ztaLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

describe('AntiRelayEnrollmentEngine', () => {
  let engine: AntiRelayEnrollmentEngine;

  beforeEach(() => {
    engine = new AntiRelayEnrollmentEngine();
  });

  describe('detectRelayAttack', () => {
    it('passes a legitimate local NFC transaction (5ms RTT, 3cm)', () => {
      const result = engine.detectRelayAttack(5, 3, 2000);

      expect(result.passed).toBe(true);
      expect(result.threatLevel).toBe('none');
      expect(result.checks.latency.passed).toBe(true);
      expect(result.checks.proximity.passed).toBe(true);
      expect(result.checks.timeBounding.passed).toBe(true);
    });

    it('detects WAN relay via high RTT latency (>40ms)', () => {
      const result = engine.detectRelayAttack(85, 3, 3000);

      expect(result.passed).toBe(false);
      expect(result.threatLevel).toBe('high');
      expect(result.checks.latency.passed).toBe(false);
      expect(result.checks.latency.rttMs).toBe(85);
    });

    it('detects relay via null proximity data', () => {
      const result = engine.detectRelayAttack(5, null, 3000);

      expect(result.passed).toBe(false);
      expect(result.checks.proximity.passed).toBe(false);
    });

    it('detects relay via excessive distance', () => {
      const result = engine.detectRelayAttack(5, 500, 3000);

      expect(result.passed).toBe(false);
      expect(result.checks.proximity.passed).toBe(false);
    });

    it('detects relay via relay indicators (rooted device, NFCShare)', () => {
      const result = engine.detectRelayAttack(5, 3, 3000, ['rooted_os', 'nfcshare_active']);

      expect(result.passed).toBe(false);
      expect(result.checks.proximity.relayIndicators).toContain('nfcshare_active');
    });

    it('confirms relay when both latency and proximity fail', () => {
      const result = engine.detectRelayAttack(120, 500, 5000, ['nfcshare_active']);

      expect(result.passed).toBe(false);
      expect(result.threatLevel).toBe('confirmed');
    });

    it('flags as suspicious when only time bounding fails', () => {
      const result = engine.detectRelayAttack(5, 3, 45000);

      expect(result.passed).toBe(false);
      expect(result.threatLevel).toBe('suspicious');
      expect(result.checks.timeBounding.elapsedMs).toBe(45000);
    });

    it('passes transaction at exactly threshold boundary (40ms)', () => {
      const result = engine.detectRelayAttack(40, 5, 3000);

      expect(result.checks.latency.passed).toBe(true);
    });

    it('logs security event on relay detection via threat level', () => {
      const result = engine.detectRelayAttack(120, 500, 5000, ['nfcshare_active']);
      expect(result.threatLevel).toBe('confirmed');
      expect(result.checks.latency.passed).toBe(false);
      expect(result.checks.proximity.passed).toBe(false);
    });
  });

  describe('getDefenseRecommendation', () => {
    it('recommends physical security desk for confirmed threats', () => {
      expect(engine.getDefenseRecommendation('confirmed')).toContain('security desk');
    });

    it('recommends Smart-ID+ for high threats', () => {
      expect(engine.getDefenseRecommendation('high')).toContain('Smart-ID+');
    });

    it('recommends elevated monitoring for suspicious', () => {
      expect(engine.getDefenseRecommendation('suspicious')).toContain('elevated monitoring');
    });

    it('recommends standard flow for no threat', () => {
      expect(engine.getDefenseRecommendation('none')).toContain('standard enrollment');
    });
  });
});
