# Testing strategy

## Verification layers
1. Python offline regression tests: `python3 -m unittest discover -s scripts -p 'test_*.py'`.
2. Generator fixture and full-season refresh: check schema, game coverage, duplicate IDs, final states, no-op repeat and preservation on failure.
3. Frontend: inspect available package scripts; run `npx tsc --noEmit` and `npm run build`; lint using repository configuration.
4. Statistical reconciliation: compare representative games and metrics against authoritative results; document differences and denominators (#40).
5. Browser smoke tests: Team/Player/Game/Matchup, 2024–2026, artwork fallback, schedule links, missing/error states, mobile Safari and desktop.
6. Deployment: preview checks, merge, production status and browser verification. Do not equate green build with correct data.

Automated tests are currently limited. First manual refresh failed despite passing module tests; full-generator fixture added in PR #66. Add tests for validators, source matching, historical state and editorial schema as features land. Record command, commit, environment, result and untested scope in PR. Never claim a test ran without evidence.
