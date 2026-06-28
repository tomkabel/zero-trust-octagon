import { createHash, randomBytes } from 'crypto';
import { ztaLogger } from '../zta-siem/ztaLogger';

export interface ChannelBinding {
  sessionId: string;
  channelHash: string;
  transactionHash: string;
  boundAt: Date;
  expiresAt: Date;
}

export class SoTAAntiRelayValidator {
  private boundChannels = new Map<string, ChannelBinding>();
  private static BINDING_TTL_MS = 300000;

  generateChannelHash(nfcSessionId: string): string {
    const entropy = randomBytes(32);
    const material = Buffer.concat([Buffer.from(nfcSessionId), entropy]);
    return createHash('sha256').update(material).digest('hex');
  }

  createChannelBinding(
    nfcSessionId: string,
    enrollmentTransactionId: string
  ): ChannelBinding {
    const channelHash = this.generateChannelHash(nfcSessionId);
    const transactionHash = createHash('sha256')
      .update(Buffer.from(channelHash + enrollmentTransactionId))
      .digest('hex');

    const binding: ChannelBinding = {
      sessionId: nfcSessionId,
      channelHash,
      transactionHash,
      boundAt: new Date(),
      expiresAt: new Date(Date.now() + SoTAAntiRelayValidator.BINDING_TTL_MS),
    };

    this.boundChannels.set(nfcSessionId, binding);

    ztaLogger.info('Cryptographic channel binding established', {
      action: 'CHANNEL_BOUND',
      sessionId: nfcSessionId,
      transactionHash: transactionHash.slice(0, 16),
    });

    return binding;
  }

  validateChannelBinding(
    nfcSessionId: string,
    expectedChannelHash: string,
    enrollmentTransactionId: string
  ): boolean {
    const binding = this.boundChannels.get(nfcSessionId);

    if (!binding) {
      ztaLogger.warn('Channel binding validation: unknown session', {
        action: 'CHANNEL_BINDING_MISSING',
        sessionId: nfcSessionId,
      });
      throw new Error('Security Violation: No channel binding found for this NFC session.');
    }

    if (new Date() > binding.expiresAt) {
      this.boundChannels.delete(nfcSessionId);
      ztaLogger.error('Channel binding expired', {
        action: 'CHANNEL_BINDING_EXPIRED',
        sessionId: nfcSessionId,
        boundAt: binding.boundAt,
        expiresAt: binding.expiresAt,
      });
      throw new Error('Security Violation: Channel binding has expired. Re-initiate enrollment.');
    }

    if (binding.channelHash !== expectedChannelHash) {
      ztaLogger.error('Channel hash mismatch — probable relay attack', {
        action: 'RELAY_ATTACK_CHANNEL_MISMATCH',
        sessionId: nfcSessionId,
        expectedHash: expectedChannelHash.slice(0, 16),
        boundHash: binding.channelHash.slice(0, 16),
      });
      throw new Error(
        'Security Violation: Cryptographic channel hash mismatch. Probable NFC relay attack detected.'
      );
    }

    const computedTransactionHash = createHash('sha256')
      .update(Buffer.from(expectedChannelHash + enrollmentTransactionId))
      .digest('hex');

    if (computedTransactionHash !== binding.transactionHash) {
      ztaLogger.error('Transaction hash integrity failure', {
        action: 'TRANSACTION_HASH_MISMATCH',
        sessionId: nfcSessionId,
      });
      throw new Error(
        'Security Violation: Transaction hash does not match bound channel. Relay rejected.'
      );
    }

    return true;
  }

  revokeChannelBinding(nfcSessionId: string): void {
    const binding = this.boundChannels.get(nfcSessionId);
    if (binding) {
      this.boundChannels.delete(nfcSessionId);
      ztaLogger.info('Channel binding revoked', {
        action: 'CHANNEL_REVOKED',
        sessionId: nfcSessionId,
      });
    }
  }

  getActiveBindings(): number {
    const now = new Date();
    for (const [id, binding] of this.boundChannels) {
      if (now > binding.expiresAt) {
        this.boundChannels.delete(id);
      }
    }
    return this.boundChannels.size;
  }
}
