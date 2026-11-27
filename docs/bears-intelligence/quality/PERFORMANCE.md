# Performance

Baseline evidence from initial release: build output reported 138 KB first-load JS for Intelligence versus 260 KB classic (~47% lower); not a measured LCP or user speed improvement. Verify against original logs before case-study publication. Build success is not runtime performance proof.

Track #47: establish repeatable mobile/desktop measurements of LCP, INP, CLS, transferred bytes, dataset parse time, artwork and missing-file requests. Suggested initial goals: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at 75th percentile where field data exists; lab results labeled separately. Prefer lazy images, bounded partitions, no raw league-wide PBP on first load, no redundant fetches. Define bundle/data budgets after measurement. Artwork size target ~350 KB, not a hard guarantee.
