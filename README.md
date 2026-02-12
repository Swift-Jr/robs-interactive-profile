# Robert Guard - Interactive Profile

A dynamic, single-page professional profile and CV website. Features an AI-powered content manager and an interactive background connection game.

## Getting Started

### 1. Installation
Install the required dependencies using npm:
```bash
npm install
```

### 2. Development
Run the development server with hot module replacement:
```bash
npm run dev
```

### 3. Production Build
Build the project for production. The output will be in the `dist` folder:
```bash
npm run build
```

### 4. Preview
Preview the production build locally:
```bash
npm run preview
```

## Key Features & Shortcuts

- **Admin Editor:** Press `Ctrl + Shift + A` to toggle the AI-powered Content Manager. This allows you to refine your pitch and summaries using Gemini.
- **Interactive Game:** Click and drag between dots on the background to play a connection game. Avoid crossing lines!
- **AI Video Intro:** Generate a cinematic video pitch using Google Veo in the Video Pitch section.
- **Responsive CV:** Fully responsive layout with smooth scroll navigation and categorized filters for professional experience.

## Troubleshooting
If you see an empty page when running the build:
- Verify that `index.html` contains the script tag `<script type="module" src="/index.tsx"></script>`.
- Check your browser console for any failed ESM imports from `esm.sh`.
