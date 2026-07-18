# MindClash

Pit AI personalities against each other in chaotic, unfiltered debates. Chat one-on-one or set two characters loose on a topic and watch them tear each other apart.

## Features

- **Chat mode** -- talk to any character in a private conversation
- **Debate mode** -- pick two characters, give them a topic, and let them argue it out over 3 rounds
- **10 characters** -- from Socrates to Karen, Shakespeare to Bangalore Bro, each with a custom system prompt and distinct voice
- **Neo-brutalist UI** -- white canvas, thick black borders, hard offset shadows, flat color tints, mono typography
- **Custom avatars** -- each character has a hand-cropped 256x256 portrait

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS 3
- **Routing**: react-router-dom
- **Animation**: GSAP (title shuffle), Three.js (pixel snow background)
- **Backend**: Netlify Functions (Node.js)
- **AI**: Google Gemini 2.5 Flash API

## Setup

```bash
# install dependencies
npm install

# set your Gemini API key
cp .env.example .env
# edit .env and add: GEMINI_API_KEY=your_key_here

# run locally
npm run dev
```

For the Netlify Functions to work locally, install the Netlify CLI and run:

```bash
netlify dev
```

## Characters

| ID | Name | Archetype |
|----|------|-----------|
| socrates | Socrates | Historical |
| shakespeare | William Shakespeare | Historical |
| ramsay | Gordon Ramsay | Celebrity |
| elon | Elon Musk | Celebrity |
| intern | Overly Enthusiastic Intern | Archetype |
| butcher | Billy Butcher | Fictional |
| trump | Donald Trump | Parody |
| bangalore | Bangalore Bro | Archetype |
| luffy | Monkey D. Luffy | Fictional |
| karen | Karen | Archetype |

## Deploy

Push to your Git repo and connect to Netlify. Set `GEMINI_API_KEY` in the Netlify environment variables. The `public/_redirects` file handles SPA client-side routing.
