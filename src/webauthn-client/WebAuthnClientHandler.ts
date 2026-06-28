const g = globalThis as any;

function getPKC(): any {
  return typeof g.PublicKeyCredential !== 'undefined' ? g.PublicKeyCredential : undefined;
}

export class WebAuthnClientHandler {
  static async isPlatformAvailable(): Promise<boolean> {
    const PKC = getPKC();
    if (
      PKC &&
      typeof PKC.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    ) {
      return PKC.isUserVerifyingPlatformAuthenticatorAvailable();
    }
    return false;
  }

  static async createCredential(options: WebAuthnServerOptions): Promise<WebAuthnCredentialOutput> {
    const PKC = getPKC();
    if (!PKC) {
      throw new Error('WebAuthn not supported in this environment.');
    }

    const nav = g.navigator;
    if (!nav || !nav.credentials) {
      throw new Error('WebAuthn not supported in this environment.');
    }

    const credOptions: PublicKeyCredentialCreationOptions = {
      challenge: WebAuthnClientHandler.b64ToBuffer(options.challenge),
      rp: options.rp,
      user: {
        id: WebAuthnClientHandler.b64ToBuffer(options.user.id),
        name: options.user.name,
        displayName: options.user.displayName,
      },
      pubKeyCredParams: options.pubKeyCredParams,
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'required',
      },
      attestation: 'enterprise',
    };

    try {
      const cred = (await nav.credentials.create({
        publicKey: credOptions,
      })) as PublicKeyCredential;

      if (!cred) throw new Error('Hardware failed to generate credential.');

      const response = cred.response as AuthenticatorAttestationResponse;

      return {
        id: cred.id,
        rawId: WebAuthnClientHandler.bufferToB64(cred.rawId),
        type: 'public-key',
        response: {
          clientDataJSON: WebAuthnClientHandler.bufferToB64(response.clientDataJSON),
          attestationObject: WebAuthnClientHandler.bufferToB64(response.attestationObject),
        },
      };
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        throw new Error('User rejected biometric prompt or session timed out.');
      }
      throw new Error(`WebAuthn credential creation failed: ${(err as Error).message}`);
    }
  }

  static async getCredential(challenge: string): Promise<WebAuthnCredentialOutput> {
    const PKC = getPKC();
    if (!PKC) {
      throw new Error('WebAuthn not supported in this environment.');
    }

    const nav = g.navigator;
    if (!nav || !nav.credentials) {
      throw new Error('WebAuthn not supported in this environment.');
    }

    const assertionOptions: PublicKeyCredentialRequestOptions = {
      challenge: WebAuthnClientHandler.b64ToBuffer(challenge),
      rpId: 'internal.enterprise.eu',
      userVerification: 'required',
    };

    try {
      const assertion = (await nav.credentials.get({
        publicKey: assertionOptions,
      })) as PublicKeyCredential;

      if (!assertion) throw new Error('Hardware failed to generate assertion.');

      const response = assertion.response as AuthenticatorAssertionResponse;

      return {
        id: assertion.id,
        rawId: WebAuthnClientHandler.bufferToB64(assertion.rawId),
        type: 'public-key',
        response: {
          clientDataJSON: WebAuthnClientHandler.bufferToB64(response.clientDataJSON),
          authenticatorData: WebAuthnClientHandler.bufferToB64(response.authenticatorData),
          signature: WebAuthnClientHandler.bufferToB64(response.signature),
          userHandle: response.userHandle
            ? WebAuthnClientHandler.bufferToB64(response.userHandle)
            : undefined,
        },
      };
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        throw new Error('User rejected biometric prompt or session timed out.');
      }
      throw new Error(`WebAuthn assertion failed: ${(err as Error).message}`);
    }
  }

  private static b64ToBuffer(b64: string): ArrayBuffer {
    const atobFn = g.atob || ((s: string) => Buffer.from(s, 'base64').toString('binary'));
    const binary = atobFn(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private static bufferToB64(buffer: ArrayBuffer): string {
    const btoaFn = g.btoa || ((s: string) => Buffer.from(s, 'binary').toString('base64'));
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoaFn(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
}
