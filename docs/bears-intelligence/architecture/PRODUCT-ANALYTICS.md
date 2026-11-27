# Product analytics measurement plan — proposed v1

Issue #92; epic #91. Separate visitor behavior telemetry from football analytics and portfolio traffic.

## Audit (November 27, 2026)
package.json includes @vercel/speed-insights ^2.0.0; no PostHog, GA4 or Vercel Web Analytics dependency. Root and Chicago Sports layouts do not initialize tracking. Bears route renders Studio. This is not an exhaustive runtime/network audit. Account-level enablement, existing external scripts, provider pricing and privacy settings require verification.

## Provider direction
Evaluate PostHog for explicit product events and anonymous journeys; Vercel Speed Insights for web vitals. Compare with Vercel Web Analytics and GA4. Use provider-neutral adapter and public client configuration only; no server secrets in static export. Confirm current allowances and disable billable extras before activation. Do not enable collection yet.

## Measurement
Primary proposed KPI: weekly engaged visitors (estimated distinct consenting browser IDs with >=2 meaningful intentional interactions in one session; exclude initial views and refresh). Report denominator, consent bias, bot/owner exclusion and date window. Separate sessions from people; no cross-device identity assumptions. Compare game-day vs non-game-day by America/Chicago calendar date and actual schedule; establish baseline before targets.

| Event | Properties beyond common fields | Meaning |
|---|---|---|
| intelligence_view_selected | view, previousView | Intentional tab change |
| player_selected | playerId, method: picker/previous/next | Roster exploration |
| player_search_used | none | Search engagement; never raw text |
| season_selected | season, previousSeason | Historical interest |
| game_selected | gameId, method | Game exploration |
| drive_selected | gameId, driveId | Possession exploration |
| opponent_selected | opponentId | Comparison interest |
| metric_explored | metricId, interactionType | Meaningful chart selection |
| data_check_requested | view | Freshness concern; not ingestion |
| football_iq_opened | metricId | Education (future) |
| trivia_answered | questionId, correct | Trivia (future) |
| portfolio_link_selected | destinationCategory | Portfolio discovery |

Common: product=bears-intelligence, eventVersion=1, season, view where applicable. Public football IDs only; validate enums and lengths. No names/emails of visitors, free-text searches, precise location, arbitrary URLs/query strings, session replay or fingerprinting. Use explicit events, disable autocapture and automatic pageview capture unless separately reviewed. Exclude lab, localhost, previews and opt-out/test traffic; deduplicate intended actions, not separate deliberate clicks. Consent gate and privacy notice before collection; review IP handling, retention, opt-out/reset and applicable requirements. SDK failures must not block UI.

## Dashboard and validation
Traffic, engaged visitors, feature use, navigation sequence, returning browser estimates, device categories and game-day trend; measure web vitals separately. Confirm production events in provider debugger and inspect network payloads; test consent denied, revoked, SDK blocked, rapid interaction, historical season and mobile. Avoid claims of causal UX improvement without appropriate evaluation. Record verified outcomes in #49.

## Open decisions
Provider account/project, current free limits and cost controls, consent UX and geographic scope, retention period, owner traffic exclusion and deployment configuration. #93 depends on these decisions; #94 and #95 follow. No provider or tracking code activated by this document.
