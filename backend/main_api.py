from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.research_agent import ResearchAgent
from agents.summarize_agent import SummarizerAgent
from agents.synthesis_agent import SynthesisAgent
from memory.vector_store import VectorMemory
#from duckduckgo_search import DDGS
import uvicorn
from ddgs import DDGS


# ----- Pydantic Request Model -----
class ResearchRequest(BaseModel):
    query: str
    urls: list[str] = []
    use_dynamic_search: bool = True

# ----- FastAPI App Setup -----
app = FastAPI(title="AutoResearchX API")

# ----- CORS Middleware -----
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Agents -----
research_agent = ResearchAgent()
summarizer_agent = SummarizerAgent()
synthesis_agent = SynthesisAgent()
memory = VectorMemory()

# ----- URL Search Agent -----
"""
def simple_search(query: str, max_urls: int = 3):
    urls = []
    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=max_urls):
                if "href" in r:
                    urls.append(r["href"])
    except:
        pass
    return urls
"""
def simple_search(query: str, max_urls: int = 3):
    urls = []
    try:
        with DDGS() as ddgs:
            results = ddgs.text(query, max_results=max_urls)
            for r in results:
                if "href" in r:
                    urls.append(r["href"])
    except Exception as e:
        print("[API] Error during DDG search:", e)

    # Fallback if no URLs found
    if len(urls) == 0:
        print("[API] DDG search returned no URLs — using fallback.")
        urls = [
            f"https://en.wikipedia.org/wiki/{query.replace(' ', '_')}",
            f"https://www.ibm.com/topics/{query.replace(' ', '-')}",
            f"https://www.britannica.com/search?query={query.replace(' ', '%20')}"
        ]

    return urls[:max_urls]






# ----- Health Check -----
@app.get("/health")
async def health():
    return {"status": "ok", "message": "Backend running"}

# ----- Main Research Endpoint -----
@app.post("/research")
async def run_research(req: ResearchRequest):

    print("[API] Starting research pipeline...")

    # Step 1 — Determine URLs
    print("[API] Step 1 — Searching URLs")
    urls = req.urls or []
    if req.use_dynamic_search and len(urls) == 0:
        urls = simple_search(req.query)
        #if len(urls) == 0:
            #raise HTTPException(400, "No URLs found for query.")
        if len(urls) == 0:
            print("[API] WARNING: No URLs found even after fallback.")


    # Step 2 — Fetch content
    print("[API] Step 2 — Fetching content")
    raw_data = research_agent.run(urls)
    if not raw_data:
        raise HTTPException(400, "Failed to fetch valid content.")

    # Step 3 — Summaries & Memory
    print("[API] Step 3 — Summarizing content")
    memory.clear()
    for item in raw_data:
        summary = summarizer_agent.summarize_text(item["text"])
        memory.add(summary, item["url"])

    # Step 4 — Retrieve relevant memory
    print("[API] Step 4 — Retrieving memory")
    retrieved = memory.search(req.query, top_k=3)

    # Step 5 — Synthesis
    print("[API] Step 5 — Generating final report")
    report = synthesis_agent.generate_report(req.query, retrieved)

    print("[API] Completed.")
    
    return {
        "query": req.query,
        "urls_used": urls,
        "report": report
    }

# ----- Run Server -----
if __name__ == "__main__":
    uvicorn.run("main_api:app", host="127.0.0.1", port=8000, reload=True)
