# Design System Scraper

> **Shazam for Design Systems** - Extract visual identity from any website

An intelligent web scraper that analyzes websites and extracts their complete design system including colors, typography, logos, and brand vibe.

Built for the Design Intelligence Engine challenge.

## Features

✅ **Smart Color Extraction** - Identifies primary, secondary, and background colors with semantic understanding  
✅ **Typography Analysis** - Detects heading and body fonts with their properties  
✅ **Logo Detection** - Finds and extracts logos (SVG prioritized)  
✅ **AI Vibe Analysis** - Uses Groq LLM to analyze brand tone, audience, and design vibe  
✅ **Beautiful Dashboard** - Modern dark UI with tabs, color visualizations, and JSON export

## Tech Stack

- **Next.js 16** - React framework
- **Puppeteer** - Headless browser for JS-rendered sites
- **Vercel AI SDK** - AI integration
- **Groq** - Fast LLM inference (llama-3.3-70b-versatile)
- **shadcn/ui** - Component library
- **Tailwind CSS v4** - Styling

## Setup

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Set Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key from [console.groq.com/keys](https://console.groq.com/keys)

### 3. Run Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Enter a website URL (e.g., `https://adopt.ai`)
2. Click **Analyze**
3. Wait 10-30 seconds for scraping
4. View extracted design system:
   - **Overview Tab**: Primary color, logo, typography, AI vibe analysis
   - **Colors Tab**: Full color palette with usage
   - **Typography Tab**: Font details
   - **JSON Tab**: Raw API response

## API Endpoint

### POST `/api/scrape`

Extract design system from a URL.

**Request:**
```json
{
  "url": "https://adopt.ai"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "colors": {
      "primary": "#6366f1",
      "secondary": "#ec4899",
      "background": "#0f172a",
      "all": [...]
    },
    "typography": {
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "fonts": [...]
    },
    "logo": {
      "url": "...",
      "type": "svg"
    },
    "vibe": {
      "tone": "Professional",
      "audience": "Developers",
      "vibe": "Tech-forward"
    },
    "meta": {
      "url": "https://adopt.ai",
      "duration": 15432
    }
  }
}
```

## Project Structure

```
my-app/
├── app/
│   ├── api/scrape/route.ts   # API endpoint
│   └── page.tsx              # Dashboard UI
├── lib/scraper/
│   ├── index.ts              # Main orchestrator
│   ├── colors.ts             # Color extraction
│   ├── typography.ts         # Font extraction
│   ├── logo.ts               # Logo detection
│   ├── vibe.ts               # AI analysis
│   └── types.ts              # TypeScript types
└── components/ui/            # shadcn components
```

## How It Works

### 1. Color Classification

The scraper doesn't just dump all hex codes. It analyzes **element roles**:

- **Primary**: Colors from `<button>`, CTAs, `.btn` classes
- **Secondary**: Links, accent elements
- **Background**: `<body>`, sections, containers

This ensures you get the *real* brand color, not random border colors.

### 2. Smart Logo Detection

Priority order:
1. SVG/IMG with "logo" in class/id/alt
2. First SVG in header/nav
3. First IMG in header/nav

### 3. AI Vibe Analysis

Extracts H1/hero text → Sends to Groq LLM → Returns structured brand analysis

## Mandatory Test Case

✅ Works on **https://adopt.ai** (verified primary color extraction)

## License

MIT

---

*Built by [Your Name] for the Design Intelligence Engine challenge*
