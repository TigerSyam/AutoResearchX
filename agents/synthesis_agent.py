import os
import requests
from dotenv import load_dotenv

load_dotenv()

PPLX_API_KEY = os.getenv("PPLX_API_KEY")

class SynthesisAgent:

    def __init__(self, model="sonar-pro"):
        """
        Synthesis agent uses Perplexity LLM to create final structured research.
        """
        self.model = model
        self.api_url = "https://api.perplexity.ai/chat/completions"

    def generate_report(self, query: str, retrieved_chunks: list):
        """
        Creates a well-structured detailed research report.
        retrieved_chunks = list of {text, url}
        """

        # Build context
        context_text = ""
        for item in retrieved_chunks:
            context_text += f"Source ({item['url']}):\n{item['text']}\n\n"

        prompt = f"""
User Query: {query}
ACt as a efficient research report generator. Generate a comprehensive research report based on the user query
and the research data provided below.
Your task is to produce a COMPLETE 6-section research report based on the user query
AND the research data provided below.

You MUST use the user's query as the central theme.
Do NOT expand beyond the query.
Do NOT over-explain early sections.
Allocate output space evenly across ALL sections.

=========================
MANDATORY SECTIONS (OUTPUT ALL SIX)
=========================

1. Executive Summary (3–5 sentences MAX)
2. Key Insights (8–12 bullet points MAX)
3. Detailed Explanation (2 short paragraphs MAX)
4. Real-World Applications (4–6 bullets MAX)
5. Current Challenges / Open Problems (4–6 bullets MAX)
6. Sources (ONLY the URLs provided, no numeric citations)

=========================
STRICT RULES
=========================

* You MUST output ALL 6 sections.
* NEVER skip or merge sections.
* NEVER exceed the length limits listed above.
* NEVER produce numeric citations like [1], [2].
* Cite ONLY using URLs in the Sources section.
* If information is missing, write: "Information not available in provided sources."
* DO NOT hallucinate anything not found in the research data.
* Keep the writing concise, factual, and directly relevant to the user query.


=========================
RESEARCH DATA (USE ONLY THIS)
=========================
{context_text}

=========================
FINAL INSTRUCTION
=========================
Produce the final 6-section report NOW. 
Follow the exact order and formatting.
Do NOT add any extra commentary before or after.
"""

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": 
"""You are an advanced research synthesis engine. 
Use ONLY the provided sources. 
Do NOT create numeric citations like [1] or [5]. 
ONLY cite sources using their URLs. 
Do not hallucinate information or citations."""},

                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "max_tokens": 800
        }

        headers = {
            "Authorization": f"Bearer {PPLX_API_KEY}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(self.api_url, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except Exception as e:
            print("Synthesis failed:", e)
            return ""
