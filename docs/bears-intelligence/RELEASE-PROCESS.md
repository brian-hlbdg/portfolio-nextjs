# Release process

Bears Intelligence uses independent proposed versioning inside shared repository: bears-intelligence-v1.0.0, v1.1.0, etc. Tags are examples; do not create a tag until exact release commit and checks are confirmed. Patch = fixes, minor = compatible feature releases, major = significant breaking changes. Portfolio versioning remains separate.

Issue → design/data contract → feature branch → tests → PR → preview → merge → production deployment → smoke test → changelog/decision record → close issue. Document known limitations and rollback path (revert PR/restore last good snapshot; classic route available). Do not overwrite unrelated portfolio changes or bypass failed checks. Record release commit, date, issue links, test evidence, dataset coverage and outstanding risks. No arbitrary deadlines; roadmap targets are planning horizons.
