# Data dictionary — initial working definitions

Verify against generator modules and official totals under #40 before treating these as certified statistics. Source: nflverse regular-season PBP unless stated. Null is not zero; measured denominators matter.

| Metric | Unit / definition | Scope and caveat |
|---|---|---|
| Passer rating | NFL formula: four clamped components for completion rate, yards/attempt, TD rate, INT rate; sum / 6 × 100 | Recorded eligible passing attempts; sacks excluded; standard formula, totals require reconciliation |
| Completion % | completed passes / attempts × 100 | Eligible recorded attempts |
| Passing territory | air-yard depth (<0, 0–9, 10–19, 20+) and left/middle/right | Not tracking or route location; unclassified attempts excluded from zones |
| EPA | Expected points added; sum or mean of measured EPA as labeled | Missing EPA excluded from EPA denominator; not actual points scored |
| Success rate | positive EPA plays / measured EPA plays | Verify scope-specific exclusions |
| Third down conversion | recorded conversions / (converted + failed) by distance band | Uses explicit flags; missing flags excluded |
| Rushing lanes | run_location + run_gap, middle or unknown | Seven classified lanes; not exact path; kneels excluded from rushing profiles |
| Explosive rush | recorded gains ≥10 or ≥20 yards as labeled | Thresholds may overlap; chart definitions must distinguish bands |
| Receiving targets | eligible pass attempts with receiver ID | Not inferred from route tracking |
| Receiving yards | credited yards on completions | Validate missing source values |
| YAC / aDOT | measured yards after catch / average recorded air yards | Measured subset, not all targets necessarily |
| Red-zone opportunity | recorded snap/drive inside opponent 20 per module | Audit exact boundary and denominator before publishing education copy |
| Drive net yards / EPA | sums of recorded scrimmage plays per drive | Estimated endpoints; not official drive chart or tracking |
| Defensive sacks/hits | recorded event credits, half-sacks supported | Non-sack hits exclude sack events; field coverage varies |
| League rank | relative ordering of eligible comparison population | Passer qualification uses 14 attempts per team game; ties and scope matter |
| ESPN game score | completed score from ESPN | Independent of nflverse snapshot freshness |

Add stable metric IDs, versions, formulas, denominators, exclusions, source references and consumers to a shared registry (#74). Do not duplicate formulas in UI tooltips.
