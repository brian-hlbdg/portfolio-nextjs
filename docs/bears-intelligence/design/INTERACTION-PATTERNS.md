# Interaction patterns

- Season changes preserve selected player identity when present; show explicit missing-player state otherwise.
- Player picker uses observed depth tier, position and name order. Proposed PR #69 restores selected row on reopen and provides adjacent-player navigation; verify iPhone Safari and keyboard behavior before closure (#68).
- Game navigation defaults to latest completed recorded game when possible; schedule links return focus and scroll to selected analysis (PR #38).
- Matchup opens next scheduled opponent by default; direct links and manual selection override it; historical fallback avoids random opponents.
- Coverage states explain missing/partial data; refresh button fetches published sources, not an ingestion job (PR #67; verify release status).
- Interactive charts expose selected values with text and do not rely solely on hover or color. Keep focus visible; support horizontal scrolling where necessary.
- Future trivia: stable question/option IDs, immediate feedback with explanation, no forced interruption; reset question state on subject change.

Verify focus restoration, reduced motion, scroll position, long labels, small viewports, loading/error/empty states and first/last boundaries.
