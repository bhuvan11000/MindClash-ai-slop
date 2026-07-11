# MindClash — Design Guide

## Overview

MindClash is a fun AI character chat platform. Users pick from 10 characters and have conversations powered by the Gemini API. Each character has a unique visual identity with a bold, full-bleed gradient palette.

This document defines every visual detail needed to implement the UI.

---

## Design Philosophy

- **Lovable.dev-inspired**: Bold, vivid gradient backgrounds made of large diffused radial color blobs blending into each other (like watercolor). NOT subtle dark-mode accents — these are LOUD, beautiful, full-page gradients.
- **Dark UI elements on vivid backgrounds**: Cards, panels, chat bubbles, and input bars use dark semi-transparent backgrounds (like `rgba(0,0,0,0.6)` with backdrop-blur) sitting on top of the colorful gradients.
- **Desktop-first**: Optimized for 1280px+ screens. Mobile is a nice-to-have, not a priority.
- **No emojis anywhere in the UI**: Use text initials or styled placeholder circles for avatars.
- **Premium feel**: Smooth transitions, micro-animations, clean typography, generous whitespace.

---

## Tech Stack

- **React 18** with **Vite**
- **Tailwind CSS v3** (NOT v4)
- **React Router v6** for navigation (2 pages: `/` and `/chat`)
- **Netlify Functions** for Gemini API proxy
- **Google Fonts**: `Plus Jakarta Sans` (body) + `Space Grotesk` (headings)

---

## Typography

| Usage | Font | Weight | Size |
|---|---|---|---|
| Page title (h1) | Space Grotesk | 800 | 48-64px |
| Section headings | Space Grotesk | 700 | 24-28px |
| Character name (card) | Space Grotesk | 700 | 18px |
| Character name (sidebar) | Plus Jakarta Sans | 600 | 14px |
| Body text | Plus Jakarta Sans | 400 | 14-15px |
| Taglines | Plus Jakarta Sans | 400 italic | 13-14px |
| Category labels | Plus Jakarta Sans | 600 | 11px, uppercase, letter-spacing 0.06em |
| Chat messages | Plus Jakarta Sans | 400 | 14px |
| Input placeholder | Plus Jakarta Sans | 400 | 14px |

Import in `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
```

---

## Color System

### Base / Neutral Palette (used for home page background, sidebar, dark UI elements)

| Token | Value | Usage |
|---|---|---|
| `bg-primary` | `#08080c` | Main page background |
| `bg-secondary` | `#0f0f14` | Sidebar background |
| `bg-tertiary` | `#16161e` | Elevated surfaces |
| `bg-card` | `rgba(0, 0, 0, 0.5)` | Dark cards on gradient backgrounds |
| `bg-card-blur` | Use `backdrop-filter: blur(20px)` | Applied to all dark panels on gradients |
| `text-primary` | `#f0f0f2` | Main text |
| `text-secondary` | `#a0a0b0` | Secondary/muted text |
| `text-muted` | `#606070` | Placeholder text, timestamps |
| `border-subtle` | `rgba(255, 255, 255, 0.06)` | Default borders |
| `border-hover` | `rgba(255, 255, 255, 0.12)` | Hover state borders |
| `accent` | `hsl(260, 80%, 65%)` | Main page accent (purple) |

### Per-Character Themes

Every character has a unique gradient palette. These gradients are used as:
1. **Card backgrounds** on the home page (the `cardGradient` value)
2. **Chat area backgrounds** when that character is selected (the `gradientCSS` value — this is the big, vivid, Lovable-style gradient)
3. **Accent colors** for message bubbles, borders, active states

All character theme data is stored in `characters.json`. Each character has:
- `cardGradient`: A `linear-gradient` used as the card background on the home page
- `gradientCSS`: A multi-stop `radial-gradient` + `linear-gradient` layered together for the chat background (this creates the Lovable-style watercolor blob effect)
- `accentColor`: A single hex color for accents (buttons, active borders, highlights)
- `accentColorMuted`: A low-opacity version of the accent for subtle highlights
- `bubbleBackground`: Semi-transparent background for the character's chat bubbles
- `bubbleBorder`: Semi-transparent border for the character's chat bubbles

---

## Layout

### Global

- Max content width: `1400px`, centered
- The app has 2 routes: `/` (Home) and `/chat` (Chat)

---

### Page 1: Home Page (`/`)

Structure (top to bottom):

#### 1. Header Bar
- Height: `64px`
- Background: `bg-primary` with `border-bottom: 1px solid border-subtle`
- Left: App logo/name "MindClash" in Space Grotesk 700, 20px
- Right: Two links — "About" (text link) and "Start Chatting" (pill button with accent background, links to `/chat`)
- Sticky at top (`position: sticky; top: 0; z-index: 50`)

#### 2. Hero Section
- Padding: `80px 0 48px`
- Centered text
- Badge pill at top: "Powered by Gemini" — small uppercase text in a pill with accent border
- Title: "MindClash" in Space Grotesk 800, clamp(40px, 6vw, 64px), gradient text fill (white to light gray shimmer)
- Subtitle: "Pick a personality. Start a conversation. Regret nothing." in Plus Jakarta Sans 400, 18-20px, text-secondary color
- No background gradient on the hero — keep it dark so the character cards below pop

#### 3. Character Grid
- CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(340px, 1fr))`
- Gap: `24px`
- Each card (see Character Card Component below)

#### 4. CTA Section
- Centered below the grid
- Padding: `48px 0`
- Large pill button: "Start Chatting" with accent gradient background
- Size: padding `16px 48px`, font-size 16px, border-radius 9999px
- Hover: slight scale up, glow shadow

#### 5. Footer
- Centered text, text-muted, 13px
- "Built for fun. Powered by Gemini. No managers were harmed."

---

### Character Card Component (Home Page)

- Border-radius: `20px`
- Overflow: `hidden`
- Height: approximately `180-200px`
- Background: the character's `cardGradient` value (the vivid linear-gradient)
- A dark overlay on the bottom half: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)` — this ensures text readability
- Content is positioned at the bottom-left over the dark overlay:
  - Character name in white, Space Grotesk 700, 18px
  - Category: "Historical · Philosophy" in white/80% opacity, 11px uppercase
  - Tagline: italic, 13px, white/70% opacity
- Top-right corner: Avatar circle — 48px, bg `rgba(0,0,0,0.4)` with `backdrop-filter: blur(8px)`, border `1px solid rgba(255,255,255,0.15)`, centered text showing the character's 2-letter initials in white 16px font-weight 700
- Hover effects:
  - `transform: translateY(-4px)` with `transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1)`
  - Box shadow: `0 8px 40px rgba(charAccentColor, 0.3)`
  - Slight brightness increase on the gradient
- Stagger animation on page load: each card fades in from below with increasing delay (`animation-delay: index * 0.05s`)
- Click: navigates to `/chat` with the character pre-selected

---

### Page 2: Chat Page (`/chat`)

This page uses a **Telegram Desktop-style split layout**:

```
┌──────────────────────────────────────────────────┐
│ Header Bar (same as home page)                   │
├────────────────┬─────────────────────────────────┤
│                │                                 │
│   Character    │        Chat Interface           │
│   Sidebar      │                                 │
│   (280px)      │   (remaining width)             │
│                │                                 │
│                │                                 │
│                │                                 │
│                │                                 │
│                │                                 │
└────────────────┴─────────────────────────────────┘
```

Full viewport height: `calc(100vh - 64px)` (below the 64px header)

---

#### Chat Sidebar (Left Panel)

- Width: `280px`, fixed
- Background: `bg-secondary` (#0f0f14)
- Border-right: `1px solid border-subtle`
- Full height of the chat area
- Contains a vertically scrollable list of all 10 characters

**Sidebar Character Item:**
- Height: `64px`
- Padding: `12px 16px`
- Display: flex, align-items center, gap 12px
- Avatar circle: 40px, background is the character's `cardGradient`, centered 2-letter initials in white, 13px, font-weight 700, border-radius 10px
- Text area:
  - Name: Plus Jakarta Sans 600, 14px, text-primary
  - Tagline (truncated to 1 line with ellipsis): 12px, text-muted
- Hover: `background: rgba(255, 255, 255, 0.04)`
- **Selected state**: `background: accentColorMuted` of the selected character, left border `3px solid accentColor`
- Transition: `background 200ms ease`

---

#### Chat Interface (Right Panel)

The right panel has 3 sections stacked vertically:

##### A. Chat Header
- Height: `64px`
- Background: `rgba(0, 0, 0, 0.4)` with `backdrop-filter: blur(20px)`
- Border-bottom: `1px solid rgba(255, 255, 255, 0.06)`
- Contents: Avatar (36px, rounded, character gradient), Name (Space Grotesk 600, 16px), Category text below (11px, character accent color, uppercase)
- Right side: Online status dot (8px circle, green `#22c55e`, pulsing animation)

##### B. Messages Area
- **Background: the selected character's `gradientCSS` value** — this is the big vivid Lovable-style gradient
- The gradient should fill the entire messages area
- On top of the gradient, add a subtle noise texture overlay (optional, very low opacity ~2-3%)
- Overflow-y: scroll, padding: 24px
- Scrollbar: thin (6px), thumb is `rgba(255,255,255,0.1)`, track transparent
- **When switching characters, the background gradient should transition smoothly** (use CSS transition on background or cross-fade)

**Empty state** (when no character is selected OR no messages yet):
- Centered in the messages area
- Character initials in a large circle (80px), their gradient background
- "Start a conversation with [Name]" in text-secondary, 16px
- A subtle prompt like "Say hello, ask a question, or just vibe." in text-muted, 13px

**Message Bubbles:**

Character messages (left-aligned):
- Max-width: `70%`
- Display: flex, gap 10px
- Small avatar circle (28px) on the left
- Bubble: `background: rgba(0, 0, 0, 0.5)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.08)`, border-radius `2px 16px 16px 16px` (sharp top-left corner)
- Text: 14px, text-primary, line-height 1.6
- Padding: `12px 16px`

User messages (right-aligned):
- Max-width: `70%`, align-self: flex-end
- Bubble: `background: rgba(255, 255, 255, 0.1)`, `backdrop-filter: blur(12px)`, `border: 1px solid rgba(255,255,255,0.12)`, border-radius `16px 2px 16px 16px` (sharp top-right corner)
- Text: 14px, text-primary, line-height 1.6
- Padding: `12px 16px`

**Loading/Thinking Indicator:**
- Shown while waiting for Gemini API response
- Below the user's message, left-aligned
- Small avatar (28px) + text: "[Character name] is typing..." in text-muted, italic, 13px
- Three dots animation (bouncing dots with staggered delays)

##### C. Input Bar
- Height: ~`64px`
- Background: `rgba(0, 0, 0, 0.5)` with `backdrop-filter: blur(20px)`
- Border-top: `1px solid rgba(255, 255, 255, 0.06)`
- Padding: `12px 16px`
- Input wrapper: flex row, `background: rgba(255, 255, 255, 0.06)`, border `1px solid rgba(255,255,255,0.08)`, border-radius `9999px`, padding `8px 8px 8px 20px`
- Text input: flex-grow, transparent background, no border, text-primary, 14px, placeholder text-muted
- Send button: 36px circle, background is the character's `accentColor`, white arrow-up icon or "Send" text, border-radius 9999px
- Focus state: input wrapper border becomes `accentColor` with a glow `box-shadow: 0 0 0 3px accentColorMuted`
- Send button hover: slight scale (1.05), box-shadow glow

---

## Component States & Interactions

### Transitions
- Default transition: `all 300ms cubic-bezier(0.16, 1, 0.3, 1)` (ease-out)
- Fast transitions (hover states): `150ms`
- Slow transitions (page/background changes): `500ms`

### Loading States
- While Gemini API responds: Show the typing indicator with bouncing dots
- If API errors: Show a subtle error banner in the chat area with a "Retry" button

### Animations
- **Page load**: Character cards stagger fade-in from below (delay: `index * 50ms`)
- **Chat message appear**: Slide in from below with fade (300ms)
- **Character switch**: Chat background gradient cross-fades (500ms)
- **Typing dots**: 3 dots bouncing with staggered animation-delay (0ms, 150ms, 300ms)
- **Hero title**: Subtle gradient shimmer animation (background-position keyframes, 6s loop)

---

## Responsive Behavior (Optional/Low Priority)

Since this is desktop-first:
- Below `1024px`: Sidebar collapses to icon-only (40px width, just avatars)
- Below `768px`: Sidebar becomes a horizontal scrollable strip at the top, chat goes full-width
- Home page grid: 3 cols > 2 cols > 1 col based on viewport

---

## File Structure

```
mindclash/
├── public/
│   └── _redirects           # Netlify SPA redirect: /* /index.html 200
├── src/
│   ├── data/
│   │   └── characters.json  # All character data (provided separately)
│   ├── components/
│   │   ├── Header.jsx       # Shared header bar
│   │   ├── CharacterCard.jsx # Home page card component
│   │   ├── ChatSidebar.jsx  # Left sidebar with character list
│   │   ├── ChatInterface.jsx # Right panel (messages + input)
│   │   └── MessageBubble.jsx # Individual message component
│   ├── pages/
│   │   ├── HomePage.jsx     # Route: /
│   │   └── ChatPage.jsx     # Route: /chat (contains sidebar + chat)
│   ├── App.jsx              # Router setup
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles, font import, Tailwind directives
├── netlify/
│   └── functions/
│       └── chat.js          # Serverless function: proxies to Gemini API
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
├── netlify.toml
└── .env                     # GEMINI_API_KEY (not committed)
```

---

## Netlify Configuration

### `netlify.toml`
```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variable
Set `GEMINI_API_KEY` in Netlify dashboard (Site settings > Environment variables).

### Netlify Function (`netlify/functions/chat.js`)
- Receives POST with `{ characterId, messages }` (messages is the conversation history)
- Looks up the character's `systemPrompt` from the character data
- Calls Gemini API: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- Returns the response text
- Uses `node-fetch` or the built-in `fetch`

---

## Gemini API Integration Details

### Request Format
```javascript
const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    })
  }
);
const data = await response.json();
const reply = data.candidates[0].content.parts[0].text;
```

### Frontend Chat State
```javascript
// Per-character message history
const [conversations, setConversations] = useState({});
// conversations = { "ramsay": [{role: "user", content: "..."}, {role: "model", content: "..."}], ... }
```

---

## Character-Specific Typing Indicator Text

| Character | Typing Text |
|---|---|
| Socrates | Socrates is formulating a question... |
| Shakespeare | Shakespeare is composing a verse... |
| Gordon Ramsay | Gordon is judging your life choices... |
| Elon Musk | Elon is calculating from first principles... |
| Intern | The intern is typing REALLY fast... |
| Billy Butcher | Butcher is thinking of something diabolical... |
| Donald Trump | Trump is crafting the best response ever... |
| Bangalore Bro | Bangalore Bro is stuck in Silk Board traffic... |
| Luffy | Luffy is thinking (this might take a while)... |
| Karen | Karen is asking for the manager... |
