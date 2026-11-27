# Architecture decision register

Recorded November 27, 2026. Historical decisions reconstructed from commits, original experiment notes and issues. Proposed decisions are not shipped features.

## ADR-001 — ESPN plus nflverse (implemented)
Context: live context and detailed play-by-play have different source requirements. Alternatives: ESPN alone, replace ESPN, dedicated data provider. Decision: retain ESPN browser feeds and augment with nflverse snapshots. Consequence: asynchronous freshness, ID matching and coverage reconciliation. Evidence #54, #40–41, PR #36.

## ADR-002 — Static JSON architecture (implemented)
Alternatives: server API/database, independent application, static export. Decision: generate season JSON offline and keep existing Next export/Vercel. Rationale: low overhead and portable datasets. Consequence: redeploy for updates, payload constraints, no server endpoints. Evidence #54, #64, #39.

## ADR-003 — Four intelligence experiences (implemented)
Alternatives: one long dashboard or distinct task-oriented views. Decision: Team/Player/Game/Matchup with shared season context and Team default. Consequence: cross-view navigation and contextual state must remain consistent. Evidence #58–61, PR #38.

## ADR-004 — Position-aware analytics (implemented)
Alternatives: generic charts for every player or domain-specific panels. Decision: passing, rushing, receiving and defense profiles. Consequence: missing-data behavior and scope-specific metrics; more typed contracts. Evidence #55, #57, #40.

## ADR-005 — No fabricated tracking (implemented)
Alternatives: illustrative trajectories presented as measured, or explicit recorded positions and estimated endpoints. Decision: use classified zones, lanes and snap positions; explain estimates and uncertainty. Consequence: no exact route or movement reconstruction. Evidence #59, #65.

## ADR-006 — Separate editorial content (approved direction)
Alternatives: embed stories in generated snapshots or separate curated records. Decision: stable subject IDs and separate source-attributed editorial/trivia data. Consequence: validation and effective dates required; not yet implemented. Evidence #70–73, #80.

## ADR-007 — Progressive artwork fallback (implemented)
Decision: normalized player/number filenames, zero-padded support, name-only, legacy Caleb, ESPN and neutral placeholder. Alternative: manual mapping for every image. Consequence: missing-file requests and image weight need optimization; browser verification remains. Evidence PR #37, #63, #44, #47.

## ADR-008 — Scheduled GitHub Actions (implemented; production verification open)
Alternatives: manual refresh, server scheduler, GitHub Actions. Decision: four scheduled checks, manual dispatch, guard and publish only meaningful changes. Consequence: upstream and runner delay; first run exposed depth-name collision fixed in PR #66. Verify automated publish and Vercel bot handling. Evidence #39, PR #51, run 45913395426.

## ADR-009 — Historical season context (partially implemented)
Decision: season-specific roster and stats; stable player IDs; future effective-dated biographies and leadership. Alternative: show present-day attributes across eras. Consequence: coverage matrix and compatible metric definitions required. Evidence #56, #48, #77, #70.

## ADR-010 — Shared editorial and trivia components (approved direction)
Decision: typed editorial contracts and reusable accessible rendering across player, team and management. Alternative: independent implementations. Consequence: avoid premature abstraction; validate sources and answer IDs. Evidence #71–74, #80.

## ADR-011 — Modular product in portfolio repository (approved direction)
Decision: independent charter, docs, roadmap and release identity while preserving existing hosting/repository. Alternatives: treat as portfolio feature or extract now. Consequence: enforce boundaries; revisit extraction only when justified. Evidence #88, #89.
