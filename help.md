Here's what I see.

  Where you are: You've completed Phases 1–3 (analysis through implementation readiness) and the blind/edge
   hunter reviews exist in implementation artifacts. No sprint plan is visible yet. This cross-analysis is
  a post-readiness planning artifact — new intelligence that could change things.

  What the analysis actually gives you: Seven concrete additions/modifications to the project's planning
  artifacts (PRD FRs/NFRs, architecture appendix, chapter text changes, epic cross-reference requirements).
   This is classic course-correction territory — new domain research that surfaced after the plan was
  locked.

  Here's how to best use it:

  [CC] Correct Course — bmad-correct-course
  The most natural first step. Feed it this analysis and it'll triage: whether this warrants updating the
  PRD, redoing architecture, adjusting epics, or just filing as implementation notes. Given the analysis
  recommends changes to FR-22 and NFR-2 (PRD-level requirements), this likely cascades.

  [PRD] Create, Edit, and Review PRD (update) — bmad-prd
  If correct-course confirms PRD changes are needed. The analysis specifically flags: add "provides
  structured ZTMM mapping appendix" to NFR-2, and add ZTMM cross-reference requirements to FR-22. update
  action handles targeted PRD edits against change signals.

  [CA] Create Architecture (re-run) — bmad-create-architecture
  The analysis recommends adding an Appendix E (ZTMM crosswalk). If the architecture doc needs this
  structural addition, re-running architecture will fold it in.

  [WD] Write Document — bmad-agent-tech-writer
  For drafting the actual crosswalk appendix, data lifecycle section, or device management acknowledgment.
  You can invoke with: "write a CISA ZTMM v2.0 crosswalk appendix based on the analysis at
  _bmad-output/planning-artifacts/ztmm-cross-analysis-2026-05-26.md"

  I'd go Correct Course first to scope the impact, then PRD update if needed, then tech-writer for the
  prose additions. Want me to kick off correct-course with this analysis?
