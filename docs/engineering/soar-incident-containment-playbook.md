# SOAR Incident Containment Playbook

> **Purpose:** Automated 3-tier incident containment for critical SIEM alerts — session eviction via Redis, Smart-ID/eIDAS identity anchor lock, and FIDO2 device quarantine with sub-second enforcement.

**Version:** 1.0.0 | **Last Updated:** 2026-06-28
**Dependencies:** `redis-challenge-pipeline-docker.md` (ZtaRedisPipelineManager), `siem-logging-pipeline.md` (ztaLogger, logSecurityEvent)

---

Following NIS2 Article 21 directives for proactive incident mitigation, this script acts as an automated SOAR playbook. When triggered by a SIEM alert, it coordinates with the components built in the previous steps to execute a 3-tier automated containment strategy:

1. **Evict Active Sessions**: Writes directly to the `ZtaRedisPipelineManager` to invalidate short-lived tokens across all Envoy API Gateways within seconds.
2. **Lock User Identity Anchor**: Calls the SK ID Solutions Smart-ID/Mobile-ID administrative APIs to temporarily suspend authentication capability.
3. **Quarantine the Hardware Device**: Updates the central zero-trust engine to reject the specific WebAuthn/FIDO2 authenticator (`device_id`).

---

## 1. Production SOAR Containment Script

```typescript
import { ZtaRedisPipelineManager } from './ZtaRedisPipelineManager';
import { ztaLogger } from './ZtaLogger';
import axios from 'axios';

interface SiemAlertPayload {
  alert_id: string;
  trigger_reason: 'REPLAY_ATTACK_DETECTED' | 'MASS_REVOCATION_ANOMALY';
  target_user_id: string;
  target_session_id: string;
  target_device_id: string;
  source_ip: string;
  associated_challenge: string;
}

export class ZtaAutomatedResponsePlaybook {
  private redisPipeline: ZtaRedisPipelineManager;
  private SMART_ID_ADMIN_API = process.env.SMART_ID_ADMIN_API || '';
  private SMART_ID_AUTH_TOKEN = process.env.SMART_ID_API_AUTH_TOKEN;

  constructor() {
    if (!this.SMART_ID_ADMIN_API) throw new Error('FATAL: SMART_ID_ADMIN_API environment variable is required');
    if (!this.SMART_ID_AUTH_TOKEN) throw new Error('FATAL: SMART_ID_API_AUTH_TOKEN environment variable is required');
    this.redisPipeline = new ZtaRedisPipelineManager();
  }

  /**
   * Main orchestrator executed immediately when SIEM pushes an alert webhook
   */
  public async executeIncidentContainment(alert: SiemAlertPayload): Promise<void> {
    ztaLogger.warn('SOAR: Initiating automated containment playbook.', {
      alert_id: alert.alert_id,
      user_id: alert.target_user_id,
      session_id: alert.target_session_id
    });

    try {
      await this.redisPipeline.connect();

      // --- TIER 1: EVICT SESSIONS (Gateway Enforcement) ---
      // Invalidate the session instantly in the Redis layer read by the Envoy gRPC auth service
      // Set TTL to 1 hour (3600s) to completely outlast any active access tokens
      await this.redisPipeline.revokeSession(alert.target_session_id, 3600);

      // Blacklist the compromised FIDO2 hardware authenticator device ID across the fabric
      await this.redisPipeline.revokeDevice(alert.target_device_id, 86400); // 24-hour quarantine

      ztaLogger.info('SOAR Tier 1: Distributed Redis revocation vectors written.', {
        user_id: alert.target_user_id,
        device_id: alert.target_device_id
      });

      // --- TIER 2: SUSPEND IDENTITY ANCHOR (Smart-ID / eIDAS Layer) ---
      await this.lockSmartIdAccount(alert.target_user_id, alert.alert_id);

      // --- TIER 3: NOTIFY SECURITY OPERATIONS (Incident Logging) ---
      this.emitNis2ComplianceLog(alert);

    } catch (criticalError: any) {
      ztaLogger.error('SOAR CRITICAL: Automated playbook execution failed or partially executed.', {
        error: criticalError.message,
        alert
      });
      // In production, route to on-call engineer paging system (PagerDuty/Opsgenie API) here
    } finally {
      await this.redisPipeline.disconnect();
    }
  }

  /**
   * Interacts with SK ID Solutions / Smart-ID infrastructure to suspend the user identity account
   */
  private async lockSmartIdAccount(userId: string, alertId: string): Promise<void> {
    if (!this.SMART_ID_AUTH_TOKEN) {
      ztaLogger.error(
        'SOAR Configuration Error: Missing SMART_ID_API_AUTH_TOKEN. Skipping downstream anchor lock.'
      );
      return;
    }

    try {
      const response = await axios.post(
        `${this.SMART_ID_ADMIN_API}/users/${userId}/suspend`,
        {
          reason: `Automated ZTA Isolation: MitM Replay Threat detected under SIEM alert ${alertId}`,
          requested_by: 'SOAR-Orchestrator-Service',
          reference_incident: alertId
        },
        {
          headers: {
            'Authorization': `Bearer ${this.SMART_ID_AUTH_TOKEN}`,
            'Content-Type': 'application/json'
          },
          timeout: 4000 // Tight 4s boundary to prevent playbook hangs
        }
      );

      if (response.status === 200 || response.status === 204) {
        ztaLogger.info('SOAR Tier 2: Smart-ID/eIDAS authentication profile locked successfully.', { user_id: userId });
      }
    } catch (apiError: any) {
      ztaLogger.error('SOAR Tier 2 Error: Smart-ID administrative lock call failed.', {
        error: apiError.message,
        user_id: userId
      });
      throw apiError; // Escalate up to primary handling layer
    }
  }

  /**
   * Outputs the immutable, structured telemetry trace needed for NIS2 post-incident investigations
   */
  private emitNis2ComplianceLog(alert: SiemAlertPayload): void {
    ztaLogger.info('SOAR Containment logging complete. Mitigated attack vectors preserved for forensic analysis.', {
      regulatory_tags: ['NIS2_ART_21_INCIDENT_RESPONSE', 'EU_AI_ACT_CONTAINMENT'],
      event_type: 'AUTOMATED_MITIGATION_COMPLETED',
      remediation_actions: [
        'ENVOY_SESSION_EVICTION',
        'FIDO2_DEVICE_QUARANTINE',
        'SMART_ID_ANCHOR_SUSPERSION'
      ],
      mitigated_threat_metadata: {
        isolated_user: alert.target_user_id,
        isolated_session: alert.target_session_id,
        isolated_device: alert.target_device_id,
        attacker_ip: alert.source_ip,
        consumed_challenge: alert.associated_challenge
      },
      audit_status: 'READY_FOR_NATIONAL_COMPETENT_AUTHORITY_REVIEW'
    });
  }
}
```

---

## 2. Microservice Deployment Integration (Webhook Controller)

Wire the handler into an Express/Fastify endpoint configured to receive authenticated webhook payloads securely exported by the Splunk/ELK alert cluster.

```typescript
import express from 'express';
import { ZtaAutomatedResponsePlaybook } from './soar_containment_playbook';

const app = express();
app.use(express.json());
const playbook = new ZtaAutomatedResponsePlaybook();

app.post('/api/v1/soar/webhook-trigger', async (req, res) => {
  // Validate incoming webhook authorization (token verification, IP restrictions)
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.SIEM_WEBHOOK_SECRET}`) {
    return res.status(401).end();
  }

  const alertPayload: SiemAlertPayload = req.body;

  // Fire-and-forget playbook invocation to send HTTP 202 accepted response immediately to SIEM
  playbook.executeIncidentContainment(alertPayload);

  return res.status(202).json({ status: 'Processing containment instructions.' });
});

app.listen(3000, () => console.log('SOAR Webhook Ingestion Engine Online.'));
```

---

## Playbook Properties & Incident Lifecycle

- **Sub-Second Enforcement Edge**: Because the Envoy External Authorization service queries the high-speed Redis cluster on every inbound API or gRPC request, when this playbook executes `revokeSession()`, the attacker's hijacked bearer token becomes invalid across the global cloud infrastructure on their next request.

- **Preventing Attacker Self-Recovery**: An attacker possessing a hijacked session might attempt to immediately re-authenticate via a browser prompt. By placing a programmatic administrative hold on the user's Smart-ID/Mobile-ID anchor profile (Tier 2), the system blocks the user's automated account recovery and enrollment vectors until a human security analyst performs verification.

---

## References

[1] https://www.smart-id.com/smart-id-plus/
[2] https://www.skidsolutions.eu/news/smart-id-experience-the-next-generation-of-secure-authentication-now/
[3] https://openid.net/specs/openid-caep-specification-1_0.html
[4] https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/ext_authz_filter
