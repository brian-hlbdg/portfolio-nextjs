# Data pipeline

## Sources
ESPN feeds power current context and fixtures; nflverse/nflfastR regular-season play-by-play, roster and optional depth-chart releases power static analytics. Preserve upstream attribution and review terms for each new dataset.

## Execution
From repository root:
```sh
python3 -m unittest discover -s scripts -p 'test_*.py'
python3 scripts/refresh-bears-analytics.py 2026
```
Manual generator: `python3 scripts/build-bears-analytics.py 2026`. Use guarded refresh for publishing. Generated files are not manually edited.

Workflow schedules four checks daily (03:23, 09:23, 15:23, 21:23 UTC; 21:23 previous day, 03:23, 09:23, 15:23 CST), supports manual dispatch with optional season. Defaults to prior calendar year January–August, current year September–December. Validates required sections and guards lost games/final status/depth-chart availability; restores old bytes on failure and ignores timestamp-only changes. Commits changed data only. Existing historical snapshots remain unchanged unless explicitly refreshed.

## Verification
PR #51 merged; initial production run 45913395426 failed on Python depth-name collision; PR #66 fixed it and added full-generator fixture test. Issue #39 stays open until production refresh, no-op, Vercel deployment and failure behavior are verified. Do not infer latest game coverage from a green test or refresh timestamp. Check workflow logs, commit, snapshot and deployed page in that order.

## Next
#41: show ESPN completed games vs recorded coverage and snapshot time. Last successful check/failed attempt requires separate metadata and is not the same as last dataset generation. Avoid publishing partial data as complete. #40: reconcile definitions and completeness. Upstream publication may lag.
