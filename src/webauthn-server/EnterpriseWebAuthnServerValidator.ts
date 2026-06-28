import {
  verifyRegistrationResponse,
  verifyAuthenticationResponse,
  VerifiedRegistrationResponse,
  VerifiedAuthenticationResponse,
} from '@simplewebauthn/server';
import { ZtaRedisPipelineManager } from '../zta-redis/ZtaRedisPipelineManager';

export interface EnterpriseValidationResult {
  verified: boolean;
  aaguid: string;
  credentialId: string;
  publicKey: string;
  counter: number;
  deviceType: 'single_device' | 'multi_device';
}

export interface AuthenticationResult {
  verified: boolean;
  credentialId: string;
  counter: number;
}

export interface RegistrationPayload {
  id: string;
  rawId: string;
  type: 'public-key';
  response: {
    clientDataJSON: string;
    attestationObject: string;
    transports?: string[];
  };
}

export interface AuthenticationPayload {
  id: string;
  rawId: string;
  type: 'public-key';
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle?: string;
  };
}

export class EnterpriseWebAuthnServerValidator {
  private static EXPECTED_RP_ID = 'internal.enterprise.eu';
  private static EXPECTED_ORIGIN = 'https://enterprise.eu';

  constructor(private redisPipeline: ZtaRedisPipelineManager) {}

  async verifyRegistration(
    payload: RegistrationPayload,
    expectedChallenge: string,
    whitelist: Set<string>
  ): Promise<EnterpriseValidationResult> {
    const isValid = await this.redisPipeline.verifyChallenge(expectedChallenge);
    if (!isValid) {
      throw new Error('Security Violation: Challenge invalid or replayed.');
    }

    let verification: VerifiedRegistrationResponse;
    try {
      verification = await verifyRegistrationResponse({
        response: payload,
        expectedChallenge,
        expectedOrigin: EnterpriseWebAuthnServerValidator.EXPECTED_ORIGIN,
        expectedRPID: EnterpriseWebAuthnServerValidator.EXPECTED_RP_ID,
        requireUserVerification: true,
      });
    } catch (err: unknown) {
      throw new Error(
        `Security Violation: Cryptographic validation failed — ${(err as Error).message}`
      );
    }

    const { verified, registrationInfo } = verification;
    if (!verified || !registrationInfo) {
      throw new Error('Security Violation: Registration verification returned unsafe state.');
    }

    const { credentialID, credentialPublicKey, counter, aaguid, credentialDeviceType } =
      registrationInfo;

    const formattedAaguid = EnterpriseWebAuthnServerValidator.formatAaguid(aaguid);
    if (formattedAaguid === '00000000-0000-0000-0000-000000000000') {
      throw new Error(
        'Security Violation: Attestation metadata is anonymized. Enterprise Attestation required.'
      );
    }

    if (!whitelist.has(formattedAaguid)) {
      throw new Error(
        `Security Violation: Hardware authenticator not in enterprise whitelist (AAGUID: ${formattedAaguid}).`
      );
    }

    const base64UrlPublicKey = Buffer.from(credentialPublicKey).toString('base64url');
    const base64UrlCredentialId = Buffer.from(credentialID).toString('base64url');

    return {
      verified: true,
      aaguid: formattedAaguid,
      credentialId: base64UrlCredentialId,
      publicKey: base64UrlPublicKey,
      counter,
      deviceType: credentialDeviceType,
    };
  }

  async verifyAuthentication(
    payload: AuthenticationPayload,
    expectedChallenge: string,
    storedCredentialPublicKey: string
  ): Promise<AuthenticationResult> {
    const isValid = await this.redisPipeline.verifyChallenge(expectedChallenge);
    if (!isValid) {
      throw new Error('Security Violation: Challenge invalid or replayed.');
    }

    let verification: VerifiedAuthenticationResponse;
    try {
      verification = await verifyAuthenticationResponse({
        response: payload,
        expectedChallenge,
        expectedOrigin: EnterpriseWebAuthnServerValidator.EXPECTED_ORIGIN,
        expectedRPID: EnterpriseWebAuthnServerValidator.EXPECTED_RP_ID,
        credential: {
          id: payload.id,
          publicKey: Buffer.from(storedCredentialPublicKey, 'base64url'),
          counter: 0,
          transports: payload.response.transports || [],
        },
        requireUserVerification: true,
      });
    } catch (err: unknown) {
      throw new Error(
        `Security Violation: Authentication verification failed — ${(err as Error).message}`
      );
    }

    const { verified, authenticationInfo } = verification;
    if (!verified || !authenticationInfo) {
      throw new Error('Security Violation: Authentication verification returned unsafe state.');
    }

    return {
      verified: true,
      credentialId: authenticationInfo.credentialID,
      counter: authenticationInfo.newCounter,
    };
  }

  private static formatAaguid(aaguid: Uint8Array): string {
    if (!aaguid || aaguid.length !== 16) {
      return '00000000-0000-0000-0000-000000000000';
    }
    const hex = Buffer.from(aaguid).toString('hex');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20),
    ].join('-');
  }
}
