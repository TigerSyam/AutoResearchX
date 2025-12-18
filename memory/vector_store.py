from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

class VectorMemory:

    def __init__(self, embedding_model="all-MiniLM-L6-v2"):
        """
        Vector store using FAISS for similarity search.
        """
        self.model = SentenceTransformer(embedding_model)

        # Maintain Python-side metadata
        self.text_chunks = []
        self.urls = []

        # FAISS index (Euclidean / L2 Index)
        self.dimension = self.model.get_sentence_embedding_dimension()
        self.index = faiss.IndexFlatL2(self.dimension)

    def add(self, text: str, url: str):
        """
        Embed text and store in FAISS index.
        """

        embedding = self.model.encode([text])[0]
        vector = np.array([embedding], dtype="float32")

        self.index.add(vector)
        self.text_chunks.append(text)
        self.urls.append(url)

    def clear(self):
        # Reset FAISS index
        self.index.reset()

    # Clear text chunks and URLs
        self.text_chunks = []
        self.urls = []


    def search(self, query: str, top_k: int = 3):
        """
        Vector search → return most relevant text chunks.
        """

        embedding = self.model.encode([query])[0]
        vector = np.array([embedding], dtype="float32")

        distances, indices = self.index.search(vector, top_k)

        results = []
        for idx in indices[0]:
            if idx < len(self.text_chunks):
                results.append({
                    "text": self.text_chunks[idx],
                    "url": self.urls[idx]
                })

        return results
