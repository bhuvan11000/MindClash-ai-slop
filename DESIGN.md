# MindClash — Design Update v2

These are precise code changes to apply to the existing codebase. Follow each change exactly as described. Do NOT add anything extra, do NOT rearrange code that isn't mentioned, and do NOT touch files that aren't listed.

---

## Change 1: Clean up the Home Page (src/pages/HomePage.jsx)

### 1A. Remove the "Powered by Gemini" badge

Find this entire block (lines 28-30) and DELETE it completely:

```jsx
          <div className="inline-flex items-center px-5 py-2 rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-sm text-[11px] uppercase tracking-[0.12em] text-white/60 mb-8">
            Powered by Gemini
          </div>
```

Delete those 3 lines. Do not replace them with anything.

### 1B. Remove the tagline

Find this block (lines 36-38) and DELETE it completely:

```jsx
          <p className="text-lg text-[#a0a0b0] mt-4 max-w-md mx-auto">
            Pick a personality. Start a conversation. Regret nothing.
          </p>
```

Delete those 3 lines. Do not replace them with anything.

After 1A and 1B, the hero section should only contain the h1 "MindClash" title. Nothing else.

### 1C. Remove the footer

Find this block (lines 63-65) and DELETE it completely:

```jsx
      <footer className="text-center text-[#606070] text-[13px] pb-12">
        Built for fun. Powered by Gemini. No managers were harmed.
      </footer>
```

Delete those 3 lines. Do not replace them with anything.

---

## Change 2: Chat Header — make it more prominent (src/components/ChatInterface.jsx)

Find the current chat header (the div that starts with `className="h-[72px]`). Replace the ENTIRE header div (from the opening `<div className="h-[72px]` to its closing `</div>` that contains the green dot) with this:

```jsx
      <div className="flex-shrink-0 bg-[#0f0f14] shadow-sm z-10">
        <div className="flex items-center px-6 py-5 gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
            style={{ background: character.theme.cardColor }}
          >
            <span className="text-white text-lg font-bold">{character.avatarInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <p className="font-heading font-semibold text-lg text-white">{character.name}</p>
              <span
                className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                style={{
                  background: character.theme.accentColorMuted,
                  color: character.theme.accentColor,
                }}
              >
                {character.category}
              </span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
            </div>
            <p className="text-[13px] text-[#707080] mt-0.5 truncate">{character.tagline}</p>
          </div>
        </div>
      </div>
```

Key differences from the old header:
- No fixed height. Uses `py-5` padding instead, making it naturally taller (~90px)
- Avatar is bigger: `w-14 h-14 rounded-2xl` with `shadow-lg` (was w-10 h-10)
- Name is larger: `text-lg` (was text-base)
- Green dot is inline next to the name, not floating on the right edge
- Tagline text is slightly lighter: `#707080` (was #606070)
- More horizontal padding: `gap-4` between avatar and text (was gap-3)

---

## Change 3: Empty state — use character's tagline (src/components/ChatInterface.jsx)

Find the empty state block. It currently looks like this:

```jsx
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: character.theme.cardColor }}
            >
              <span className="text-white text-2xl font-bold">{character.avatarInitials}</span>
            </div>
            <p className="text-[#a0a0b0] text-base mt-4">
              Start a conversation with {character.name}
            </p>
            <p className="text-[#606070] text-[13px] mt-1">
              Say hello, ask a question, or just vibe.
            </p>
```

Replace it with this (everything from the opening `<div className="flex-1 flex flex-col items-center justify-center">` to the `<p>` tags, but NOT the conversation starters section below):

```jsx
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: character.theme.cardColor }}
            >
              <span className="text-white text-2xl font-bold">{character.avatarInitials}</span>
            </div>
            <p className="text-[#808090] text-[15px] mt-5 italic max-w-sm text-center">
              "{character.tagline}"
            </p>
```

Key differences:
- Removed the generic "Start a conversation with..." text
- Removed the "Say hello, ask a question, or just vibe." text
- Instead shows the character's own tagline in quotes, italic, centered
- Avatar gets `shadow-lg`
- Slightly more margin-top (`mt-5` instead of `mt-4`)

Keep the conversation starters section (`{starters.length > 0 && (...)}`) exactly as it is. Do not change it.

---

## Change 4: Remove the "+" button from input bar (src/components/ChatInterface.jsx)

Find this entire block inside the input wrapper div and DELETE it:

```jsx
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 text-[#606070] text-lg leading-none">
            +
          </div>
```

Delete those 3 lines. Do not replace them with anything.

Then update the input wrapper div's classes. Find:

```
className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-3 pr-2 py-3 transition-all duration-200"
```

Replace with (only the `pl-3` changes to `pl-5`):

```
className="flex items-center gap-3 bg-white/[0.06] border border-white/[0.08] rounded-2xl pl-5 pr-2 py-3 transition-all duration-200"
```

---

## Change 5: Character message bubbles — add accent tint (src/components/MessageBubble.jsx)

The current character bubble uses flat `bg-[#141418]`. We want to add a subtle tint of the character's accent color to make each character's messages feel distinct.

Find the current bubble div. It contains this className logic:

```jsx
          className={`px-5 py-3.5 text-sm text-[#f0f0f2] leading-relaxed shadow-md shadow-black/20 ${
            isUser
              ? 'bg-[#1a1a22] border border-white/[0.06] rounded-[16px_2px_16px_16px]'
              : 'bg-[#141418] border border-white/[0.05] rounded-[2px_16px_16px_16px]'
          }`}
          style={
            !isUser
              ? { borderLeft: `2px solid ${character.theme.accentColor}4d` }
              : undefined
          }
```

Replace the ENTIRE className and style attributes with:

```jsx
          className={`px-5 py-3.5 text-sm text-[#f0f0f2] leading-relaxed ${
            isUser
              ? 'bg-[#1a1a22] border border-white/[0.06] rounded-[16px_2px_16px_16px] shadow-md shadow-black/20'
              : 'rounded-[2px_16px_16px_16px] shadow-lg shadow-black/30'
          }`}
          style={
            !isUser
              ? {
                  background: `linear-gradient(135deg, ${character.theme.accentColor}0a 0%, ${character.theme.accentColor}03 100%)`,
                  border: `1px solid ${character.theme.accentColor}15`,
                  borderLeft: `2px solid ${character.theme.accentColor}40`,
                }
              : undefined
          }
```

What changed for character (non-user) bubbles:
- Background is now a very subtle gradient using the accent color at ~4% opacity (`0a` hex = ~4%) fading to ~1% (`03` hex), instead of flat `#141418`
- Border uses accent color at ~8% opacity (`15` hex) instead of flat `white/[0.05]`
- Left border accent stays but slightly stronger: `40` instead of `4d`
- Shadow is upgraded to `shadow-lg shadow-black/30` for more depth
- User bubbles stay exactly the same

---

## Change 6: Sidebar visual differentiation (src/components/ChatSidebar.jsx)

Make the sidebar feel more recessed/secondary compared to the chat panel.

Find the aside element's className:

```
className="w-[280px] flex-shrink-0 h-full bg-[#0f0f14] rounded-2xl overflow-hidden shadow-lg shadow-black/20 flex flex-col"
```

Replace with:

```
className="w-[280px] flex-shrink-0 h-full bg-[#0b0b10] rounded-2xl overflow-hidden shadow-lg shadow-black/20 flex flex-col"
```

The only change is `bg-[#0f0f14]` becomes `bg-[#0b0b10]` — slightly darker, making it visually recede behind the chat panel which is `#0a0a10` with the ambient glow on top. The sidebar reads as the "background" layer and the chat panel reads as "foreground".

Also update the avatar ring selected state. Find:

```jsx
                    ...(isSelected ? { boxShadow: `0 0 0 2px #0f0f14, 0 0 0 4px ${character.theme.accentColor}` } : {}),
```

Replace with (update the ring offset color to match the new background):

```jsx
                    ...(isSelected ? { boxShadow: `0 0 0 2px #0b0b10, 0 0 0 4px ${character.theme.accentColor}` } : {}),
```

---

## Change 7: Ambient glow originates from behind the header (src/components/ChatInterface.jsx)

Currently the ambient glow is positioned at `70% 15%` (top-right area). We want it to feel like it emanates from behind the chat header, casting a soft colored light downward into the messages area.

This change is in characters.json. For EVERY character, update the `ambientGlow` value. Change the ellipse position from `70% 15%` to `50% -5%` and increase the size slightly. Here are the exact new values:

```
socrates:   "radial-gradient(ellipse at 50% -5%, rgba(201, 168, 76, 0.10) 0%, transparent 60%)"
shakespeare: "radial-gradient(ellipse at 50% -5%, rgba(196, 77, 123, 0.10) 0%, transparent 60%)"
ramsay:     "radial-gradient(ellipse at 50% -5%, rgba(224, 85, 64, 0.10) 0%, transparent 60%)"
elon:       "radial-gradient(ellipse at 50% -5%, rgba(56, 189, 248, 0.10) 0%, transparent 60%)"
intern:     "radial-gradient(ellipse at 50% -5%, rgba(245, 158, 11, 0.10) 0%, transparent 60%)"
butcher:    "radial-gradient(ellipse at 50% -5%, rgba(185, 28, 28, 0.10) 0%, transparent 60%)"
trump:      "radial-gradient(ellipse at 50% -5%, rgba(201, 168, 76, 0.10) 0%, transparent 60%)"
bangalore:  "radial-gradient(ellipse at 50% -5%, rgba(249, 115, 22, 0.10) 0%, transparent 60%)"
luffy:      "radial-gradient(ellipse at 50% -5%, rgba(239, 68, 68, 0.10) 0%, transparent 60%)"
karen:      "radial-gradient(ellipse at 50% -5%, rgba(244, 114, 182, 0.10) 0%, transparent 60%)"
```

Changes from old values:
- Position: `70% 15%` → `50% -5%` (centered horizontally, origin above the top edge)
- Opacity: `0.08` → `0.10` (slightly stronger since it's further away)
- Spread: `55%` → `60%` (larger to cover more of the messages area)

---

## Summary of files to modify

| File | What to change |
|---|---|
| `src/pages/HomePage.jsx` | Delete "Powered by Gemini" badge (3 lines), delete tagline (3 lines), delete footer (3 lines) |
| `src/components/ChatInterface.jsx` | Replace chat header with bigger version, update empty state text, delete "+" button, update input wrapper padding |
| `src/components/MessageBubble.jsx` | Replace character bubble background/border/shadow with accent-tinted version |
| `src/components/ChatSidebar.jsx` | Change background from `#0f0f14` to `#0b0b10`, update ring offset color |
| `src/data/characters.json` | Update `ambientGlow` value for all 10 characters |

## Files NOT to touch

- `src/components/LightRays.jsx` and `LightRays.css`
- `src/components/BorderGlow.jsx` and `BorderGlow.css`
- `src/components/TiltedCard.jsx` and `TiltedCard.css`
- `src/components/Header.jsx`
- `src/App.jsx`
- `src/main.jsx`
- `src/index.css`
- `netlify/functions/chat.js`
- `src/components/CharacterCard.jsx`
- `src/pages/ChatPage.jsx`
