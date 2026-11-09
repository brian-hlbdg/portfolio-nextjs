import { CaseStudyDetailData } from '@/components/features/types/caseStudyDetail';

export const aheadCapabilityMatrixCaseStudyData: CaseStudyDetailData = {
  hero: {
    category: 'Product Engineering · AHEAD',
    title: 'Manufacturer Capability Matrix: From Data Model to Client-Facing Feature',
    role: 'UX Designer & Frontend Developer',
    client: 'AHEAD',
    technologies: ['Elixir', 'Phoenix LiveView', 'Ecto', 'PostgreSQL', 'CSS'],
    timeline: 'Aug – Oct 2026',
    badges: ['Enterprise', 'UX Design', 'Frontend Development'],
    whyItMatters: 'A three-phase feature that set client expectations about manufacturer order-data capabilities before purchase — built, reviewed hard, reshaped twice at the data-model level, and redesigned from scratch after a "feels clunky" brief.'
  },

  teamComposition: {
    size: '5 people',
    structure: [
      { role: 'Author / Designer / Developer', count: 1, location: 'Chicago', responsibilities: ['All 41 commits across three phases', 'Data model design', 'UI implementation', 'Copy and accessibility'] },
      { role: 'Reviewer', count: 1, location: 'Distributed', responsibilities: ['Two structured code review rounds', 'Data model feedback', 'Security findings'] },
      { role: 'Business Owner / Curator', count: 1, location: 'Distributed', responsibilities: ['Defined scope and categories', 'Owns the ratings in production'] },
      { role: 'Platform Lead', count: 1, location: 'Distributed', responsibilities: ['Test infrastructure changes', 'warnings-as-errors enforcement'] },
      { role: 'Product Stakeholder', count: 1, location: 'Chicago', responsibilities: ['Client-surface constraints', 'Manufacturer vs. vendor distinction'] },
    ],
    collaboration: 'Async across time zones, with structured MR review cycles and a shared design canvas for the redesign phase'
  },

  tldr: {
    scope: 'Designed and built a three-phase feature for AHEAD: a Unity admin tab where a curator rates manufacturers against four order-data capabilities, a read-only Hatch page serving those ratings to clients, and a full redesign that reframed the data as an order journey with tier grouping.',
    approach: 'Started with the data model and let the review process reshape it substantially — the final schema looked nothing like the first commit. Used a shared design canvas for the redesign to settle every argument before writing a line of code.',
    leadership: 'Owned all three phases end-to-end: data model decisions, UI implementation, copy, accessibility, and the calls on scope. Navigated a security hole caught in review, two rounds of structural data model changes, three attempts at a symbol an icon font could not draw, and an "it feels clunky" brief with no specific defect.',
    impact: 'Shipped a live, client-facing capability matrix used by every Hatch customer — 13 manufacturers rated and published in production, with a redesign that made the data readable as a journey rather than a grid.'
  },

  overview: {
    challenge: {
      title: 'The Challenge',
      description: 'AHEAD needed a way to set client expectations about manufacturer order-data support before a purchase rather than after something turned out to be missing. The question was straightforward — does this manufacturer provide estimated ship dates, ship confirmation, advanced tracking, asset serials? — but there was no place to record or surface those answers.',
      problems: [
        'No structured record of manufacturer order-data capabilities existed anywhere in the system',
        'Clients were learning about gaps after purchase, not before',
        'Internal teams had no shared reference for what a given manufacturer could or could not provide',
        'The curator-to-client workflow needed to be built from scratch, including permissions, data entry, and display'
      ]
    },
    goals: {
      title: 'Project Goals',
      description: 'The feature had three distinct deliverables: a Unity admin tab for internal curation, a Hatch client-facing page for display, and eventually a redesign when the initial display was called "clunky." Throughout all three phases, the north star was accuracy — ratings that correctly described U.S.-based order data, presented in a way clients could act on.',
      objectives: [
        'Build a permission-gated Unity tab for a designated curator to rate each manufacturer against four capabilities',
        'Display those ratings on a read-only Hatch page visible to all customers',
        'Make the data model reflect business rules structurally, not just through validation logic',
        'Redesign the client-facing page so the data reads as a journey, not a flat grid'
      ]
    },
    role: {
      uxResearch: [
        'Worked with the business owner to define the four capability categories and three support levels',
        'Wrote copy for the client-facing page, including two iterations on the empty state and a disclaimer that clarified the data\'s scope',
        'Designed a shared canvas for the redesign phase, running four review rounds in 79 minutes before writing any code',
        'Resolved a naming conflict between "Vendor Scorecard" and "Manufacturer Capability Matrix" after the distinction was surfaced in review'
      ],
      frontendDev: [
        'Built all three phases: Unity tab, Hatch read-only page, and the redesigned Hatch page',
        'Implemented a save-state hint that reads Ecto changesets rather than tracking keystrokes',
        'Solved a symbol problem an icon font could not handle — a half-filled circle — by drawing it in CSS',
        'Used overflow: clip instead of overflow: hidden to let a sticky header work inside a rounded card'
      ],
      collaboration: [
        'Responded to seven review comments that each changed the design: types table pattern, naming ambiguity, visibility flag placement, permission migration removal',
        'Coordinated with the platform lead on test infrastructure after a warnings-as-errors change required a same-day rebase and additional test coverage',
        'Confirmed a customer-wide release as intended before merging, rather than letting it happen as a side effect'
      ]
    }
  },

  developmentApproach: {
    description: 'This feature was built in three distinct phases over six weeks. Phase one established the data model and admin tooling in Unity. Phase two built the client-facing Hatch page against that read model. The redesign replaced the display entirely after it was called "clunky" — but left the data model and query layer untouched. The separation of data from display paid off: the redesign was a presentation change, not a schema change.',
    techStack: {
      frontend: [
        'Phoenix LiveView for reactive, server-driven UI',
        'Scoped CSS with @scope compilation for Hatch page styles',
        'CSS gradients for the partial-support symbol (after icon fonts proved inadequate)',
        'overflow: clip for sticky header behavior inside rounded cards'
      ],
      backend: [
        'Ecto with NOT NULL constraints as business rule enforcement — an incomplete matrix cannot exist as a row',
        'Types table pattern for the three support levels (slugs, labels, icons, colors as data, not enums)',
        'Single upsert for save operations after the visibility flag moved onto the matrix row',
        'list_visible/0 as the sole query interface for the read model, shared across both display phases'
      ]
    },
    designPrinciples: [
      'Business rules in the schema: NOT NULL on all four capability fields means row existence equals "matrix complete." Nothing counts filled fields; callers check whether the row is there.',
      'Security by shape rather than vigilance: moving the visibility flag off the organizations table onto the matrix row made it impossible to cast through the general manufacturer edit form — no field to cast, no hole to guard.',
      'Canvas before code: the redesign settled every structural decision in 79 minutes on a shared canvas. Each round removed something that would otherwise have been built, styled, tested, and then questioned in review.',
      'Presentation over read model: the Hatch page owns no queries. list_visible/0 filters, orders, and preloads in one pass. The page is pure presentation over an existing read model.'
    ]
  },

  research: {
    sections: [
      {
        title: 'Defining the Capability Categories',
        content: 'The initial brief called for six capabilities. Working with the business owner during review, that number came down to four. ESD Accuracy was a judgment about a date the matrix already reports on, not a capability a manufacturer has or lacks. Entitlement Data sat outside the order-data expectations the matrix exists to set. The two that remained alongside the core four answered the same question a client actually asks — "can I rely on this or not" — but splitting why something was unreliable put a distinction in front of clients they could not act on. The merge to Partially Supported simplified both the data and the legend wording.',
        subsections: [
          {
            title: 'From Six Capabilities to Four',
            content: 'Est. Ship Date, Ship Confirmation, Advanced Tracking, and Asset Serials survived. ESD Accuracy was dropped because it evaluated a date the matrix already surfaces — it was a meta-rating, not a capability. Entitlement Data fell outside the core order-data expectations. The business owner made both calls; they clarified scope rather than reduced ambition.'
          },
          {
            title: 'From Four Support Levels to Three',
            content: 'Manually Supported and Partial answered the same client question and were consolidated into Partially Supported. The legend wording changed with this: from naming the mechanism ("manually provided") to naming what to expect ("provided for some orders, or on request rather than automatically"). A client can act on the second; they can only understand the first.'
          }
        ]
      },
      {
        title: 'Understanding the Client Surface Constraint',
        content: 'The product stakeholder\'s constraint was that client-facing surfaces expose manufacturers and never vendor names. This came up during phase one when the mockup grouped manufacturers under distributor headers and showed spend per row. The constraint was structural, not aesthetic: the matrix is keyed to manufacturer rows and cannot point at a vendor. Satisfying it did not require ongoing discipline — it was satisfied by the data model\'s shape. It also turned phase one\'s one-rating-per-manufacturer unique index from a recorded limitation into exactly the right design.',
        subsections: [
          {
            title: 'What the Phase Two Mockup Got Wrong',
            content: 'The prototype grouped manufacturers under distributor/vendor headers and included spend and PO count columns. The stakeholder\'s constraint meant those vendor-axis rows were wrong rather than inconvenient. Dropping the vendor grouping removed the purchase-path dimension, which had its own effect: phase one\'s unique-per-manufacturer index stopped being a limitation and became correct. Phase three\'s redesign later reintroduced grouping — by coverage tier instead of by vendor — which satisfied the constraint without being discussed, because it was satisfied structurally.'
          }
        ]
      },
      {
        title: 'The "It Feels Clunky" Redesign Brief',
        content: 'The redesign brief was a feeling, not a defect. The page showed the same thing for every manufacturer and people found it clunky. It came with prompts to think about icon and logo spacing, current design standards, what Hatch is for, and grouping. Before any drawing, three choices were settled in planning: a journey matrix over manufacturer cards or a light refinement, filter chips plus a stat strip, and a mockup before any code. The business owner asked for a canvas he could share rather than an HTML file, which changed how the design process worked — four review rounds on a shared canvas, every structural argument resolved before the container was opened.',
        subsections: [
          {
            title: 'What the Canvas Removed Before Any Code Ran',
            content: 'Filter chips were built on the canvas as working toggles with a "showing N of 19" line and a no-match state, then cut in the first review round. The business owner\'s reasoning was structural: the Complete tier matches every filter by definition, so filtering a grouped list mostly re-states the grouping. Row lines were cut because they implied capabilities depend on each other — Eaton sends serials with no advanced tracking, so a line connecting those cells was false. The dark artboard, mobile layout, and three-colour scheme were also removed before any code ran. None of them had to be built, styled, tested, and then questioned.'
          }
        ]
      }
    ]
  },

  designProcess: {
    description: 'The process differed significantly across phases. Phase one was a build-then-review cycle where the most important decisions happened after the MR opened. Phase two was a build-and-iterate cycle shaped by a stale CSS build trap and three attempts at a symbol. The redesign was a canvas-first cycle where every decision resolved before any code was written.',
    steps: [
      {
        number: 1,
        title: 'Phase One: Build, Then Reshape Under Review',
        description: 'Six quiet days of building, then four consecutive days in which review comments changed the data model twice. The types table pattern — predefined value sets as a seeded database table with named constants, not string enums — came from the first review round and became the structural foundation of the whole feature. The second round moved the visibility flag off the organizations table and cut 221 lines of permission migration. Almost everything structural happened after the MR was opened.'
      },
      {
        number: 2,
        title: 'The Types Table Decision',
        description: 'The reviewer\'s first comment was that predefined value sets belong in a types table, not a string enum, with a seeder and named constants. The types table went in the same day. It is the pattern the whole feature rests on: slugs, labels, legend text, icons, and colors as data rather than code. A fifth level could be seeded tomorrow by someone who has never seen the presentation layer. The page degrades gracefully for an unknown slug rather than rendering an empty circle.'
      },
      {
        number: 3,
        title: 'The Visibility Flag Move',
        description: 'Moving the visibility flag from the organizations table onto the matrix row collapsed two visibility conditions into one, removed a join, retired an Ecto.Multi, and closed a security hole by shape rather than by vigilance. With the field absent from Organization, no form can cast it. One thing was lost: a manufacturer can no longer be marked "intended for the matrix" before being rated, because until then there is no row to hold the flag. That tradeoff was accepted.'
      },
      {
        number: 4,
        title: 'Phase Two: The Symbol Problem',
        description: 'Partial support needed a half-filled circle. Font Awesome had the glyph. It took three attempts to discover that an icon font cannot draw what the design needed simultaneously — a filled half, which carries the meaning, and a thin edge, so the circle does not shout. fa-solid gives a filled half with a heavy edge. fa-regular gives a thin edge with no fill. CSS makes both properties independent values, so the pill draws itself with no glyph at all. Recognising that three rounds earlier would have saved all three.'
      },
      {
        number: 5,
        title: 'Redesign: Canvas Before Code',
        description: 'The redesign settled every structural decision in 79 minutes on a shared canvas. The business owner reviewed four artboard rounds: today\'s table recreated for comparison, the proposal, a filtered state, and detail callouts. Each round removed something — filter chips, row lines, dark artboard, mobile layout, stat cards. What remained went directly to code with no visual iteration, because every argument had already happened on the canvas.'
      }
    ]
  },

  solution: {
    description: 'Three phases shipped to production. Phase one built the data foundation and Unity admin tooling. Phase two built the client-facing Hatch display. The redesign replaced the display with a journey-framed, tier-grouped matrix that answered "it feels clunky" without touching the data model.',
    features: [
      {
        number: 1,
        title: 'Unity Admin Tab',
        description: 'A permission-gated tab on the Unity manufacturer detail page. A curator picks a support level for each of four capabilities — Estimated Ship Date, Ship Confirmation, Advanced Tracking, Asset Serials — and ticks a box to publish that manufacturer to the client-facing page. The save state reads from the Ecto changeset rather than tracking keystrokes: "All changes saved" when changes is empty, "Unsaved changes" when it is not. Editing a value back to its stored one returns to saved for free, because Ecto drops no-op changes.'
      },
      {
        number: 2,
        title: 'Data Model: NOT NULL as a Business Rule',
        description: 'Two database tables back the feature. manufacturer_capability_levels is a types table holding the three support levels with their labels, legend text, icons and colors. manufacturer_capability_matrices holds one row per rated manufacturer: four level references, all NOT NULL, plus a visible flag. The NOT NULL choice is load-bearing rather than incidental. The business rule is that all categories must be rated before anything saves, so an incomplete matrix cannot exist as a row — which makes row existence equivalent to "matrix complete." Nothing counts filled fields; callers check whether the row is there.'
      },
      {
        number: 3,
        title: 'Hatch Client-Facing Page (Phase Two)',
        description: 'A read-only LiveView at /h/:organization_id/capability-matrix, reached from a Procurement → Capability Matrix entry in the Hatch sidebar. One row per published manufacturer, one column per capability, a pill in each cell for Fully, Partially, or Unsupported. A legend decodes the pills, a tooltip decodes a single cell on hover. The page owns no queries: list_visible/0 from phase one applies both visibility rules and preloads every level in one pass. The merge put this page in every Hatch customer\'s sidebar, populated with thirteen manufacturers the curator had already rated in production — confirmed as intended before merging.'
      },
      {
        number: 4,
        title: 'Redesigned Journey Matrix (Redesign Phase)',
        description: 'The same data, presented as the stages of an order: Ordered (est. ship date), Shipped (ship confirmation), In transit (advanced tracking), In your records (asset serials). Their header joins the stages with a line and sticks to the top of the page while scrolling. Manufacturers group into three tiers: Complete order data (all four fully supported), Most (at least three provided, automatically or partially), and Limited. The marks are a solid blue disc with a check, a half-filled disc, and an empty ring. Nothing outside the Hatch capability matrix directory changed. The Unity tab, level seeds, and list_visible/0 are untouched.'
      }
    ],
    improvements: [
      {
        title: 'Data Model Wins',
        items: [
          'Types table pattern: support levels as seeded data, not enums — the presentation layer degrades gracefully for an unknown slug',
          'NOT NULL as business rule: row existence equals completeness, so callers never count fields',
          'Visibility flag on the matrix row: one column filter replaces a join, Ecto.Multi, and a narrow changeset guard'
        ]
      },
      {
        title: 'UI Decisions That Held Up',
        items: [
          'Save-state hint reads the Ecto changeset, not keystrokes — editing a value back to stored returns to "saved" for free',
          'CSS half-disc for partial support: filled half and thin edge as independent properties, impossible in an icon font',
          'overflow: clip instead of overflow: hidden — clips without becoming a scroll container, so the sticky header attaches to the page',
          'Column names repeated in every tier band: the more robust answer to "you lose which column you\'re in," since it survives screenshots, print, and narrow screens where sticky does nothing'
        ]
      },
      {
        title: 'Scope Cuts That Improved the Feature',
        items: [
          'Filter chips cut: filtering a list already grouped by coverage mostly re-states the grouping — Complete passes every filter by definition',
          'Row connecting lines cut: they implied capabilities depend on each other; Eaton sends serials with no advanced tracking, so the line was false',
          '221 lines of permission migration deleted: the Signal admin UI writes both permission tables in one transaction; a migration pair across two repos had no ordering guarantee and a silent failure mode',
          'Traffic-light colors replaced with a monochrome scheme: a column of red crosses read as failing grades, contradicting the disclaimer that ratings describe data coverage, not manufacturer quality'
        ]
      }
    ]
  },

  results: {
    description: 'The capability matrix shipped across three phases between September and October 2026, moving from an internal admin tool to a live client-facing feature used by every Hatch customer.',
    metrics: [
      {
        label: 'Manufacturers Rated',
        value: '13',
        change: 'in production at launch',
        description: 'Published',
        color: 'blue'
      },
      {
        label: 'Lines of Migration Cut',
        value: '221',
        change: 'replaced by a single UI action',
        description: 'Removed',
        color: 'green'
      },
      {
        label: 'Review Rounds',
        value: '6',
        change: 'across phase one alone',
        description: 'Completed',
        color: 'orange'
      },
      {
        label: 'Symbol Attempts',
        value: '3→CSS',
        change: 'tilde → fa-solid → fa-regular → drawn in CSS',
        description: 'Iterations',
        color: 'orange'
      }
    ],
    businessOutcomes: [
      {
        text: 'Every Hatch customer now sees manufacturer capability ratings before purchase — 13 manufacturers live at launch, with the curator adding more.',
        icon: 'check'
      },
      {
        text: 'The visibility flag architecture means publishing a manufacturer is a single checkbox, one upsert, one history entry — the original design required an Ecto.Multi across two tables.',
        icon: 'check'
      },
      {
        text: 'The read model (list_visible/0) supports both display phases without modification — the redesign was a pure presentation change because the data layer was designed correctly the first time.',
        icon: 'check'
      },
      {
        text: 'The permission migration cut eliminated a silent dual-database failure mode that could have granted access in Signal while denying it in Unity with nothing in the logs.',
        icon: 'check'
      }
    ],
    userFeedback: [
      {
        quote: 'The page was called "clunky" after phase two. That brief — a feeling, not a defect — led to the journey matrix framing, tier grouping, and a canvas-first design process that settled every argument before any code ran.',
        author: 'Business Owner',
        role: 'Internal feedback leading to the redesign'
      },
      {
        quote: 'The merge was a customer-facing release, not just a code landing. Thirteen manufacturers were already rated in production, five of them published during a single afternoon while the branch was being rebased.',
        author: 'Post-merge observation',
        role: 'Phase two'
      }
    ],
    longTermValue: [
      {
        title: 'Extensible by Design',
        description: 'A fifth capability or a fourth support level can be added by seeding a row. The presentation layer degrades gracefully — unknown slugs keep the glyph from the types table in a neutral pill. The tier thresholds are the one place that would need a code change.',
        color: 'blue'
      },
      {
        title: 'Canvas Before Code as a Practice',
        description: 'The redesign was built in one pass, straight from the canvas, with no visual iteration. That only worked because every design argument had already happened. The filter chips, row lines, dark artboard, and mobile layout were all removed on the canvas. None of them had to be built, styled, tested, and then questioned in review.',
        color: 'green'
      },
      {
        title: 'Schema as the Source of Truth',
        description: 'NOT NULL as a business rule, row existence as completeness, visibility collocated with the data it gates — these decisions moved correctness into the schema rather than into application logic that can be omitted. The save-state hint, the security model, and the query simplicity all follow from the same source.',
        color: 'orange'
      }
    ]
  },

  decisions: [
    {
      num: '01',
      title: 'Visibility flag: organizations table vs. matrix row',
      rejected: {
        title: 'Flag on organizations',
        description: 'A boolean on the organizations table. Publishing a manufacturer requires a join to read the flag, an Ecto.Multi to write across two tables, and a narrow changeset to prevent the general manufacturer edit form from casting it — which had already created a privilege-escalation hole.'
      },
      chosen: {
        title: 'Flag on the matrix row',
        description: 'The visibility flag lives on manufacturer_capability_matrices. One column filter, one upsert, no join. The security hole closes by shape: with no field on Organization, no form can cast it. One thing is lost — a manufacturer cannot be marked "intended for the matrix" before it is rated, because there is no row to hold the flag.'
      },
      why: 'The reviewer\'s argument was about table hygiene, but the simplification was larger than that argument suggested. Moving the flag eliminated the Multi, the join, the narrow changeset, and the class of bug that changeset was guarding against. The tradeoff — no "pending" state before rating — was accepted.'
    },
    {
      num: '02',
      title: 'Permission setup: migration pair vs. Signal admin UI',
      rejected: {
        title: 'Migration pair across two repos',
        description: 'A legacy permission grant requires writes to two tables in two databases — Signal reads one, Unity reads the other. Write only the first and the permission is honoured in Signal and silently denied in Unity, with nothing in the logs. A migration pair across two repos has no ordering guarantee and a noisy guard (a deliberate RuntimeError) to fail loudly rather than silently no-op.'
      },
      chosen: {
        title: 'Signal admin UI as the canonical path',
        description: '221 lines of migration deleted. The Signal admin UI writes both tables in one transaction. The repo\'s own documentation already said this was canonical. The reviewer granted himself the permission through the test UI while reviewing the MR, and both sides came out consistent without any of that code.'
      },
      why: 'The migrations were doing by hand what the UI does atomically. A merge now depends on a manual step in two environments, and the failure mode is silent — but that was already the case. The migrations just obscured it with false confidence.'
    },
    {
      num: '03',
      title: 'Partial support symbol: icon font vs. CSS',
      rejected: {
        title: 'Font Awesome half-circle',
        description: 'fa-solid gives a filled half but a heavy edge. fa-regular gives a thin edge but no fill. The partial-support symbol needs both at once: a filled half to carry the meaning ("some of this data, some of the time") and a thin edge so the circle does not shout. An icon font offers discrete weights; each weight fixes one property at the cost of the other.'
      },
      chosen: {
        title: 'CSS gradient, no glyph',
        description: 'A linear-gradient on the pill draws the filled half. The border is the edge. Both properties are independent CSS values. The glyph is gone from the template entirely. The lesson: an icon font is a set of finished decisions. When a symbol\'s meaning depends on two of those decisions varying independently, no amount of picking weights will get there.'
      },
      why: 'Three rounds of trying weights before accepting that the constraint was in the medium, not the values. Recognising it one round earlier would have saved two.'
    },
    {
      num: '04',
      title: 'Card scrolling: overflow: hidden vs. overflow: clip',
      rejected: {
        title: 'overflow: hidden',
        description: 'The usual choice for clipping children inside a rounded card. It also makes the card a scroll container. A sticky element sticks to its nearest scroll container — which is the card, which never scrolls. The header attaches to the card and scrolls away with the page.'
      },
      chosen: {
        title: 'overflow: clip',
        description: 'Clips content without establishing a scroll container. The sticky header attaches to the page (or the nearest scrolling frame), so it pins while the manufacturers scroll. At narrow widths, overflow-x: auto makes the card a scroll container again for horizontal overflow — the repeated column labels in each tier band take over there.'
      },
      why: 'The distinction between "clips content" and "creates a scroll container" is not obvious. overflow: clip was added to CSS specifically for this case, but it is easy to reach for overflow: hidden by habit and wonder why sticky does nothing.'
    }
  ],

  reflections: {
    description: 'Three phases over six weeks. The honest summary is that the most important decisions in each phase came from outside — review comments that changed the data model, a business owner who reshaped scope, a brief that said "clunky" without saying what to fix. The work was responding well to those inputs, which is different from getting them right the first time.',
    whatWorkedWell: [
      {
        title: 'The data model survived all three phases intact',
        description: 'list_visible/0 served both the phase-two display and the redesign without modification. NOT NULL as the completeness rule worked at every layer — the query, the UI state hint, the security model. Getting that right in phase one meant the display phases were pure presentation.',
        icon: 'check'
      },
      {
        title: 'The canvas-first redesign process',
        description: 'Four review rounds in 79 minutes removed the filter chips, the row lines, the dark artboard, the mobile layout, and the stat cards before any code ran. The build session took one pass with no iteration, because every argument had already been resolved. This was the cheapest part of the redesign, and the reason everything after it was cheap.',
        icon: 'check'
      },
      {
        title: 'Accepting the reviewer\'s structural changes',
        description: 'Each of the reviewer\'s seven comments changed the design rather than the implementation. The types table, the visibility flag placement, the permission migration cut — none of these were obvious from the original design, and each one simplified what followed. The right response to a review comment that changes the architecture is to understand it rather than defend the original.',
        icon: 'check'
      }
    ],
    challenges: [
      {
        title: 'Trusting a proxy instead of the thing itself',
        description: 'Four mistakes across phases two and three shared one pattern: trusting a signal for something it does not measure. A test count for coverage. A grep\'s scope for the codebase. A CI job\'s green status for its findings. A watcher for a build. The proxies were all real signals — correct about what they measured, silent about what I actually wanted to know. The practical fix is a sentence: state what a signal proves before relying on it. Writing the lesson down in phase two was not enough to apply it in phase three.',
        icon: 'alert'
      },
      {
        title: 'The stale CSS build trap',
        description: 'Twice in phase two, a CSS change had no visible effect after a hard refresh. The source was correct. The browser was honest. The generated stylesheet had not been rebuilt — the watcher had stopped silently. No error appeared anywhere. The only evidence was a file modification timestamp three hours behind the edit. The diagnosis took longer than it should have because "my CSS is wrong" and "my CSS never ran" have identical symptoms and no overlap in their fixes.',
        icon: 'alert'
      },
      {
        title: 'The symbol took three rounds',
        description: 'Partial support is "some of this data, some of the time." The symbol needed a filled half and a thin edge simultaneously. An icon font fixes one at the cost of the other. This was discoverable from the medium before the first attempt. Three rounds happened anyway, because the first attempt seemed close enough to try adjusting rather than stepping back to ask why it couldn\'t work.',
        icon: 'alert'
      }
    ],
    keyTakeaways: [
      {
        title: 'Business rules belong in the schema',
        description: 'NOT NULL on all four capability fields means incomplete matrices cannot exist. Row existence is the completeness check. The security model, the query simplicity, and the save-state hint all follow from the same schema decision. Putting business rules in application logic means they can be omitted; putting them in constraints means they cannot.'
      },
      {
        title: 'The cheapest iteration is the one that never runs',
        description: 'The canvas removed four features before any code ran. The review cut 221 lines before the first MR merged. The business owner\'s scope calls removed two capability categories and merged two support levels before the data layer existed. Every one of these was cheaper than building, testing, and then removing the same thing after it shipped.'
      },
      {
        title: 'Name what a signal proves before relying on it',
        description: 'A green test count is not evidence of coverage. A job\'s green status is not its findings. A watcher running is not a rebuilt file. A grep in one worktree is not evidence about another. Each of these proxies is a real signal — correct about what it measures. The habit is to state the measurement before concluding about the thing you actually wanted to know.'
      }
    ]
  }
};
