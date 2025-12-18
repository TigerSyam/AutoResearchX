from agents.research_agent import ResearchAgent
from agents.summarize_agent import SummarizerAgent
from agents.synthesis_agent import SynthesisAgent
from memory.vector_store import VectorMemory

class AutoResearchX:

    def __init__(self):
        self.research_agent = ResearchAgent()
        self.summarizer_agent = SummarizerAgent()
        self.memory = VectorMemory()
        self.synthesis_agent = SynthesisAgent()

    def run(self, query: str, urls: list):
        """
        Full pipeline:
        1. Fetch & clean website text
        2. Summarize content using LLM
        3. Store summaries to vector memory
        4. Retrieve relevant chunks
        5. Generate final structured research report
        """

        print("\n=== STEP 1: Fetching Research Content ===")
        research_data = self.research_agent.run(urls)

        if not research_data:
            print("No valid content fetched.")
            return None

        print("\n=== STEP 2: Summarizing Content ===")
        all_summaries = []
        for item in research_data:
            summary = self.summarizer_agent.summarize_text(item["text"])
            all_summaries.append({
                "url": item["url"],
                "summary": summary
            })

        print("\n=== STEP 3: Storing in Vector Memory ===")
        for item in all_summaries:
            self.memory.add(item["summary"], item["url"])

        print("\n=== STEP 4: Retrieving Knowledge for Synthesis ===")
        retrieved = self.memory.search(query, top_k=3)

        print("\n=== STEP 5: Generating Final Report ===")
        final_report = self.synthesis_agent.generate_report(query, retrieved)

        return final_report


if __name__ == "__main__":
    # Example test
    system = AutoResearchX()

    query = "Explain the basics of quantum computing."

    urls = [
        "https://www.ibm.com/topics/quantum-computing",
        "https://en.wikipedia.org/wiki/Quantum_computing"
    ]

    output = system.run(query, urls)

    print("\n\n====== FINAL REPORT ======\n")
    print(output)
