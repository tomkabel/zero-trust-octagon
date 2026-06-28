# NFC Relay Threat Model & Anti-Relay Defenses

Re-evaluating the onboarding architecture from an advanced threat model perspective exposes a critical security blindspot: NFC is not a true proof of proximity if the user's endpoint is compromised by malware like NGate or an NFCShare relay engine. [1, 2]

Adversaries use these malicious packages to bypass the physical short-range limitations of ISO/IEC 14443 (NFC). If an employee's phone runs an active NFCShare relay, the application hooks the local hardware NFC subsystem and forwards raw APDU (Application Protocol Data Unit) traffic over an internet connection (WAN) to an attacker-controlled proxy device anywhere in the world. The attacker can then place their phone against a corporate workstation, relaying the victim's ID card credentials dynamically. [2, 3, 4, 5]

To preserve a State-of-the-Art (SoTA) Zero Trust Architecture under NIS2 and eIDAS 2.0 High LoA guidelines, the system must treat NFC as a transport mechanism rather than an absolute location boundary. The architecture must be updated to counter this relay threat vector.

---

## 1. Updated Threat Model: The NFC Relay Matrix

When an adversary uses an NFCShare proxy, the cryptographic handshakes executed by Smart-ID and FIDO2 onboarding logic are perfectly valid because they terminate on the legitimate ID card chip.

```text
 [Victim's Physical ID Card]
             │
             ▼ (Genuine Short-Range NFC Scan)
 [Infected Phone / NFCShare App]
             │
             ▼ (TCP / WAN Proxy Tunnel - Remote Relay)
 [Attacker's Proxy Endpoint Device]
             │
             ▼ (Emulated NFC Signal)
 [Target Enterprise Registration Terminal]
```

- **What Fails**: Standard NFC distance assumptions. The attacker successfully fools the network infrastructure into believing the physical card is touching the enterprise machine. [6]
- **What Survives**: The asymmetric cryptography of the card itself. The attacker cannot clone the private key stored inside the Estonian ID card hardware enclave; they can only relay active channel sessions in real time. [5, 7]

---

## 2. Zero-Trust Defense Engineering Against NFC Relay

To protect the architecture from real-time relay attacks during WebAuthn/FIDO2 bootstrapping, implement a Zero-Knowledge Channel Binding protocol combined with strict application attestation. [7]

### Core Defense Strategies

1. **Dynamic Transaction Verification Strings**: The onboarding engine must generate a short-lived random token visual string (e.g., three verification numbers) on the user's secure registration browser interface. This matches the mechanism used in Smart-ID+. The user must verify these digits match exactly before initiating the signature step. [8]

2. **Strict Android/iOS Attestation**: Before activating the enrollment or Smart-ID workflow, the client must transmit a signed Play Integrity API (Android) or DeviceCheck (iOS) assertion token to the server. This detects if the OS is rooted, hooked via frameworks like Frida, or running unauthorized background loops like NFCShare.

3. **Hardware Round-Trip Time (RTT) Liveness Checks**: Implement precise execution timers. An NFC transmission across a distance of a few centimeters takes under 5–10 milliseconds. A WAN relay tunnel introducing network routing hops increases the round-trip latency to >40ms. The server must reject any verification handshake that exceeds local baseline hardware timing thresholds. [6]

---

## 3. Hardened Enrollment Script: Mitigating Relay Interception

This backend adjustment integrates transaction confirmation tracking and execution latency boundaries to neutralize active NFC proxy connections.

```typescript
import { Request, Response } from 'express';
import { ztaLogger } from './ZtaLogger';

interface RelayProtectedSession {
  userId: string;
  expectedChallenge: string;
  verificationDigits: string;
  issuedAt: number;
}

export class AntiRelayEnrollmentEngine {
  private static MAX_HANDSHAKE_DELAY_MS = 25; // Strict RTT boundary to block WAN network relays

  /**
   * Finalizes credential generation with explicit protection against proxy routing
   */
  public async finalizeRelayProtectedEnrollment(
    req: Request,
    res: Response,
    sessionCache: RelayProtectedSession
  ): Promise<Response> {
    const { clientPayload, transmissionTimestamp, clientConfirmedDigits } = req.body;
    const serverReceivedTime = performance.now();

    // 1. Defeat Remote Phishing: Confirm visual transaction digits match out-of-band state
    if (clientConfirmedDigits !== sessionCache.verificationDigits) {
      return res.status(403).json({
        error: 'Security Exception: Transaction confirmation code mismatch.'
      });
    }

    // 2. Defeat WAN Relay: Measure the timing delay of the local cryptographic response
    // Network proxying tools add significant millisecond delays over international WAN links
    const networkRttDelta = serverReceivedTime - transmissionTimestamp;

    if (networkRttDelta > AntiRelayEnrollmentEngine.MAX_HANDSHAKE_DELAY_MS) {
      ztaLogger.error({
        regulatory_tags: ['NIS2_CRITICAL_INCIDENT'],
        detected_latency_ms: networkRttDelta,
        user_id: sessionCache.userId
      }, 'SECURITY ALERT: High-latency handshake detected. Potential active NFCShare/Proxy relay intercepted.');

      return res.status(400).json({
        error: 'Access Denied: Anomalous execution telemetry detected.'
      });
    }

    // 3. Process the WebAuthn verification steps...
    return res.status(201).json({ success: true });
  }
}
```

---

## 4. Revised Auditor Alignment: Addressing NFC Flaws

When accounting for malicious software layers like NFCShare, update compliance and threat-modeling documentation for DPOs and national audit authorities:

- **Auditor Context (eIDAS 2.0 High LoA)**: Inform auditors that the platform assumes a Compromised Mobile Endpoint Threat Model. Proximity checks do not rely on NFC signal constraints alone. [6]

**Security Control Evidence**:

| Control | Description |
|---|---|
| Control A | Runtime Device Attestation checks block the execution of modified or compromised binary components on user smartphones. |
| Control B | Application Isolation Profiles prevent background malicious services from executing automated APDU communication requests while the primary verification application runs in the foreground. |
| Control C | Visual Verification Vectors force the human operator to manually bridge the digital gap between the target workstation and the smartphone application screen, breaking blind remote automation attempts. [8, 9] |

This multi-layered approach ensures the Zero Trust Architecture remains secure, even when dealing with advanced physical-layer attacks like NFC relay malware. [10]

---

## References

[1] https://cert.pl/en/posts/2025/11/analiza-ngate/
[2] https://404-founders.com/blog/nfcshare-malware-uses-fake-banking-app-updates-to-steal-payment-cards
[3] https://www.academia.edu/91580613/A_security_review_of_proximity_identification_based_smart_cards
[4] https://www.sciencedirect.com/science/article/abs/pii/S1874548215000591
[5] https://www.cleafy.com/insights/nfc-relay-attack-understanding-and-preventing-contactless-payment-fraud
[6] https://www.researchgate.net/publication/286840215_Security_analysis_of_NFC_relay_attacks_using_probabilistic_model_checking
[7] https://www.sciencedirect.com/science/article/pii/S1874548219300642
[8] https://www.smart-id.com/help/faq/smart-id-new-features/how-does-the-new-smart-id-protect-me-from-fraud/
[9] https://www.smart-id.com/help/faq/biometric-identification/biometric-identification-is-it-for-me/
[10] https://netwrix.com/en/cybersecurity-glossary/cyber-security-attacks/
