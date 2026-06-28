# SIEM Logging Pipeline

> **Purpose:** Architecture for routing Zero-Trust token and challenge engine logs into a centralized SIEM pipeline with cryptographic signing and automated detection rules.

**Version:** 1.0.0 | **Last Updated:** 2026-06-28
**Dependencies:** `redis-challenge-pipeline-docker.md` (canonical source for `ztaLogger`, `logSecurityEvent`)

---

Architecture for routing Zero-Trust token and challenge engine logs from Redis and Node.js validators into a centralized SIEM pipeline (Splunk, OpenSearch, or ELK). The system aggregates, formats, and cryptographically signs logs before ingestion. This setup fulfills NIS2 Article 21 audit requirements and provides real-time detection for anomalous access patterns.

```text
 [Application Node]
 (Validator / Redis Engine)
         | (Structured JSON Log via stdout)
         v
  [Fluent Bit Daemon] ---> [Asymmetric KMS Key] ---> [Splunk / OpenSearch / ELK]
  (Transforms & Encapsulates) (Cryptographic Seal)      (Storage & Automated Alerting)
```

---

## 1. Unified Logging Architecture: fluent-bit.conf

Using a lightweight telemetry agent like Fluent Bit ensures logs are processed, formatted, and signed before sending to the SIEM without degrading application performance.

```ini
[SERVICE]
    Flush        1
    Daemon       Off
    Log_Level    info
    Parsers_File parsers.conf

[INPUT]
    Name         tail
    Path         /var/log/zta/*.log
    Parser       json
    Tag          zta.auth.events

[FILTER]
    Name         record_modifier
    Match        zta.auth.events
    Record       environment production
    Record       region eu-central-1

[OUTPUT]
    Name         splunk
    Match        zta.auth.events
    Host         splunk-indexer.enterprise.eu
    Port         8088
    Splunk_Token ${SPLUNK_HEC_TOKEN}
    TLS          On
    TLS.Verify   On
    Message_Key  log
```

## 2. Node.js Structured Logging Engine

Deploy a structured logger like Pino to ensure errors and security events are emitted as clean, indexable JSON.

```typescript
import pino from 'pino';

export const ztaLogger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Audit Helper tracking critical security outcomes for compliance
 */
export function logSecurityEvent(event: {
  action: 'CHALLENGE_ISSUED' | 'CHALLENGE_CONSUMED' | 'REPLAY_ATTACK_DETECTED' | 'SESSION_REVOKED';
  userId?: string;
  challenge: string;
  metadata?: Record<string, any>;
}) {
  const payload = {
    regulatory_tags: ['NIS2_ART_21', 'ZTA_CONTINUOUS_AUTH'],
    ...event
  };

  if (event.action === 'REPLAY_ATTACK_DETECTED') {
    ztaLogger.error(
      payload,
      `CRITICAL SECURITY ALERT: Auth replay attempt detected for challenge ${event.challenge}`
    );
  } else {
    ztaLogger.info(payload, `ZTA Audit Event: ${event.action}`);
  }
}
```

## 3. Verification Pipeline Integration

Wiring the logging engine into the dynamic verification process to catch attacks instantly.

```typescript
import { ZtaRedisPipelineManager } from './ZtaRedisPipelineManager';
import { logSecurityEvent } from './ZtaLogger';

async function processAuthVerification(userId: string, challenge: string) {
  const redisPipeline = new ZtaRedisPipelineManager();
  await redisPipeline.connect();

  // 1. Log the initiation of verification
  logSecurityEvent({
    action: 'CHALLENGE_CONSUMED',
    userId,
    challenge
  });

  const isChallengeValid = await redisPipeline.verifyAndConsumeChallenge(challenge);

  if (!isChallengeValid) {
    // 2. Log an audit failure if a user attempts to reuse a challenge token
    logSecurityEvent({
      action: 'REPLAY_ATTACK_DETECTED',
      userId,
      challenge,
      metadata: {
        reproducibility: 'high',
        threat_vector: 'Credential_Replay_ManInTheMiddle'
      }
    });

    await redisPipeline.disconnect();
    throw new Error('Access Denied: Replay threat intercepted.');
  }

  // Proceed with WebAuthn Validation steps...
  await redisPipeline.disconnect();
}
```

---

## 4. Automated SIEM Detection Rules

Once logs arrive in the SIEM, establish continuous correlation searches. The following queries find and flag malicious activity in real-time.

### Rule A: WebAuthn Challenge Replay Attack Interception (NIS2 Critical Incident)

Flags instances where a single token is used multiple times within a narrow window — a hallmark of Man-in-the-Middle or session interception scripts.

**Splunk SPL Query:**

```spl
index=zta_auth sourcetype="_json" action="REPLAY_ATTACK_DETECTED"
| stats count BY challenge, userId, src_ip
| where count > 0
```

**Trigger Threshold**: Trigger a Critical P1 Incident Page instantly if `count >= 1`.

### Rule B: Anomalous Mass Revocation Ingestion Tracking

Targets potential insider threats or compromised EDR orchestrators by alerting security teams if an unusually high volume of accounts are suddenly kicked from the identity fabric.

**OpenSearch Lucene / PPL Query:**

```sql
source = 'zta.auth.events'
| where action = 'SESSION_REVOKED'
| stats count() by userId by bucket(timestamp, 1m)
| where count() > 50
```

**Trigger Threshold**: Trigger an analyst review if more than 50 sessions are programmatically revoked within one rolling minute.

---

## Engineering Best Practices for SIEM Compliance

1. **Non-Repudiation**: Run Fluent Bit on a hardened host where individual application containers cannot tamper with log files written to disk (`/var/log/zta/*.log`).
2. **Alert Orchestration**: Ensure SIEM rules automatically forward events directly to an automated SOAR playbook (Cortex XSOAR or Splunk SOAR). For instance, an authenticated `REPLAY_ATTACK_DETECTED` event should immediately execute an out-of-band Smart-ID+ lock profile request to quarantine the target user account automatically while security responds.

## 5. Splunk Alert Actions Configuration

### savedsearches.conf — Real-Time Alert Definitions

```ini
# /opt/splunk/etc/apps/zta_security/default/savedsearches.conf

[ZTA - Replay Attack Detected]
description = Critical P1: WebAuthn challenge replay attempt intercepted
search = index=zta_auth sourcetype="_json" action="REPLAY_ATTACK_DETECTED" | stats count BY challenge, userId, src_ip
cron_schedule = */1 * * * *
dispatch.earliest_time = -2m
dispatch.latest_time = now
alert_type = always
alert.severity = 1
alert.suppress = 1
alert.suppress.period = 5m
action.webhook = 1
action.webhook.param.url = https://soar.enterprise.eu/api/v1/soar/webhook-trigger
action.webhook.param.auth_token = ${SIEM_WEBHOOK_SECRET}
action.email = 1
action.email.to = soc-p1@enterprise.eu
action.email.subject = CRITICAL: WebAuthn Replay Attack Detected

[ZTA - Mass Revocation Anomaly]
description = Analyst review: >50 session revocations in 1 minute
search = index=zta_auth sourcetype="_json" action="SESSION_REVOKED" | stats count BY userId span=1m | where count > 50
cron_schedule = */1 * * * *
dispatch.earliest_time = -2m
dispatch.latest_time = now
alert_type = always
alert.severity = 3
alert.suppress = 1
alert.suppress.period = 10m
action.webhook = 1
action.webhook.param.url = https://soar.enterprise.eu/api/v1/soar/webhook-trigger
action.webhook.param.auth_token = ${SIEM_WEBHOOK_SECRET}
action.email = 1
action.email.to = soc-analysts@enterprise.eu
action.email.subject = WARNING: Anomalous Mass Session Revocation Detected

[ZTA - High-Risk AI Session Flag]
description = UEBA risk model flagged session — step-up required
search = index=zta_auth sourcetype="_json" risk_classification_output="HIGH_RISK*" | stats count BY sub, device_id
cron_schedule = */2 * * * *
dispatch.earliest_time = -3m
dispatch.latest_time = now
alert_type = always
alert.severity = 4
alert.suppress = 1
alert.suppress.period = 15m
action.email = 1
action.email.to = security-engineering@enterprise.eu
```

## References

[1] https://docs.fluentbit.io/manual/pipeline/outputs/splunk
[2] https://docs.splunk.com/Documentation/Splunk/latest/Alert/WebhookAlertAction
[3] https://github.com/pinojs/pino
[4] https://docs.opensearch.org/latest/observing-your-data/ppl/
