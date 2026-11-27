# Design system

The existing implementation in studio.css is the source of truth for current tokens. This is a product-specific system, not a replacement for the portfolio system.

- Editorial navy/orange palette, high-contrast text, condensed display typography and readable body text. Reserve accent for meaningful emphasis and interaction.
- Use chapter banners, KPI groups, analytical panels, field diagrams, accessible chart controls and editorial cards. Prefer consistent spacing and hierarchy over decorative borders.
- Chart colors encode a named meaning (team, opponent, positive/negative or category); pair color with labels and accessible descriptions. Do not treat orange as a universal success color.
- Responsive layout must preserve logical reading order, keyboard focus, touch targets and narrow-screen readability. Motion is optional and should honor reduced-motion preferences.
- Proposed shared components: MetricDefinition disclosure, PlayerIdentity, EditorialEntry, TriviaQuestion, Milestone and CoverageStatus. Keep domain calculation out of presentation.

Inventory actual CSS tokens and component variants before formal Figma library work (#80, #43, #47). No separate library or audited contrast claim yet.
