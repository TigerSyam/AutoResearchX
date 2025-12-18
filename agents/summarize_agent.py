import os
import requests
from dotenv import load_dotenv

load_dotenv()

PPLX_API_KEY = os.getenv("PPLX_API_KEY")

class SummarizerAgent:

    def __init__(self, model="sonar-pro"):
        """
        SummarizerAgent uses Perplexity LLM models (free or paid).
        """
        self.model = model
        self.api_url = "https://api.perplexity.ai/chat/completions"

    def summarize_chunk(self, text: str) -> str:
        """
        Summarizes a chunk of text using Perplexity LLM.
        """

        if not PPLX_API_KEY:
            raise ValueError("Perplexity API key is missing in .env")

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a world-class research summarizer. Extract only the meaningful, relevant information."},
                {"role": "user", "content": f"Summarize the following text into clear bullet points:\n\n{text}"}
            ],
            "temperature": 0.2
        }

        headers = {
            "Authorization": f"Bearer {PPLX_API_KEY}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(self.api_url, json=payload, headers=headers, timeout=20)
            response.raise_for_status()
            result = response.json()
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            print("Summarization failed:", e)
            return ""
    
    def summarize_text(self, long_text: str, chunk_size: int = 2000):
        """
        Splits long text → summarize each chunk → merge results.
        """

        chunks = []
        words = long_text.split()

        # Create chunks of 2000 words each
        for i in range(0, len(words), chunk_size):
            chunk = " ".join(words[i:i + chunk_size])
            chunks.append(chunk)

        final_summaries = []

        for idx, chunk in enumerate(chunks):
            print(f"[SummarizerAgent] Summarizing chunk {idx+1}/{len(chunks)}...")
            summary = self.summarize_chunk(chunk)

            if summary:
                final_summaries.append(summary)

        return "\n\n".join(final_summaries)
