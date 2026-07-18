# DESIGN.md — MindClash Neo-Brutalist Redesign

> Project: MindClash (chat with AI personalities — Socrates, Ramsay, Elon, Luffy, etc.)
> Stack: React 18 + Vite + Tailwind CSS v3 + `motion` + `three` (see UI_CONTEXT.md for full inventory)
> This is a **visual/CSS pass only**. Do not touch chat logic, Gemini/Netlify function calls,
> routing, or the character data structure's meaning — only its styling values.
> Background rule: **the app is mostly white.** Color shows up in accents, borders, character
> theming, and a few loud blocks — not as a wash across the whole page.

---

## 0. Direction

MindClash is already fun and a little unserious — parody personalities, joke typing indicators,
a "your question is so raw it's still mooing" tagline. Keep that comedic energy. What's changing
is the *visual language*: swap the current soft/frosted/rounded look (glassmorphism header,
soft shadows, gradient vignettes, spring-bounce everything) for a raw, high-contrast,
thick-bordered, hard-shadowed neo-brutalist system on a white canvas.

Think: a zine, a punk flyer, a Gumroad-era brutalist landing page — not a SaaS dashboard.

**Banned from here on:**
- `backdrop-blur-*`, frosted/glass panels (`Header.jsx` currently uses this — remove it).
- `rounded-full` / `rounded-2xl` / `rounded-xl` as defaults — border-radius is basically 0 now
  (see §2 for the one deliberate exception).
- Soft, blurred `box-shadow` (e.g. `rgba(0,0,0,0.08)` diffuse shadows) — replace with hard offset
  shadows, no blur, ever.
- Gray "neutral" fills as panel backgrounds (`#f5f5f5` sidebar, `#fafafa` chat bg) — replace with
  white + thick black dividers instead of a gray wash.
- Soft radial-gradient vignettes on cards (`CharacterCard.jsx`'s dark overlay) — replace with a
  flat color block + hard border.

**Kept / bent on purpose (this is a "fun" brand, not austere brutalism):**
- The `Bangers` display font and `Fredoka` body font stay — they already read as loud and playful,
  which fits. Just push their sizing further (bigger, punchier) rather than replacing them.
- Bouncy/spring motion is allowed **only** on small playful accents (typing indicator, online dot,
  card-enter stagger) — not on shadows or borders, which stay hard-edged and snap instantly.
  This is a deliberate deviation from strict brutalist motion rules, to preserve MindClash's
  comedic tone.
- Per-character accent theming (from `theme` in `characters.json`) stays as the core personalization
  mechanic — it's just re-expressed as flat colors + hard shadows instead of gradients + glow.

---

## 1. Color System

Global tokens (add to `src/index.css` as CSS custom properties, or a Tailwind theme extension):

```css
--color-bg:        #FFFFFF;  /* page background — stays white, almost everywhere */
--color-bg-off:     #F7F5EF; /* rare use: a large section that needs to be *not quite* white */
--color-ink:        #1c1c1a; /* already your text-primary — reuse as the universal border/shadow color */
--color-ink-muted:  #6a6a60; /* already your text-muted — keep for secondary text only, never borders */
--color-primary:    #FF3B30; /* new: hot red, main CTA / brand accent */
--color-secondary:  #2B4EFF; /* new: electric blue, links / secondary actions */
--color-yellow:     #FFD400; /* new: tags, highlights, the online-dot alternative */
--color-success:    #00C853; /* keep for the online pulse dot */
```

Rules:
- **Page background is `--color-bg` (white) on both routes**, full stop. `HomePage.jsx` and
  `ChatPage.jsx` no longer use gray panel fills — white plus 2–3px ink borders/dividers does the
  separating instead.
- `ChatSidebar.jsx`'s `#f5f5f5` background → white, with a `border-r-[3px] border-[--color-ink]`
  separating it from the chat panel, and a `border-b-[2px]` divider between every character row.
- `ChatInterface.jsx`'s `#fafafa` chat background → white. Keep the per-character `ambientGlow`
  concept but convert it from a soft radial gradient to a **flat, very-low-opacity solid tint**
  (e.g. `background: color-mix(in srgb, var(--character-accent) 4%, white)`), so the character
  still colors the room without producing a soft blurry glow.
- Each character's `accentColor` (from `characters.json` → `theme.accentColor`) remains the single
  accent used for: their sidebar selection state, their message bubble border/shadow, and their
  chat header underline — same mechanic as before, but **update the actual values** to the palette
  below. These were chosen to be louder, more saturated, and more tied to each character's
  personality than the current set, while staying distinct from each other.
- `cardColor` / `cardGradient` on `CharacterCard.jsx` → flatten to a single solid `cardColor`
  fill (drop the gradient + dark vignette overlay). Use each character's new `accentColor` (or a
  darkened version of it, see below) as the flat card fill, and add the hard shadow in the same
  color for extra punch.

### 1.1 Character Accent Palette (replace existing `theme.accentColor` values)

| Character (`id`) | `accentColor` | `shadowColor` (for hard shadows — use where the raw accent is too light to read against white) |
|---|---|---|
| `socrates` | `#6C2BD9` — Royal Violet | `#6C2BD9` (already dark enough) |
| `shakespeare` | `#D6284A` — Curtain Crimson | `#D6284A` (already dark enough) |
| `ramsay` | `#FF5A1F` — Flame Orange | `#C43F0F` |
| `elon` | `#00C2FF` — Rocket Cyan | `#0089B3` |
| `intern` | `#FFD400` — Anxious Yellow | `#B38F00` |
| `butcher` | `#FF2D6B` — Blood Magenta | `#C4104A` |
| `trump` | `#F5A623` — Bombast Gold | `#B87A0F` |
| `bangalore` | `#39D353` — Tactical Lime | `#1F9C3A` |
| `luffy` | `#E3342F` — Straw Hat Red | `#B01F1B` |
| `karen` | `#FF6EC7` — Suburban Pink | `#D63FA0` |

Notes:
- `accentColor` is used for borders, message-bubble text/background tint, and small UI accents.
- `shadowColor` is used specifically as the color inside `--shadow-sm` / `--shadow-md` on that
  character's card and message bubbles, so hard shadows stay legible on white instead of
  disappearing or looking washed out for the lighter hues (yellow, lime, cyan).
- Update `theme.accentColor` in `characters.json` to these values, and add a new `theme.shadowColor`
  field alongside it (see §6 — this makes the optional field from that section concrete rather
  than "add if needed").
- `accentColorMuted` (used for the low-opacity tints in §1 background rules) should be regenerated
  from the *new* `accentColor` at ~10-15% opacity, not left as the old muted values.

---

## 2. Borders, Shadows & Shape

```css
--shadow-sm: 3px 3px 0 var(--color-ink);
--shadow-md: 5px 5px 0 var(--color-ink);
--shadow-lg: 8px 8px 0 var(--color-ink);
```

- Default border everywhere interactive: `border-[3px] border-[--color-ink]` — cards, buttons,
  the sidebar, the input bar, modals (there aren't any yet, but future ones follow this).
- **Border-radius:** `0` by default. The one exception: avatar badges (currently
  `avatarInitials` squares) can either stay hard squares (preferred, more brutalist) or become
  true circles — pick one and apply it consistently across `Header.jsx`, `CharacterCard.jsx`,
  and `ChatSidebar.jsx`. Do not mix square avatars in one place and round in another.
- Message bubble radii: replace the current asymmetric soft radii
  (`rounded-[16px_2px_16px_16px]` / `rounded-[2px_16px_16px_16px]`) with a much sharper asymmetric
  cut — e.g. `rounded-[2px_2px_2px_18px]` for AI and `rounded-[2px_2px_18px_2px]` for user — keep
  *one* corner deliberately big as a "tail," square off the rest. This preserves the existing
  "who's talking" visual cue while reading as brutalist rather than soft-chat-app.
- Replace every soft `box-shadow` (headers, sidebar, chat panel, bubbles — the
  `rgba(0,0,0,0.08)` / `black/10` / `black/[0.06]` family) with `--shadow-sm` or `--shadow-md`.
- Hover: element translates `-2px, -2px` and shadow grows one step (`sm → md`, `md → lg`).
- Active/press: element translates `+3px, +3px`, shadow drops to none. Apply this to
  `CharacterCard.jsx`, the header's "Start Chatting" button, and the chat send button.

```css
.btn, .card, .chat-input {
  border: 3px solid var(--color-ink);
  border-radius: 0;
  box-shadow: var(--shadow-sm);
  transition: transform 100ms ease, box-shadow 100ms ease;
}
.btn:hover, .card:hover { transform: translate(-2px, -2px); box-shadow: var(--shadow-md); }
.btn:active, .card:active { transform: translate(3px, 3px); box-shadow: none; }
```

---

## 3. Typography

- Keep `Bangers` for display (site title, character names, chat header name) and `Fredoka` for
  body — they're already loud/rounded/playful, which suits the brand. Push the display scale
  bigger than current: the "MindClash" wordmark and character names in the chat header should
  feel oversized, not dainty.
- Add one monospace font (`"JetBrains Mono"` or `"IBM Plex Mono"`) for all metadata: timestamps,
  category/subcategory labels, the tagline-as-quote in the chat empty state, and conversation
  starter pill labels. Uppercase + slightly letter-spaced. This is new — currently everything uses
  `Fredoka`, which makes labels and real body text look the same weight; the mono font gives
  brutalism its "technical label" feel and creates a clear type hierarchy.
- No more than these three fonts total (Bangers / Fredoka / mono). Don't add a fourth.

---

## 4. Layout

- `Header.jsx`: currently a floating frosted pill (`rounded-full`, `bg-white/80 backdrop-blur-xl`).
  Replace with a solid white, full-width bar with a `border-b-[3px] border-[--color-ink]` — no
  floating, no blur, no pill shape. The "Start Chatting" button keeps its dark fill but becomes
  square-cornered with `--shadow-sm` and the hover/press treatment from §2.
- `HomePage.jsx` character grid: keep the 5-column responsive grid, but let card sizes/heights
  vary slightly by category if you want asymmetry (e.g. a couple of cards taller than the rest) —
  not required, but on-brand if it's low-effort to do with the existing grid.
- `ChatPage.jsx`: sidebar and chat panel are separated by a hard `border-r-[3px]`, not a shadow or
  gray-fill contrast. Same border weight as the header's bottom border, for visual consistency.

---

## 5. Component-by-Component Instructions

### `Header.jsx`
- Remove `bg-white/80 backdrop-blur-xl`, `rounded-full`, and the floating/pill shadow.
- New: `bg-white border-b-[3px] border-[--color-ink]`, full width, no rounding.
- "Start Chatting" button: square corners, `--shadow-sm`, hover/press per §2.

### `CharacterCard.jsx`
- Drop `cardGradient` + dark vignette gradient overlay → flat `cardColor` background.
- `border-2 border-black/10` → `border-[3px] border-[--color-ink]`.
- Add `--shadow-md` at rest (colored in that character's `accentColor` for extra personality, or
  plain ink — pick one approach and apply to all 10 cards).
- Avatar initials badge: keep top-right placement, square it off, ink border.
- Name (Bangers, white) stays; category/subcategory + tagline switch to the new mono font,
  uppercase, small, as described in §3.

### `TiltedCard.jsx`
- Keep the 3D tilt — it's a nice tactile effect and doesn't conflict with brutalism. Two changes:
  1. Reduce `damping`/increase `stiffness` slightly so the tilt feels snappier and less "floaty"
     (e.g. damping ~20, stiffness ~350) — brutalist motion is quick, not languid.
  2. Make sure whatever shadow is applied during tilt is the hard offset shadow from §2, not a
     soft blurred one — if `TiltedCard` currently adds its own shadow layer, replace it.

### `PixelSnow.jsx`
- This effect is a good brutalist fit conceptually (raw, pixelated, digital) — keep it, but tone
  it down so the page still reads as white:
  - Reduce density/opacity so it's a subtle texture, not a blue wash.
  - Consider recoloring from `#2249e0` to `--color-ink` (near-black) or `--color-primary` (red) at
    low opacity, so it reads as a subtle "static/grain" accent on a white page rather than a
    colored background layer.
  - Keep the existing `IntersectionObserver` pause-when-offscreen behavior as-is.

### `ChatSidebar.jsx`
- `#f5f5f5` background → white.
- Add a `border-r-[3px] border-[--color-ink]` on the whole sidebar, and a `border-b-[2px]
  border-[--color-ink]/20`-style divider between each character row (full ink, not faded, if you
  want max brutalism — your call on divider weight, but keep it a real border, not a shadow).
- Selected row: replace the muted-accent-bg + inset-ring + box-shadow-ring combo with a **solid
  flat block** of that character's `accentColor` behind the row, plus the row's left border
  thickened to `4px` in ink. Drop the soft ring/shadow entirely.
- Unselected hover: no fade/opacity trick — swap to a 1-step background tint or just thicken the
  border on hover, something binary/obvious rather than subtle.

### `ChatInterface.jsx`
- Background: white, with the `ambientGlow` converted to a flat low-opacity tint per §1 (not a
  radial gradient blur).
- Keep the noise SVG overlay if you like the texture — it's compatible with brutalism (adds
  "raw" grain) as long as it stays subtle.
- Empty-state conversation starter pills: mono font, uppercase, square corners, `--shadow-sm`,
  press effect on click — currently these are presumably rounded/soft; square them off.
- Chat header row (avatar, name, category badge, green pulse dot, tagline): give the whole row a
  `border-b-[3px]` instead of a soft shadow to separate it from the message list.
- Typing indicator: this is a great place to keep the "fun" bounce — instead of 3 soft fading
  dots, use 3 small **square** blocks in the active character's `accentColor` that bounce with the
  existing `bounce-dot` keyframe. Same animation, blockier shape.
- Online pulse dot: keep the bounce/pulse animation (it's a nice playful touch and doesn't fight
  brutalism at this small scale) but square it off instead of a circle, matching the avatar-badge
  decision from §2.

### `MessageBubble.jsx`
- User bubble: `#f0f0f0` → white with `border-[3px] border-[--color-ink]` and the new sharp
  asymmetric radius from §2. Add `--shadow-sm` in ink.
- AI bubble: replace the gradient-tinted background with a flat, very-light tint of the
  character's `accentColor` (a few % mix with white — same technique as `ambientGlow`), a thick
  `border-[3px]` in that character's `accentColor` (not ink — this is the one place a colored
  border instead of ink makes sense, since it reinforces character identity), and `--shadow-sm`
  in that same accent color.
- Timestamps: switch to the mono font, small, uppercase-ish ("JUST NOW"), sitting just outside
  the bubble rather than blending into it.
- Avatar-on-message (the "U" badge / character initials): match whatever square-vs-circle
  decision was made for avatars elsewhere.

---

## 6. Data Model Notes (`src/data/characters.json`)

`theme.accentColor` is doing exactly the job a brutalist redesign needs (one identity color per
character) — it's just getting new values (§1.1) plus one new sibling field:
- Update `theme.accentColor` for all 10 characters to the values in §1.1.
- Add `theme.shadowColor` per character using the values in §1.1 — this is the color used inside
  `--shadow-sm`/`--shadow-md` on that character's card and bubbles, so lighter accents (yellow,
  lime, cyan) still produce a legible hard shadow against white instead of washing out.
- Regenerate `accentColorMuted` from the new `accentColor` (see §1.1 notes) rather than reusing
  the old muted values, which were tuned for the old, less saturated palette.
- `cardGradient` and `gradientColors` become unused once cards are flattened to `cardColor` (§1/§5)
  — fine to leave them in the JSON unused rather than deleting, in case you want them back later.

---

## 7. Motion

- Keep existing keyframes (`card-enter`, `message-in`, `bounce-dot`, `pulse-dot`) — they already
  suit the fun tone. No need to replace them with linear/snap-only motion.
- New rule for anything §2 touches (borders/shadows on hover/press): those transitions are fast
  (80–150ms) and linear/ease-out, not spring/bounce — that's the brutalist "snap" feel.
- Keep spring/bounce reserved for: card tilt (`TiltedCard`), typing indicator, online dot,
  card-enter stagger. Don't spread bounce into buttons or borders.

---

## 8. Accessibility

- Check contrast for every character's `accentColor` against both white and `--color-ink` text —
  a couple of the lighter accent colors (check `karen`, `intern` if they're pastel) may need a
  darkened variant for text-on-accent use, even if the raw accent color is fine as a border/shadow.
- Thick borders help here, not hurt — keep visible `:focus-visible` states using the same ink
  offset-shadow style, don't strip outlines without replacing them.
- Don't rely on `accentColor` alone to distinguish characters in the sidebar — name + avatar
  already do this, just make sure it still holds once color usage changes.

---

## 9. Implementation Checklist

- [ ] Add color tokens (§1) and shadow tokens (§2) to `src/index.css` or Tailwind theme config.
- [ ] Add the mono font import + a `font-mono`-equivalent utility for metadata/labels.
- [ ] `Header.jsx`: remove glass/blur/pill, add solid bar + bottom border.
- [ ] `CharacterCard.jsx`: flatten gradient → solid `cardColor`, thicken border, add hard shadow.
- [ ] `TiltedCard.jsx`: snappier spring constants, hard-edged shadow during tilt.
- [ ] `PixelSnow.jsx`: reduce density/opacity, recolor to sit on top of white instead of washing it.
- [ ] `ChatSidebar.jsx`: white bg, hard row dividers, flat-color selected state.
- [ ] `ChatInterface.jsx`: white bg, flattened ambient tint, square starter pills, blocky typing dots.
- [ ] `MessageBubble.jsx`: sharper asymmetric radii, thick accent/ink borders, hard shadows.
- [ ] Sweep for remaining `rounded-full` / `rounded-2xl` / `rounded-xl` / soft `box-shadow` /
      `backdrop-blur` usages across all files and replace per the rules above.
- [ ] Verify contrast per §8 for all 10 characters' accent colors.
