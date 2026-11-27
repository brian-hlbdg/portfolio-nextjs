# Product requirements

| ID | Requirement | Verification |
|---|---|---|
| R01 | Four distinct experiences share season context | Navigate Team/Player/Game/Matchup across seasons |
| R02 | Recorded analytics never silently substitute fixtures | Missing/error/empty states |
| R03 | Sources and metric definitions are transparent | Reconcile source examples; inspect labels |
| R04 | Refresh preserves last good data | Simulated failure; no-op repeat; production verification |
| R05 | Player and game navigation avoids repeated scrolling | iPhone Safari, desktop keyboard, first/last boundaries |
| R06 | Artwork degrades gracefully | Missing file, player switch, ESPN failure |
| R07 | Historical content respects effective dates | Season switch and missing historical coverage |
| R08 | Editorial/trivia facts have provenance | Validate source refs and answer IDs |
| R09 | Performance and accessibility are measured | Baseline, responsive audit, keyboard and screen reader |
| R10 | Releases have evidence and rollback path | PR, checks, deployment, smoke tests, changelog |

R07–R08 include proposed features; not all requirements are implemented. Trace implementation to epics #81–88. Acceptance criteria belong in individual issues.
