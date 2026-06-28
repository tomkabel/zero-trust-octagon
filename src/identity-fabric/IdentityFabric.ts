import { EventEmitter } from 'events';

export interface TrustSignal {
  source: string;
  type: 'device_health' | 'behavioral' | 'telemetry' | 'cve' | 'location';
  risk: number;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SessionContext {
  sessionId: string;
  userId: string;
  deviceId: string;
  trustScore: number;
  lastVerified: Date;
  activeAccessTokens: string[];
}

export interface Oid4vcRequest {
  requiredClaims: string[];
  purpose: string;
  verifier: string;
}

export interface Oid4vcDisclosure {
  claims: string[];
  selectiveDisclosure: boolean;
}

export class IdentityFabric extends EventEmitter {
  private sessions = new Map<string, SessionContext>();
  private static HIGH_RISK_THRESHOLD = 0.7;
  private static MAX_ACCESS_TOKENS = 5;

  constructor() {
    super();
  }

  verifyIdentity(presentationToken: string, assuranceRequired: 'high' | 'substantial'): boolean {
    try {
      const { assurance, pid } = JSON.parse(Buffer.from(presentationToken, 'base64url').toString());
      if (assurance !== assuranceRequired) {
        throw new Error(
          `Security Violation: Identity assurance level ${assuranceRequired} required, got ${assurance}`
        );
      }
      if (!pid?.isValid) {
        throw new Error('Security Violation: Identity verification failed — invalid PID.');
      }
      return true;
    } catch (err: unknown) {
      if ((err as Error).message.startsWith('Security Violation')) throw err;
      throw new Error('Security Violation: OID4VP presentation validation failed.');
    }
  }

  authenticateDevice(
    credentialId: string,
    aaguid: string,
    whitelist: Set<string>,
    userVerificationDone: boolean
  ): boolean {
    if (!userVerificationDone) {
      throw new Error('Security Violation: User verification required — biometric or PIN not detected.');
    }
    if (!whitelist.has(aaguid)) {
      throw new Error(
        `Security Violation: Device AAGUID ${aaguid} not in enterprise hardware whitelist.`
      );
    }
    return true;
  }

  evaluateTrust(signals: TrustSignal[]): number {
    if (signals.length === 0) return 0;

    const weights: Record<TrustSignal['type'], number> = {
      cve: 0.35,
      device_health: 0.20,
      behavioral: 0.15,
      telemetry: 0.15,
      location: 0.15,
    };

    let score = 0;
    let totalWeight = 0;
    for (const signal of signals) {
      const w = weights[signal.type] || 0;
      score += signal.risk * w;
      totalWeight += w;
    }

    return totalWeight > 0 ? Math.min(score / totalWeight, 1.0) : 0;
  }

  routeSession(session: SessionContext, riskScore: number): 'allow' | 'step_up' | 'block' {
    if (riskScore >= 0.9) {
      this.emit('session:blocked', { sessionId: session.sessionId, riskScore });
      return 'block';
    }

    if (riskScore >= IdentityFabric.HIGH_RISK_THRESHOLD) {
      this.emit('session:step_up', { sessionId: session.sessionId, riskScore });
      return 'step_up';
    }

    if (session.activeAccessTokens.length >= IdentityFabric.MAX_ACCESS_TOKENS) {
      this.emit('session:token_limit', { sessionId: session.sessionId, count: session.activeAccessTokens.length });
      return 'block';
    }

    return 'allow';
  }

  applyAiActDeterministicFallback(riskScore: number): 'eidas_reverify' | 'webauthn_touch' | 'none' {
    if (riskScore >= 0.85) {
      return 'eidas_reverify';
    }
    if (riskScore >= 0.7) {
      return 'webauthn_touch';
    }
    return 'none';
  }

  handleCaepSsfEvent(eventType: string, payload: Record<string, unknown>): void {
    const sessionId = payload.sessionId as string;

    switch (eventType) {
      case 'tenant.identity.device_compromised': {
        this.emit('caep:revoke_all', { sessionId, deviceId: payload.deviceId });
        if (sessionId && this.sessions.has(sessionId)) {
          const session = this.sessions.get(sessionId)!;
          session.activeAccessTokens = [];
        }
        break;
      }
      case 'tenant.identity.session_revoked': {
        this.emit('caep:session_kill', { sessionId });
        this.sessions.delete(sessionId);
        break;
      }
      case 'tenant.identity.risk_threshold_exceeded': {
        const session = this.sessions.get(sessionId);
        if (session) {
          const raw = payload.riskScore;
          const riskScore = typeof raw === 'number' ? raw : parseFloat(String(raw ?? ''));
          if (!isNaN(riskScore)) {
            session.trustScore = riskScore;
          }
        }
        this.emit('caep:step_up', { sessionId, riskScore: payload.riskScore });
        break;
      }
      default:
        this.emit('caep:unknown', { eventType, payload });
    }
  }

  requestOid4vcSelectiveDisclosure(request: Oid4vcRequest): Oid4vcDisclosure {
    const claimAllowlist = [
      'auditor_certification',
      'security_clearance',
      'department_membership',
      'role_assignment',
    ];

    const disclosed = request.requiredClaims.filter((c) => claimAllowlist.includes(c));
    const blocked = request.requiredClaims.filter((c) => !claimAllowlist.includes(c));

    if (blocked.length > 0) {
      this.emit('oid4vc:privacy_violation_blocked', { blocked, purpose: request.purpose });
    }

    return {
      claims: disclosed,
      selectiveDisclosure: disclosed.length < request.requiredClaims.length,
    };
  }

  addSession(session: SessionContext): void {
    this.sessions.set(session.sessionId, session);
  }

  getSession(sessionId: string): SessionContext | undefined {
    return this.sessions.get(sessionId);
  }

  getActiveSessions(): number {
    return this.sessions.size;
  }
}
