# 🛸 SwarmStudio — Multi-Agent AI Creative Collaboration Platform

> **Transform a simple user idea into a complete production-ready creative project through a collaborative swarm of specialized AI agents.**

---

## 🌟 Overview & Problem Statement
Creative professionals, indie filmmakers, game developers, podcasters, and narrative designers face a common barrier: turning a high-concept premise into a full creative project requires distinct disciplines:
- World-builders & lore researchers
- Screenwriters & dialogue specialists
- Visual art directors & concept prompt engineers
- Sound designers & audio supervisors
- Script doctors & continuity critics

Existing generative AI tools operate in isolation with fragmented contexts. **SwarmStudio** solves this through a multi-agent orchestration architecture powered by **CrewAI**, running with local **Ollama** LLM inference and a responsive **React + TypeScript + Tailwind CSS** workspace.

---

## 🤖 The 5 Specialized Agents

```
                           ┌───────────────────────────────┐
                           │      User Creative Idea       │
                           │   (Film / Game / Podcast)     │
                           └───────────────┬───────────────┘
                                           │
                                           ▼
                           ┌───────────────────────────────┐
                           │      Studio Orchestrator      │
                           └───────────────┬───────────────┘
                                           │
                                           ▼
 ┌─────────────────────────────────────────────────────────────────────────────────┐
 │                                   AGENT SWARM                                   │
 │                                                                                 │
 │   🧠 Research Agent     -->   ✍️ Story Agent     -->   🎨 Visual & 🎵 Audio     │
 │   • World Lore & Rules        • Logline & Synopsis       • Art Direction        │
 │   • Character Dossiers        • 3-Act Structure          • Color Palette        │
 │   • Scientific Backdrop       • Screenplay & Scenes      • Midjourney Prompts   │
 │                                                          • Score & SFX Cues     │
 │                                                                                 │
 │                                           │                                     │
 │                                           ▼                                     │
 │                                   ⚖️ Critic Agent                                │
 │                                   • Quality Score (0-100)                       │
 │                                   • Continuity Audit                            │
 │                                   • Editorial Revisions                         │
 └───────────────────────────────────────────┬─────────────────────────────────────┘
                                             │
                                             ▼
                           ┌───────────────────────────────┐
                           │   Interactive Studio Suite    │
                           │   • Human-in-the-Loop Edit    │
                           │   • Section Regeneration      │
                           │   • PDF & Markdown Export     │
                           └───────────────────────────────┘
```

| Agent | Core Responsibility | Key Deliverables |
| :--- | :--- | :--- |
| **🧠 Research Agent** | World-Building & Lore Researcher | Universe laws, technological/magical systems, cultural backdrop, multi-dimensional character profiles (Archetype, Personality, Appearance, Background, Motivation, Arc). |
| **✍️ Story Agent** | Lead Screenwriter & Narrative Architect | High-concept logline, dramatic synopsis, 3-act narrative progression, screenplay excerpt with dialogue, chronological scene breakdown. |
| **🎨 Visual Agent** | Art Director & Concept Artist | Grand aesthetic vision, 5-color production palette with hex codes, lighting setup, cinematography framing notes, production-ready AI image prompts (Midjourney/Flux). |
| **🎵 Audio Agent** | Sound Designer & Music Supervisor | Holistic soundtrack direction, tempo and instrumentation, thematic score tracks, categorized SFX cues (Ambient, Foley, Action, Stinger), voice delivery notes. |
| **⚖️ Critic Agent** | Lead Editorial & Continuity Critic | Multi-department continuity audit, overall creative index (0–100), key strengths, identified inconsistencies, and prioritized revision recommendations. |

---

## 🚀 Key Features

### 1. Modern Creative Workspace & Dark Theme SaaS
- Deep charcoal/black surfaces (`#090D16`, `#0F1626`, `#131B2E`) with glowing violet/purple accents (`#8B5CF6`, `#A855F7`).
- Glassmorphic panels, responsive layouts, Lucide icons, and typography with Plus Jakarta Sans and JetBrains Mono.

### 2. Multi-Department Workspace Tabs
- **Concept & Overview**: Official logline banner, synopsis, and 3-act progression.
- **World Lore & Characters**: World laws, environmental lore, and detailed character cards.
- **Screenplay & Scene Breakdown**: Chronological scene cards with inline editing for dialogue and action lines.
- **Visual Art Direction**: 5-color swatch palette with click-to-copy hex codes and image generation prompts.
- **Audio & Sound Atmosphere**: Score direction, soundtrack tracklist, and categorized SFX cue tables.
- **Critic Audit & Review**: Quality score card, continuity status, and editorial endorsements.

### 3. Human-in-the-Loop & Section Regeneration
- Creatives can edit any generated scene directly in the workspace.
- **Regenerate Section**: Refine any specific department (Story, Research, Visuals, Audio, or Critic) with custom user guidance without starting over.

### 4. Real-Time Activity Monitoring
- Live execution feed with real-time status chips (`Waiting`, `Running`, `Completed`).
- Dependency flowchart visualization.
- Telemetry streaming over WebSockets with automatic fallback polling.

### 5. Dual-Tier Persistence
- **Local SQLite Engine**: Automatically persists projects and activity history with zero setup required.
- **Supabase Cloud Sync**: Connect your Supabase project in the Settings tab to replicate projects and outputs.

### 6. Multi-Format Export
- **Clean PDF**: Formatted production document with typography, headers, scene treatments, and critic review.
- **Markdown (.md)**: Full script package ready for production bibles, pitch decks, or Notion/GitHub.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React |
| **Backend** | Python 3.12, FastAPI, Uvicorn, WebSockets, ReportLab, Pydantic v2 |
| **Multi-Agent Engine**| CrewAI Orchestration Pipeline |
| **Local AI Inference**| Ollama (`llama3.2`, `mistral`, `gemma2`, `phi3`) + Resilient Smart Creative Engine |
| **Storage** | SQLite + Supabase PostgreSQL |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.12 recommended)
- **Ollama** (optional for local LLM inference)

### One-Click Launch (Windows)
Double-click `start.bat` or run:
```powershell
.\start.ps1
```

### Manual Launch

#### 1. Backend Server
```powershell
cd backend
.\venv\Scripts\python.exe run.py
```
*API will run at `http://127.0.0.1:8000` (Interactive docs at `http://127.0.0.1:8000/docs`).*

#### 2. Frontend Application
```powershell
cd frontend
npm run dev
```
*Frontend will run at `http://localhost:5173`.*

---

## 🦙 Ollama Local LLM Setup

To run local open-weight language models with zero API fees:
1. Download Ollama from [ollama.com](https://ollama.com).
2. Pull and start your preferred model:
   ```bash
   ollama run llama3.2
   ```
3. In SwarmStudio, open **Settings**, verify the connection, and select your active model.

> **Note on Resilient Fallback:** SwarmStudio includes an intelligent local creative generation engine that seamlessly handles offline states or network isolation so demonstrations and workflows never crash.

---

## 🗄️ Supabase Cloud Database Setup (Optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run:
   ```sql
   CREATE TABLE IF NOT EXISTS projects (
       id TEXT PRIMARY KEY,
       title TEXT,
       project_type TEXT,
       status TEXT,
       progress INTEGER,
       created_at TEXT,
       updated_at TEXT,
       data JSONB
   );

   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Allow public read/write" ON projects FOR ALL USING (true) WITH CHECK (true);
   ```
3. Enter your Supabase Project URL and Anon Key in **Settings** within SwarmStudio.

---

## 🏆 Hackathon Presentation Highlights
- **Real-Time Agent Collaboration**: Watch 5 autonomous agents research, write, visualize, score, and critique a project in real time.
- **Cross-Medium Flexibility**: Generates tailored deliverables whether the format is a Film, Video Game narrative, or Serialized Podcast.
- **Human In The Loop**: Demonstrate on-the-fly regeneration of individual sections with custom director notes.
- **Local AI Privacy**: Powered by local Ollama models with no data sent to external cloud LLM APIs.
- **Instant Production Export**: One-click export to formatted PDF or Markdown production bibles.
