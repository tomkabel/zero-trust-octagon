# WebAuthn Enterprise Client-Side Handler

> **Purpose:** Production-ready TypeScript implementation for client-side WebAuthn — enforces Enterprise Attestation, extracts hardware telemetry, and structures payloads for the ZTA Relying Party server.

**Version:** 1.0.0 | **Last Updated:** 2026-06-28
**Dependencies:** None (canonical source for `WebAuthnClientHandler`)

---

Production-ready TypeScript implementation for the client-side WebAuthn handler. This module enforces Enterprise Attestation, extracts deep hardware telemetry, hooks natively into the browser's `navigator.credentials` APIs, and structures the response payload for a zero-trust Relying Party (RP) server. [1]

---

## TypeScript WebAuthn Enterprise Handler

```typescript
/**
 * Types for the Zero-Trust 2026/2027 WebAuthn Enterprise Handler
 */
export interface WebAuthnServerOptions {
  challenge: string; // Base64URL encoded
  rp: { name: string; id: string };
  user: { id: string; name: string; displayName: string };
  pubKeyCredParams: Array<{ type: 'public-key'; alg: number }>;
}

export interface WebAuthnRegistrationOutput {
  id: string;
  rawId: string; // Base64URL encoded
  type: 'public-key';
  response: {
    clientDataJSON: string; // Base64URL encoded
    attestationObject: string; // Base64URL encoded
    transports: string[];
    authenticatorData?: string; // Base64URL encoded
    publicKey?: string; // Base64URL encoded
  };
}

export class WebAuthnClientHandler {
  /**
   * Converts a Base64URL string to an ArrayBuffer
   */
  private static base64UrlToBuffer(base64Url: string): ArrayBuffer {
    const padding = '='.repeat((4 - (base64Url.length % 4)) % 4);
    const base64 = (base64Url + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray.buffer;
  }

  /**
   * Converts an ArrayBuffer to a Base64URL string
   */
  private static bufferToBase64Url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Checks if the device supports platform authenticator with biometric verification
   */
  public static async isPlatformAuthenticatorAvailable(): Promise<boolean> {
    if (!window.PublicKeyCredential) return false;
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  /**
   * Executes a high-assurance enterprise WebAuthn credential registration.
   * Enforces Enterprise Attestation to read hardware serials/AAGUIDs.
   */
  public static async registerEnterpriseCredential(
    optionsJson: WebAuthnServerOptions
  ): Promise<WebAuthnRegistrationOutput> {
    if (!window.PublicKeyCredential) {
      throw new Error("WebAuthn is not supported by this browser environment.");
    }

    // 1. Transform Server Options to WebAuthn native types
    const credentialCreationOptions: PublicKeyCredentialCreationOptions = {
      challenge: this.base64UrlToBuffer(optionsJson.challenge),
      rp: optionsJson.rp,
      user: {
        id: this.base64UrlToBuffer(optionsJson.user.id),
        name: optionsJson.user.name,
        displayName: optionsJson.user.displayName,
      },
      pubKeyCredParams: optionsJson.pubKeyCredParams,
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Restrict to built-in secure enclaves
        residentKey: 'required',             // Enforce dynamic discoverable credential
        userVerification: 'required',        // Enforce biological/PIN challenge
      },
      // State-of-the-Art Enterprise constraints for hardware provenance extraction
      attestation: 'enterprise' as AttestationConveyancePreference,
      extensions: {
        credProps: true, // Request structural property feedback (e.g. rk detection)
        uvm: true,       // User Verification Method tracking (biometric types used)
      }
    };

    try {
      // 2. Intercept and request cryptographic key generation from hardware
      const credential = (await navigator.credentials.create({
        publicKey: credentialCreationOptions,
      })) as PublicKeyCredential;

      if (!credential) {
        throw new Error("Hardware failed to generate a valid cryptographic assertion.");
      }

      const response = credential.response as AuthenticatorAttestationResponse;

      // 3. Extract and parse standard transport properties if available
      const transports = typeof response.getTransports === 'function'
        ? response.getTransports()
        : ['internal'];

      // 4. Serialize back to native JSON schemas for transport to the ZTA IdP
      return {
        id: credential.id,
        rawId: this.bufferToBase64Url(credential.rawId),
        type: 'public-key',
        response: {
          clientDataJSON: this.bufferToBase64Url(response.clientDataJSON),
          attestationObject: this.bufferToBase64Url(response.attestationObject),
          transports: transports,
          // Optional safety checks for modern 2026/2027 browser extensions
          ...(response.authenticatorData && {
            authenticatorData: this.bufferToBase64Url(response.authenticatorData),
          }),
          ...(response.getPublicKey && response.getPublicKey() && {
            publicKey: this.bufferToBase64Url(response.getPublicKey()!),
          }),
        },
      };
    } catch (error: any) {
      // Catch specific failures like User Cancellation or Hardware Incompatibility
      if (error.name === 'NotAllowedError') {
        throw new Error("User rejected biometric prompt or session timed out.");
      }
      throw new Error(`Enterprise WebAuthn Registration Failed: ${error.message}`);
    }
  }
}
```

---

## Key Architectural Implementation Details

- **Platform Lock** (`authenticatorAttachment: 'platform'`): Restricts credential creation to local hardware enclaves ([Apple Secure Enclave](https://support.apple.com/guide/security/the-secure-enclave-sec59b0b31ff/web), Windows Hello TPM, Android StrongBox). It prevents employees from mapping corporate user profiles to personal external roaming keys unless explicitly allowed.

- **Enterprise Conveyance** (`attestation: 'enterprise'`): Instructs the browser to fetch a uniquely identifiable attestation certificate instead of an anonymized batch cert. This lets the backend Policy Decision Point evaluate the precise AAGUID (Authenticator Attestation Globally Unique Identifier) to whitelist or blacklist specific device manufacturers.

- **Discoverable & Verified** (`residentKey: 'required'`, `userVerification: 'required'`): Forces the credential to reside securely inside the hardware isolation layer. It also guarantees that the user provided explicit biometric interaction (e.g., fingerprint, face) or a local device PIN before the signature engine could execute. [2, 3]

---

## References

[1] https://developers.yubico.com/Developer_Program/WebAuthn_Starter_Kit/Front-End_System_Design.html
[2] https://fidoalliance.org/specs/fido-v2.1-ps-20210615/fido-client-to-authenticator-protocol-v2.1-ps-20210615.html
[3] https://www.corbado.com/glossary/authenticatorselection
