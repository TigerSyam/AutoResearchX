# AutoResearchX 🚀  
Autonomous AI Research System

AutoResearchX is a full-stack autonomous AI research system that searches, reads, summarizes, and synthesizes knowledge from the web into structured research reports.

This project is built as a **real engineering system**, not a prompt demo. Every stage of the research lifecycle is explicit, modular, debuggable, and deployable.

🌐 Live Application: https://autoresearchx.netlify.app/

---

## 📌 Problem Statement

Modern research is:
- Fragmented across multiple sources
- Time-consuming and repetitive
- Difficult to reproduce
- Hard to scale systematically

Most AI tools:
- Hide intermediate reasoning
- Do not expose source usage
- Lack memory and structure
- Are not designed as systems

**AutoResearchX solves this** by acting as an autonomous AI researcher that transparently performs multi-step research.

---

## 🎯 What AutoResearchX Does

Given a research query, the system:

1. Discovers relevant sources from the web  
2. Fetches and cleans raw content  
3. Stores semantic knowledge in vector memory  
4. Summarizes large documents safely  
5. Synthesizes a structured research report  

Each step is visible, testable, and extensible.

---

## 🧠 System Architecture (High Level)

User Query  
→ Search Agent  
→ Content Fetch Agent  
→ Vector Memory (FAISS)  
→ Summarization Agent  
→ Synthesis Agent  
→ Final Research Report  

The architecture is intentionally modular to allow debugging, scaling, or replacement of any component.

---

## 🧩 Agent-Based Design

### Search Agent
- Discovers URLs dynamically using DuckDuckGo (ddgs)
- No hardcoded sources
- No paid API dependency

### Fetch Agent
- Downloads webpages
- Extracts clean readable content
- Removes ads, navigation, and noise

### Vector Memory (FAISS)
- Uses Sentence Transformers for embeddings
- Stores semantic representations
- Enables similarity-based retrieval
- Acts as long-term research memory

### Summarization Agent
- Condenses large documents safely
- Prevents token overflow
- Preserves factual grounding

### Synthesis Agent
- Combines summaries
- Produces structured output:
  - Executive Summary
  - Key Insights
  - Applications
  - Challenges

---

## 🖥️ Frontend Experience

The UI is designed as an **experience**, not a form.

Concepts:
- AI Brain Core represents intelligence
- Animated stages reflect research progress
- Progressive report reveal
- Cursor-driven interaction as a “thinking” metaphor

Research States:
- Idle
- Searching
- Reading
- Synthesizing
- Completed

---

## 📂 Project Structure

AutoResearchX/  
├── backend/  
│   ├── main_api.py  
│   ├── agents/  
│   │   ├── search_agent.py  
│   │   ├── fetch_agent.py  
│   │   ├── summarize_agent.py  
│   │   └── synthesize_agent.py  
│   ├── memory/  
│   │   └── vector_store.py  
│   └── utils/  
│  
├── frontend/  
│   ├── src/  
│   │   ├── components/  
│   │   ├── pages/  
│   │   ├── api/  
│   │   ├── App.jsx  
│   │   └── main.jsx  
│   └── index.css  
│  
└── README.md  

---

## 🔌 API Overview

### POST /research

Request:
{
  "query": "quantum computing"
}

Response:
{
  "query": "quantum computing",
  "urls_used": ["..."],
  "report": "Structured research output"
}

---

## 🚀 Deployment

### Backend
- FastAPI
- Deployed on Render
- Environment-aware configuration (local vs production)

### Frontend
- React + Vite
- Deployed on Netlify

Live URL:  
https://autoresearchx.netlify.app/

---

## 🧪 Development Methodology

This project follows a **checkpoint-driven engineering approach**:

- Each step had a clear goal
- No step progressed without validation
- Errors were analyzed deeply
- Fixes were intentional and minimal
- Alternatives were evaluated before decisions

This mirrors real-world production engineering.

---

## 🛠️ Tech Stack

Backend:
- Python
- FastAPI
- FAISS
- Sentence Transformers
- BeautifulSoup
- Requests

Frontend:
- React
- Tailwind CSS
- Framer Motion

Deployment:
- Render
- Netlify

---

## 📚 Skills Demonstrated

- Full-stack system design
- Agent-based AI architecture
- Vector databases and embeddings
- API-first development
- Production debugging
- Environment-aware deployment
- UI as a system metaphor
- Learning-by-doing engineering

---


