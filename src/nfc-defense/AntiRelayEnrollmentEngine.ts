import { ztaLogger } from '../zta-siem/ztaLogger';

export interface RelayDetectionResult {
  passed: boolean;
  threatLevel: 'none' | 'suspicious' | 'high' | 'confirmed';
  checks: {
    latency: { passed: boolean; rttMs: number; thresholdMs: number };
    proximity: { passed: boolean; distanceCm: number | null; relayIndicators: string[] };
    timeBounding: { passed: boolean; elapsedMs: number; maxMs: number };
  };
}

export class AntiRelayEnrollmentEngine {
  private static RTT_THRESHOLD_MS = 40;
  private static TRANSACTION_MAX_MS = 30000;
  private static MAX_ALLOWED_DISTANCE_CM = 10;

  detectRelayAttack(
    roundTripLatencyMs: number,
    estimatedDistanceCm: number | null,
    transactionElapsedMs: number,
    relayIndicators: string[] = []
  ): RelayDetectionResult {
    const latencyPassed = roundTripLatencyMs <= AntiRelayEnrollmentEngine.RTT_THRESHOLD_MS;
    const proximityPassed =
      estimatedDistanceCm !== null &&
      estimatedDistanceCm >= 0 &&
      estimatedDistanceCm <= AntiRelayEnrollmentEngine.MAX_ALLOWED_DISTANCE_CM &&
      relayIndicators.length === 0;
    const timeBoundingPassed =
      transactionElapsedMs <= AntiRelayEnrollmentEngine.TRANSACTION_MAX_MS;

    const passed = latencyPassed && proximityPassed && timeBoundingPassed;

    let threatLevel: RelayDetectionResult['threatLevel'] = 'none';
    if (!passed) {
      if (!latencyPassed && !proximityPassed) {
        threatLevel = 'confirmed';
      } else if (!latencyPassed || !proximityPassed) {
        threatLevel = 'high';
      } else {
        threatLevel = 'suspicious';
      }
    }

    const result: RelayDetectionResult = {
      passed,
      threatLevel,
      checks: {
        latency: { passed: latencyPassed, rttMs: roundTripLatencyMs, thresholdMs: AntiRelayEnrollmentEngine.RTT_THRESHOLD_MS },
        proximity: { passed: proximityPassed, distanceCm: estimatedDistanceCm, relayIndicators },
        timeBounding: { passed: timeBoundingPassed, elapsedMs: transactionElapsedMs, maxMs: AntiRelayEnrollmentEngine.TRANSACTION_MAX_MS },
      },
    };

    if (!passed) {
      ztaLogger.error('NFC Relay Attack Detected', {
        action: 'RELAY_ATTACK_DETECTED',
        threatLevel,
        checks: result.checks,
      });
    }

    return result;
  }

  getDefenseRecommendation(threatLevel: RelayDetectionResult['threatLevel']): string {
    switch (threatLevel) {
      case 'confirmed':
        return 'Block enrollment. Require physical security token re-verification at security desk.';
      case 'high':
        return 'Require additional Smart-ID+ out-of-band verification before proceeding.';
      case 'suspicious':
        return 'Flag for security review. Allow with elevated monitoring and step-up auth.';
      default:
        return 'Proceed with standard enrollment flow.';
    }
  }
}
