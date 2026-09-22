---
cover: /images/covers/appendix/appendix-b-validation-checklist.webp
coverAlt: "Illustration: a sealed report with seven numbered sections beside a wax seal and timestamp"
---

# Appendix G: Sovereignty Claim Verification — Report Template

> **Method:** [§7 Pattern 9: The Compellability Predicate](../02-methodology/07-meta-patterns.md#pattern-9-jurisdictional-exposure-—-the-compellability-predicate), evidence classes per [Appendix F](./appendix-f-grant-deny-table.md).
>
> **Cite as:** *Zero-Trust Octagon, Appendix G, Compellability Predicate v1.0 (2026-10).*

---

A verification report evaluates **one public, specific claim** against the published predicate and signs the result. It is not a maturity score, a roadmap, or a legal opinion. Every report has the same seven sections in the same order so that two reports on two vendors are comparable line by line.

## 1. Scope

| Field | Content |
|---|---|
| Claim under test | Quoted verbatim, with source URL or document reference and the date it was retrieved |
| Claimant | Legal entity, registration number, domicile |
| Resources in scope `r` | The systems, key paths, and data flows the claim covers. Anything not listed is out of scope. |
| Admissible jurisdiction set `J` | Stated explicitly (for the EU case, the EEA) |
| Evidence cut-off date | The verdict speaks to this date only |
| Method version | Compellability Predicate v1.0 (2026-10) |

## 2. `compel(r)` enumerated

For every key in the decryption or verdict-signing path of `r`, one row. **A list, not a rating.**

| Key / role | Holder (legal entity) | Ultimate parent | Parent domicile | Reaching jurisdictions |
|---|---|---|---|---|
| | | | | |

`compel(r)` is the union of the last column. Record `max_parent(r)`: the largest number of quorum members under any single ultimate parent outside `J`. Record the quorum threshold `t` as configured.

## 3. Evidence classification

Every input relied upon, classified per Appendix F. Inputs not on the table are DENY-only by default (Axiom 7).

| # | Evidence item | Source | Class | Verified how |
|---|---|---|---|---|
| | | | GRANT-capable / DENY-only / Allowlist only | e.g. signature validated against EU Trusted List on [date]; document supplied by claimant, unverified |

## 4. Verdict

```
GOVERNED(r, J) := compel(r) ⊆ J  ∧  t > max_parent(r)
```

| Clause | Result | Basis |
|---|---|---|
| `compel(r) ⊆ J` | true / false / indeterminate | Section 2 rows that fail, or the GRANT-capable evidence that supports |
| `t > max_parent(r)` | true / false / indeterminate | Section 2 counts |
| **Verdict** | **true / false / indeterminate** | |

`indeterminate` is a valid result. It is returned when a clause depends on an input that exists only as DENY-only evidence. The report must state which item would need to become GRANT-capable to resolve it.

## 5. Falsification list

For a `false` or `indeterminate` verdict: the specific, minimal set of controls whose presence would flip the result. Each entry names the clause it repairs and the evidence class it would produce.

| # | Control | Repairs clause | Produces evidence class |
|---|---|---|---|
| | | | |

For a `true` verdict: the specific changes that would invalidate it, so the claimant knows what they must not do.

## 6. Limits

State, at minimum:

- The verdict establishes technical facts and enumerates the compulsion surface. **Whether a given law reaches a given entity is a legal conclusion for the claimant's counsel.**
- Jurisdiction is attributable, never provable. The report shows who can release a key, not where bytes travelled.
- The silicon root, if confidential computing is in scope, and whether it terminates outside `J`.
- The evidence cut-off date; evidence that was not supplied; evidence that was supplied but could not be verified.
- Reliance: who may rely on this report, and the liability cap agreed in the engagement contract.

## 7. Seal

- Qualified electronic seal of the verifier, issued by a QTSP on the EU Trusted List.
- Qualified electronic timestamp over the sealed document.
- Footer on every page: *Evaluated against Compellability Predicate v1.0 (2026-10). Verdict valid as of [evidence cut-off date].*

---

**Right of reply.** Where the claimant disputes a finding in writing, the dispute is published alongside the report, unedited.

**Change control.** Section structure changes only with a version bump of the predicate. A report is never re-issued under a later version without re-evaluation.
