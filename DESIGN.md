---
name: iPAS 能力鑑定 練習
description: A free, login-free practice and study site for iPAS AI / AIoT certification, built as a warm paper notebook with one deep-green voice.
colors:
  paper: "#f5f2eb"
  panel: "#fffdf8"
  panel-raised: "#ffffff"
  panel-alt: "#e7efe9"
  ledger-green: "#196f5a"
  ledger-green-deep: "#14342b"
  on-accent: "#ffffff"
  accent-soft: "#edf7f1"
  accent-tint: "#dcefe5"
  correct: "#4c9b7f"
  correct-soft: "#dff2e9"
  wrong: "#a84a3a"
  wrong-soft: "#fff4ed"
  warn-bg: "#fdf3e3"
  warn-fg: "#8a5a1b"
  warn-border: "#e0bd83"
  ink: "#16211b"
  ink-muted: "#43524b"
  hairline: "rgba(22, 33, 27, 0.14)"
  bar-bg: "rgba(245, 242, 235, 0.94)"
  shadow-tint: "rgba(18, 35, 28, 0.05)"
  backdrop: "rgba(16, 24, 20, 0.45)"
typography:
  display:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "2.5rem"
    fontWeight: 850
    lineHeight: 1.15
    fontFeature: "tnum"
  headline:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.25
  section-title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.4
  card-title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 800
    lineHeight: 1.35
  title:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.4
  prompt:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.8
  small:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.4
  node-code:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Noto Sans TC', 'Microsoft JhengHei', sans-serif"
    fontWeight: 800
    letterSpacing: "0.01em"
    fontFeature: "tnum"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"
    fontSize: "0.82rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  mark: "3px"
  code: "6px"
  control: "8px"
  card: "10px"
  panel: "12px"
  pill: "999px"
  circle: "50%"
spacing:
  hair: "4px"
  xs: "6px"
  sm: "8px"
  sm-plus: "10px"
  md: "12px"
  md-plus: "14px"
  lg: "16px"
  card: "18px"
  xl: "20px"
  section: "28px"
  tap: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ledger-green}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.control}"
    padding: "10px 18px"
    height: "{spacing.tap}"
  button-primary-hover:
    backgroundColor: "{colors.ledger-green-deep}"
    textColor: "{colors.on-accent}"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ledger-green}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
    height: "{spacing.tap}"
  button-secondary-hover:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ledger-green}"
  choice:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "14px"
    height: "{spacing.tap}"
  choice-selected:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.ink}"
  choice-correct:
    backgroundColor: "{colors.correct-soft}"
    textColor: "{colors.ink}"
  choice-wrong:
    backgroundColor: "{colors.wrong-soft}"
    textColor: "{colors.ink}"
  choice-id:
    textColor: "{colors.ledger-green}"
    rounded: "{rounded.circle}"
    size: "28px"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  card-hover:
    backgroundColor: "{colors.accent-soft}"
  chip-topic:
    backgroundColor: "{colors.panel-alt}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  chip-source-warning:
    backgroundColor: "{colors.warn-bg}"
    textColor: "{colors.warn-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  chip-section:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    height: "40px"
  chip-section-current:
    backgroundColor: "{colors.ledger-green}"
    textColor: "{colors.on-accent}"
  segmented-tab-active:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "{spacing.tap}"
  input-search:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "10px 12px 10px 42px"
    height: "{spacing.tap}"
  node-row:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    padding: "12px 16px"
    height: "60px"
  resume-card:
    backgroundColor: "{colors.ledger-green}"
    textColor: "{colors.on-accent}"
    rounded: "{rounded.panel}"
    padding: "18px 20px"
  sticky-bar:
    backgroundColor: "{colors.bar-bg}"
    textColor: "{colors.ink}"
    padding: "8px 16px"
  dialog:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "22px 20px 18px"
  note-formula:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ledger-green}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  note-table-head:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.ledger-green}"
    typography: "{typography.small}"
    padding: "6px 10px"
---

# Design System: iPAS 能力鑑定 練習

## Overview

**Creative North Star: "The Green-Ink Study Ledger"**

The site reads like a well-kept exam notebook: warm paper ground, near-black green ink, and a single deep-green pen used for everything that is yours to press or that marks where you are. It is a working tool for people studying in short phone sessions, so density is moderate, every control is a full thumb-sized target, and the chrome stays quiet so the question, the answer, and the node code carry the page.

Depth is soft and rare. Top-level choices (certificate, level, mode, subject) sit on lightly lifted cards; everything inside a panel is flat and separated by hairlines rather than by nested boxes. State is shown by fill, not by decoration: a choice letter circle is hollow until chosen, a section chip is outlined until it is the current one, a node's read-mark is an empty ring until it is filled green. The same green also fills the one primary action on any screen.

Color carries meaning, never mood. Green is identity and action; a muted sage green is "correct"; brick red is "wrong"; amber is reserved for provenance warnings (AI 命題・待複審) and search hits. Dark mode is the same ledger by lamplight: every semantic token is swapped as a set, never redesigned.

**Key Characteristics:**
- Warm paper ground (#f5f2eb) with off-white panels, one green accent.
- A single system sans stack with explicit Traditional Chinese faces; tabular figures for every code, count, and timer.
- 44px minimum tap target on every interactive control.
- Hairline dividers drawn with inset box-shadow; flat rows inside one rounded panel instead of nested cards.
- Fill-to-select state language (letter circles, chips, read-marks, exam-map cells).
- Hover styling exists only for real pointers; touch never sees sticky hover.

## Colors

A warm-neutral paper palette with one deep green carrying identity and action, plus three semantic hues that only ever mean outcome or caution.

### Primary
- **Ledger Green** (`ledger-green`): primary buttons (交卷, 練這一節, confirm primary), the 「接著讀」 resume card, current section chip, filled choice-letter circles, node codes, subject codes, card titles, focus ring, `accent-color` for native controls. Dark value #6cc7a3.
- **Deep Ledger Green** (`ledger-green-deep`): hover state of every solid-green control. Never used at rest. Dark value #8fd8bb.
- **On-Accent** (`on-accent`): text and icons on solid green. Dark value #0b1a13 (dark text on the lighter dark-mode green).
- **Accent Soft** (`accent-soft`): selected/active wash for outlined controls (active filter, open menu summary, read toggle, hover on cards), formula blocks, note-table header row, "all read" note.
- **Accent Tint** (`accent-tint`): selected-choice background, progress-bar track, text selection, link underline at rest, formula block border.

### Secondary (semantic outcome)
- **Sage Correct** (`correct` / `correct-soft`): correct choice border and wash, correct answer summary, answer-strip cells, topic-rate bars.
- **Brick Wrong** (`wrong` / `wrong-soft`): wrong choice, failing score, low timer, reset/danger buttons, overconfidence note.

### Tertiary (caution)
- **Ledger Amber** (`warn-bg` / `warn-fg` / `warn-border`): the 「AI 命題・待複審」 provenance badge, the mode-card warning line, and `mark` highlights of search hits in the reader.

### Neutral
- **Paper** (`paper`): page ground; also the inner ground of code figures and the 2px gaps in the answer strip.
- **Panel** (`panel`): cards, node-list panels, popovers, dialog, secondary buttons.
- **Panel Raised** (`panel-raised`): choices, inputs, the active segmented tab: surfaces that sit a step above a panel.
- **Panel Alt** (`panel-alt`): quiet green-grey fills: topic chips, explanation box, reader scope box, segmented-control track, skipped cells.
- **Ink** (`ink`) / **Ink Muted** (`ink-muted`): body text and secondary text. Reading text in the study reader uses Ink, not Muted.
- **Hairline** (`hairline`): every border and divider (14% ink).
- **Bar Glass** (`bar-bg`): translucent ground for sticky bars, always with a 10px backdrop blur.
- **Shadow Tint** (`shadow-tint`) and **Backdrop** (`backdrop`): green-black shadow color and dialog scrim.

### Named Rules
**The One Green Rule.** Green is the only hue for identity and action. If something is pressable, current, or the primary next step, it is green; nothing else on the page competes with it.

**The Warning Is Not Wrong Rule.** Provenance cautions use amber, never brick red. Red means "you answered wrong" and nothing else.

**The Two-Place Dark Rule.** Every color token is declared on `:root` and given a dark value in both `@media (prefers-color-scheme: dark)` and `:root[data-theme="dark"]`. A color that exists only in light mode is a bug.

## Typography

**Display Font:** system UI sans (system-ui, -apple-system, Segoe UI) with PingFang TC, Noto Sans TC, Microsoft JhengHei for Han text
**Body Font:** the same stack
**Label/Mono Font:** ui-monospace / SF Mono / Menlo / Consolas, only for code figures and formula expressions

**Character:** One family, ranked by weight and position rather than by contrasting faces. Headings are bold and compact; reading text is generous in leading for dense Chinese technical prose.

### Hierarchy
- **Display** (850, 2.5rem, 1.15, tabular): the score on the result page only.
- **Headline** (700, 1.75rem, 1.25–1.3): the page h1 in the topbar and the reader's node title, where it is prefixed by the node code.
- **Section Title** (700, 1.375rem, 1.4): note-section headings inside the reader.
- **Card Title** (700–800, 1.25rem): card headings on choice cards, resume-card title, dialog title.
- **Title** (700, 1.125rem): subject names, group headings, empty-state heading, diagnostic headings; the question prompt uses this size at regular weight with 1.7 leading.
- **Body** (400, 1rem, 1.6–1.8): explanations at 1.75, reader list items at 1.8. Column is bounded by the 820px app width.
- **Small** (0.875rem): meta lines, hints, counts, table cells in notes.
- **Label** (700, 0.8125rem): pills and badges (topic, source, reader-source, figure labels).

### Named Rules
**The No-Shrinking-Headings Rule.** h4 and h5 are never smaller than body text (1.0625rem and up); lower levels are distinguished by weight and placement, not by shrinking.

**The Tabular Anchor Rule.** Node codes (L11101, A1.1), question numbers, counts, timers, and percentages always set `font-variant-numeric: tabular-nums`; node codes are additionally 800 weight in green so they anchor each row and each reader page.

## Layout

Single centered column: max width 820px, page padding 20px top, 16px sides, 48px bottom. The topbar is a 44px-tall flex row (back button, h1 or breadcrumb, optional tool menu or timer pushed right), 18px above content.

Choice grids (certificate, level, mode, subject) are one column with 14px gaps at every width. Drill filters are a four-column equal grid. The exam map is a ten-column grid. The study index pairs two side-by-side shortcut tiles and a two-way segmented switch.

Spacing runs on a small, even-leaning scale (4, 6, 8, 10, 12, 14, 16, 18, 20, 28px): 8–14px inside controls and between siblings, 18px card padding, 28px between major groups and reader sections.

Sticky and fixed chrome: the exam bar and the reader's section-chip bar stick to the top; the reader dock is fixed to the bottom with safe-area padding, and the reader reserves 96px bottom padding for it. Anchored scrolling uses `scroll-margin-top` so targets land below the sticky bar.

Breakpoints are content-driven max/min-width queries: 400px (dock drops step codes), 430px (exam-bar label visually hidden), 520px (topic bars hidden, resume card stacks), 640px (section chips wrap instead of scrolling sideways). Wide content (code, note tables, chip tracks) scrolls inside its own container; the page itself never scrolls horizontally.

## Elevation & Depth

Mostly flat with soft, ambient lift reserved for things that are either top-level choices or floating above the page. Shadows use the green-black `shadow-tint` (5% in light, 35% in dark), are large-blur and low-offset, and never hard-edged. Inside a panel everything is flat; separation comes from hairlines and tonal fills (panel → panel-alt → accent-soft).

### Shadow Vocabulary
- **Card lift** (`box-shadow: 0 6px 18px var(--shadow)`): certificate, level, mode, and subject cards.
- **Resume lift** (`box-shadow: 0 8px 20px var(--shadow)`): the solid-green 「接著讀」 card.
- **Segment lift** (`box-shadow: 0 2px 6px var(--shadow)`): the active tab of the segmented certificate switch.
- **Popover** (`box-shadow: 0 12px 32px var(--shadow), 0 2px 6px var(--shadow)`): the drill tools panel and exam map panel.
- **Dialog** (`box-shadow: 0 24px 60px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.12)`): the native confirm dialog over the `backdrop` scrim.
- **Inset hairline** (`box-shadow: inset 0 1px 0 var(--border)`): row and section dividers; `inset 0 -1px 0` under the sticky chip bar.
- **Inset ring** (`box-shadow: inset 0 0 0 1px <state color>`): doubles a 1px border to 2px for selected/correct/wrong/active states without shifting layout.

### Named Rules
**The Flat-Inside Rule.** Lift belongs to the outermost card or a floating layer. Rows, sections, and blocks inside a panel are flat; never nest a shadowed card in a shadowed card.

**The Glass Bar Rule.** Every sticky or fixed bar uses `bar-bg` with a 10px backdrop blur and a 1px hairline toward the content, never a solid fill or a drop shadow.

## Shapes

Gently rounded, never sharp and never blobby. Controls and choices use 8px corners; cards, search field, shortcut tiles, dock buttons, and reader-end actions use 10px; outer panels (node list, resume card, reader scope, reader end, dialog, segmented track) use 12px. Pills (999px) are reserved for chips, badges, the confidence buttons, the read-to-speech button, and progress bars; circles are reserved for choice letters and read-marks. Code figures inside a figure card use 6px.

Borders are always 1px hairlines; emphasis is a color change of that 1px border plus an inset ring, not a thicker or colored side bar. Dashed borders carry a specific meaning: "not yet / not available / a different case" (unanswered exam-map cells, empty drill button, mode note, decision boundary, the off state of the cram toggle, empty reader notice).

Icons are inline SVG at 20px (16px in compact controls), 2px stroke, round caps and joins, `currentColor`.

## Components

### Buttons
Calm and solid; exactly one solid-green button per decision point.
- **Shape:** 8px corners (10px in the study reader and dock); 44px minimum height.
- **Primary:** Ledger Green fill, on-accent text, weight 800, 10px 18px padding. Used for 交卷, 練這一節 N 題, confirm primary, 回成績.
- **Secondary (back, tools, nav):** panel fill, hairline border, green text, weight 700, 8px 14px padding.
- **Quiet (exam 結束):** transparent, muted text; it is deliberately the weakest button because it discards work.
- **Danger:** secondary shape with brick-red text (and border in the dialog).
- **Hover / Focus:** hover only under `@media (hover: hover)`: outlined buttons gain a green border and accent-soft fill; solid buttons darken to Deep Ledger Green. Focus everywhere is a 2px green outline at 2px offset.

### Choice Buttons (signature)
- Full-width rows on panel-raised, hairline border, 8px corners, 14px padding, 1.6 leading, 120ms ease-out color transition (disabled under reduced motion).
- The 28px letter circle is a 1.5px green ring at rest; it fills green with on-accent text when selected or correct and fills brick red when wrong.
- Selected: green border + inset ring + accent-tint wash. Correct: sage border/ring + correct-soft. Wrong: brick border/ring + wrong-soft.
- When a choice is itself code, the circle aligns to the top and the code block fills the row.

### Chips and Badges
- **Topic badge:** panel-alt pill, muted label text, hairline border.
- **Provenance badge:** amber pill (warn-bg / warn-fg / warn-border) for LLM-authored questions; the reader's source label (學習指引整理 / 備考整理) is a borderless panel-alt pill in ink.
- **Section chips:** 40px-tall outlined pills on panel in a horizontal track; the current section fills green. On narrow screens the track scrolls sideways with hidden scrollbar; from 640px it wraps.
- **Filter tabs (drill):** equal-width outlined buttons with tabular counts; active gets green text, green border + inset ring, accent-soft.
- **Confidence buttons:** outlined pills that fill green when chosen.

### Cards / Containers
- **Corner Style:** 10px for cards, 12px for outer panels.
- **Background:** panel; hover (pointer only) accent-soft with a green border.
- **Shadow Strategy:** card lift on top-level choice cards only (see Elevation).
- **Border:** 1px hairline.
- **Internal Padding:** 18px (cards), 16px (exam question cards), 14–16px (explanation and note boxes).
- **Unavailable:** subject cards with no questions drop to 55% opacity with a not-allowed cursor and carry no click attribute.

### Inputs / Fields
- **Search:** full-width, 44px, panel-raised, hairline border, 10px corners, 42px left padding for a muted 20px search icon.
- **Jump-to-number:** 84px wide, tabular figures, 8px corners; focus turns the border green on top of the global focus outline.

### Navigation
- **Topbar:** back button left, h1 or a muted single-line ellipsized breadcrumb, tool menu or timer at the far right.
- **Disclosure menus:** native `details` with a green-text summary styled as a secondary button and a CSS chevron; open state is accent-soft with a green border; the panel floats with popover lift. Closes on outside click or Esc.
- **Exam bar:** sticky glass bar with the answered-count map, quiet quit, and primary submit.
- **Reader dock:** fixed glass bar, grid of prev step, 標記已讀 toggle, primary 練 N 題 (stretching), next step; steps show the neighbour node code unless under 400px.

### Node List and Resume Card (study index)
- One 12px panel per subject; rows are 60px-tall transparent buttons on a `3.6em | 1fr | 24px` grid (green tabular code, title + meta, read-mark ring) separated by inset hairlines. Read rows mute their title and fill the ring green with a check.
- The resume card is the single solid-green block on the index: node code at 80% opacity, card-title size, meta at 85% opacity, a right-aligned go action; it stacks below 520px.
- Segmented certificate switch: panel-alt track with 4px inset; the active tab is panel-raised with segment lift.

### Note Blocks (table, formula, flow)
- **Table:** sits in its own horizontally scrolling wrapper; small text, 1px hairline grid, 6px 10px cells, nowrap; header row accent-soft with green text; first column semibold; caption top-left in ink.
- **Formula:** accent-soft block with an accent-tint border and 8px corners; label semibold, expression in mono green, note muted. Separation is by fill, not by a side stripe.
- **Flow:** a wrapping row of small outlined pills on panel, joined by a muted arrow connector.
- **Code figure:** panel card with hairline border holding a paper-ground `pre` that scrolls horizontally.

### Result Strip
Fifty equal cells (sage / brick / panel-alt) in a 30px band with 2px paper gaps and 6px outer corners, crossed by a 3px ink pass line at the 35th cell; the score above is display type in green (pass) or brick (fail) beside an outlined verdict pill.

### Confirm Dialog
Native `dialog`, max 420px, panel, 12px corners, dialog shadow over the backdrop scrim; full-width wrapping buttons, primary in green, danger in brick.

## Do's and Don'ts

### Do:
- **Do** take every color and font size from the `:root` tokens, and give any new color a dark value in both dark-mode blocks.
- **Do** make every interactive control at least 44px tall (`--tap`); compact secondary chips may go to 40px, no lower.
- **Do** write hover rules only inside the trailing `@media (hover: hover)` block.
- **Do** separate rows and sections with `inset 0 1px 0 var(--border)` hairlines and group rows into one rounded panel.
- **Do** show selection by filling (letter circle, chip, read-mark, map cell) plus a green border with inset ring.
- **Do** set codes, counts, timers, and scores in tabular figures; prefix node titles with the green node code.
- **Do** let wide content (tables, code, chip tracks) scroll inside its own wrapper.
- **Do** use inline SVG icons (2px stroke, `currentColor`) for any new icon.

### Don't:
- **Don't** use a colored side border thicker than 1px as an accent; use a fill, a full hairline border, or an inset hairline instead.
- **Don't** use brick red for warnings or provenance; red is only "wrong answer", failing score, low time, or destructive action.
- **Don't** introduce a second accent hue or a decorative gradient.
- **Don't** nest shadowed cards inside shadowed panels.
- **Don't** shrink h4/h5 below body size.
- **Don't** put more than one solid-green primary action in the same decision area.
- **Don't** let the page scroll horizontally on mobile.
