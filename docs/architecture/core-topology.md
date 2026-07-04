# NexusCore Identity Platform: System Architecture Blueprint

This document details the production topography and architectural components of the NexusCore Decentralized Identity Platform.

## 🏗️ Structural Flow Diagram Overview

```text
[ Client Application ] <--- (WebAuthn / OID4VP) ---> [ NGINX Ingress Proxy ]
                                                             │
                                                  (TLS 1.3 / Rate-Limited)
                                                             ▼
                                                    [ Node.js API Gateway ]
                                                             │
                 ┌───────────────────────────────────────────┴──────────────────────────────────────────┐
                 ▼                                           ▼                                          ▼
     [ PostgreSQL Database ]                     [ Redpanda Event Stream ]                   [ HashiCorp Vault ]
  (ACID User Ledger Caching)                   (Kafka-based Audit Bus)                     (HSM Transit Engine)
                 ▲                                           │
                 │                                           ▼
   [ Ledger Sync Background Worker ] <── (WebSockets) ── [ Audit Worker Node ] ── (Ethers.js) ──► [ EVM Blockchains ]
```

🔒 Threat Vector Mitigation Matrix (STRIDE)Threat CategorySystem Vulnerability MappingEngineered Architectural Mitigation StrategySpoofingPhishing of private keysWebAuthn/Passkey bindings lock assertions to origin domain parameters.TamperingCredential file payload mutationW3C credentials mapped to deterministic Keccak256 IPFS Content Identifiers ($CIDs$).Information DisclosureLeakage of PII to public ledgerZero-Knowledge Circuits ($Groth16$ over SnarkJS) decouple identity proof assertions from raw birthdates.
