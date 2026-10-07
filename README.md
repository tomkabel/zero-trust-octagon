# Zero-Trust Octagon

<div align="center">

<!-- Status: live, service-generated state -->
[![CI](https://img.shields.io/github/actions/workflow/status/tomkabel/zero-trust-octagon/ci.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=CI&labelColor=0d1117)](https://github.com/tomkabel/zero-trust-octagon/actions/workflows/ci.yml)
[![Pages deploy](https://img.shields.io/github/actions/workflow/status/tomkabel/zero-trust-octagon/deploy.yml?branch=main&style=for-the-badge&logo=githubpages&logoColor=white&label=Pages&labelColor=0d1117)](https://github.com/tomkabel/zero-trust-octagon/actions/workflows/deploy.yml)
[![Read online](https://img.shields.io/website?url=https%3A%2F%2Ftomkabel.github.io%2Fzero-trust-octagon%2F&style=for-the-badge&logo=readthedocs&logoColor=white&label=Read%20online&labelColor=0d1117&up_message=live&down_message=down)](https://tomkabel.github.io/zero-trust-octagon/)
[![Last commit](https://img.shields.io/github/last-commit/tomkabel/zero-trust-octagon/main?style=for-the-badge&logo=git&logoColor=white&labelColor=0d1117)](https://github.com/tomkabel/zero-trust-octagon/commits/main)

<!-- Metadata: license, runtime, toolchain, supply chain -->
[![License: CC BY 4.0](https://img.shields.io/badge/license-CC%20BY%204.0-ef9421?style=for-the-badge&logo=creativecommons&logoColor=white&labelColor=0d1117)](LICENSE)
[![Node](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Ftomkabel%2Fzero-trust-octagon%2Fmain%2Fpackage.json&query=%24.engines.node&style=for-the-badge&logo=nodedotjs&logoColor=white&label=node&color=5fa04e&labelColor=0d1117)](package.json)
[![VitePress](https://img.shields.io/github/package-json/dependency-version/tomkabel/zero-trust-octagon/dev/vitepress?style=for-the-badge&logo=vitepress&logoColor=white&color=5c73e7&labelColor=0d1117)](https://vitepress.dev/)
[![Dependabot](https://img.shields.io/badge/dependabot-enabled-025e8c?style=for-the-badge&logo=dependabot&logoColor=white&labelColor=0d1117)](.github/dependabot.yml)

**[Read the book online](https://tomkabel.github.io/zero-trust-octagon/)**

</div>

> **Zero-trust architecture from first principles — not products, not compliance checklists.**

<img width="1408" height="768" alt="prompt-optimizer-20260527-064953-508" src="https://github.com/user-attachments/assets/10b3da67-59d9-4d89-a08c-36f010febb4e" />



Zero-Trust Octagon is a comprehensive, vendor-neutral reference textbook that defines zero-trust through **eight irreducible axioms** (the Octagon), evaluates architectures through a **nine-dimension morphological matrix**, and provides **actionable implementation pathways** for organizations of every scale.

---

## What's Inside

**The Octagon** — Eight axioms that form the mathematical invariant core of zero-trust. Any architecture failing one is not zero-trust.

1. **No Intrinsic Trust** — Trust is a transient verdict, never a property
2. **Explicit, Verifiable Policy** — Policy must be deterministic, replayable, non-contradictory
3. **Unbypassable Mediation** — No path between subject and object escapes evaluation
4. **Continuous Verification** — Verification is ongoing, not gated at session establishment
5. **Deterministic Bounded Authority** — Every action carries a context-limited, proof-backed credential
6. **Byzantine Fault Tolerance** — Trust is computed as consensus across a set of verifiers
7. **Epistemic Integrity** — Distinguish cryptographically provable fact from policy-derived inference
8. **Bilateral Symmetry** — Protect data flowing in both directions, not just outbound

**The Morphological Matrix** — A 9-dimension configuration space (trust anchors, identity models, enforcement layers, attestation modalities, violation responses, policy distribution, observability trust, organizational posture, human continuity) replacing linear maturity models.

**Four Archetypes with Attack Traces** — Full breach narratives against each archetype (Holy Grail, Fortune 500, Startup, Lean Defense) with cross-trace synthesis.

**Implementation Trees** — 24-month, 12-month, and 6-month roadmaps with gate checks, cost estimates, and failure pivots.

---

## Quick Start

```bash
# Install dependencies
npm install

# Run the docs locally
npm run docs:dev

# Build for production
npm run docs:build
```

Browse at `http://localhost:5173` after running the dev server.

---

## Who This Is For

- Security architects designing zero-trust deployments
- SREs responsible for making security models survive production
- Security engineers evaluating detection stacks against first principles
- Technical leaders who need to understand why vendor suites still get breached

**Prerequisites:** Working knowledge of cloud-native infrastructure (containers, orchestration, service mesh) and basic cryptographic primitives (TLS, JWT, PKI).

---

## Structure

| Part | Content |
|---|---|
| **Part I — Foundations** | The Octagon axioms, their refinement history, and use as a validation instrument |
| **Part II — Architecture** | The morphological matrix, dimension covariance, and meta-patterns |
| **Part III — Reality** | Four archetypal breach scenarios with full attack traces |
| **Part IV — Action** | Implementation decision trees with cost estimates and failure pivots |
| **Appendices** | Quantum/AI threat stress-test, validation checklist, glossary, quick reference |

---

## Built With

- [VitePress](https://vitepress.dev/) — Static site generator
- [Vitest](https://vitest.dev/) – Test runner for the `src/` reference implementations
- Node.js — Runtime

---

## License

The content is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE).
