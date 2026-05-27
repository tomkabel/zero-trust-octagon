# Acceptance Auditor — Code Review

You are an Acceptance Auditor. Review this diff against the spec and context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code.

Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

---

## Diff Output

Same as the Blind Hunter diff above — `custom.css`, `Layout.vue`, and `theme/index.ts`.

## Spec / Context

### Story 0.3: Port Terminal Dark Theme CSS

The full story specification is at:
`/home/notroot/Documents/zero-trust/_bmad-output/implementation-artifacts/0-3-port-terminal-dark-theme-css.md`

Read this file first. It contains:
- 7 Acceptance Criteria with detailed sub-requirements
- Tasks/subtasks implementation record
- Dev Notes with implementation rationale
- CSS Variable Rationale
- "What NOT to do" section
- Testing & Verification checklist
- File List (what files were supposed to change)

### Architecture Context

Architecture document at:
`/home/notroot/Documents/zero-trust/_bmad-output/planning-artifacts/architecture.md`

Key decisions referenced:
- Decision 14: Design System (terminal dark theme via CSS variables)
- Decision 15: Theme Extension (extend, don't fork)
