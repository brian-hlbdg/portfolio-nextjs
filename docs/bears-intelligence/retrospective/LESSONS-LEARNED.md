# Lessons learned

- Prototype isolation protected existing product while exploring an alternative experience (#52).
- User feedback changed the information hierarchy, opponent logo emphasis and player/game navigation (#59, #61, #68). Verify improvements on actual devices.
- Data semantics matter more than visual precision: no invented tracking or silent sample fallback (#54, #59).
- Passing module tests did not catch generator name shadowing; production refresh failed safely. Add end-to-end fixture and integration tests (#39, PR #66).
- Shared repository creates cross-product deployment coupling: unused resume route blocked static export (#64). Maintain boundaries and full build checks.
- Published snapshot age is not the same as source coverage or last successful refresh (#41).
- Capture decision records as work happens; retrospective issues are evidence indexes, not original planning timestamps.

Next: validate these lessons against exact logs and issue evidence before final AAR (#49).
