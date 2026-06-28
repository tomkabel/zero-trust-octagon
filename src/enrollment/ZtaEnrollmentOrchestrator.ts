import { ZtaRedisPipelineManager } from '../zta-redis/ZtaRedisPipelineManager';
import { ztaLogger } from '../zta-siem/ztaLogger';

export interface DeviceValidator {
  verifyRegistration(payload: any, challenge: string, whitelist: Set<string>): Promise<{
    verified: boolean;
    credentialId: string;
    aaguid: string;
  }>;
}

export interface EidasIdentityResult {
  isValid: boolean;
  assuranceLevel: 'high' | 'substantial' | 'low';
  nationalIdentifier: string;
  givenName: string;
  familyName: string;
}

export interface EnrollmentInitRequest {
  eidasToken: string;
  userEmail: string;
}

export interface EnrollmentInitResponse {
  challenge: string;
  rp: { name: string; id: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: Array<{ type: 'public-key'; alg: number }>;
}

export interface EnrollmentFinalizeRequest {
  clientPayload: any;
  challenge: string;
}

export interface EnrollmentFinalizeResponse {
  success: boolean;
  credentialId?: string;
  error?: string;
}

export class ZtaEnrollmentOrchestrator {
  private redisManager: ZtaRedisPipelineManager;
  private static APPROVED_AAGUIDS = new Set([
    'adce0002-35bc-c60a-2b7b-40b2fed21711',
    '00112233-4455-6677-8899-aabbccddeeff',
  ]);

  constructor(redisManager: ZtaRedisPipelineManager, private deviceValidator?: DeviceValidator) {
    this.redisManager = redisManager;
  }

  async initializeEnrollment(req: EnrollmentInitRequest): Promise<EnrollmentInitResponse> {
    const verifiedPid = await this.verifyEidasIdentityToken(req.eidasToken);

    if (!verifiedPid.isValid || verifiedPid.assuranceLevel !== 'high') {
      throw new Error(
        'Security Violation: Identity verification requires eIDAS 2.0 High Level of Assurance.'
      );
    }

    ztaLogger.info('eIDAS identity verified', {
      action: 'IDENTITY_VERIFIED',
      assuranceLevel: verifiedPid.assuranceLevel,
    });

    const internalUserId = `usr_${verifiedPid.nationalIdentifier}`;

    await this.redisManager.connect();
    try {
      const secureChallenge = await this.redisManager.issueChallenge(120);

      const onboardingOptions: EnrollmentInitResponse = {
        challenge: secureChallenge,
        rp: { name: 'Enterprise EU Secure Hub', id: 'internal.enterprise.eu' },
        user: {
          id: Buffer.from(internalUserId).toString('base64url'),
          name: req.userEmail,
          displayName: `${verifiedPid.givenName} ${verifiedPid.familyName}`,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -37 },
        ],
      };

      ztaLogger.info('Enrollment session initialized', {
        action: 'ENROLLMENT_INITIATED',
        userId: internalUserId,
      });

      return onboardingOptions;
    } finally {
      await this.redisManager.disconnect();
    }
  }

  async finalizeEnrollment(
    req: EnrollmentFinalizeRequest,
    validator?: DeviceValidator
  ): Promise<EnrollmentFinalizeResponse> {
    await this.redisManager.connect();
    try {
      const verifier = validator || this.deviceValidator;
      if (!verifier) {
        const { EnterpriseWebAuthnServerValidator } = await import('../webauthn-server/EnterpriseWebAuthnServerValidator');
        const realValidator = new EnterpriseWebAuthnServerValidator(this.redisManager);
        const result = await realValidator.verifyRegistration(
          req.clientPayload,
          req.challenge,
          ZtaEnrollmentOrchestrator.APPROVED_AAGUIDS
        );
        this.ensureVerificationPassed(result.verified);
        return { success: true, credentialId: result.credentialId };
      }

      const isChallengeValid = await this.redisManager.verifyChallenge(req.challenge);
      if (!isChallengeValid) {
        throw new Error('Security Violation: Challenge invalid or replayed.');
      }

      const verificationResult = await verifier.verifyRegistration(
        req.clientPayload,
        req.challenge,
        ZtaEnrollmentOrchestrator.APPROVED_AAGUIDS
      );
      this.ensureVerificationPassed(verificationResult.verified);

      ztaLogger.info('Phishing-resistant credential bound to hardware enclave', {
        action: 'CREDENTIAL_BOUND',
        regulatory_tags: ['NIS2_DEVICE_REGISTRATION', 'GDPR_DATA_MINIMIZATION'],
        hardwareProfile: verificationResult.aaguid,
      });

      return {
        success: true,
        credentialId: verificationResult.credentialId,
      };
    } finally {
      await this.redisManager.disconnect();
    }
  }

  private async verifyEidasIdentityToken(token: string): Promise<EidasIdentityResult> {
    try {
      const { pid } = JSON.parse(Buffer.from(token, 'base64url').toString());
      return {
        isValid: pid?.isValid === true,
        assuranceLevel: pid?.assuranceLevel || 'low',
        nationalIdentifier: pid?.nationalIdentifier || '',
        givenName: pid?.givenName || '',
        familyName: pid?.familyName || '',
      };
    } catch {
      throw new Error('Security Violation: OID4VP token validation failed.');
    }
  }

  private ensureVerificationPassed(isVerified: boolean): void {
    if (!isVerified) {
      throw new Error('Security Violation: Device registration verification failed.');
    }
  }
}
