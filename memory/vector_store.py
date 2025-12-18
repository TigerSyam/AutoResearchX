"""
Vector store using FAISS for similarity search.

Step 17.1B:
- Prevent heavy model loading in production (Render)
- Preserve full research capability locally
"""

from backend.config import IS_PRODUCTION

# Heavy imports (kept for local research mode)
# from sentence_transformers import SentenceTransformer
# import faiss
# import numpy as np

# STEP 17.1C: prevent heavy imports on Render
# - If APP_MODE=production, we don't import torch/sentence-transformers/faiss at all.
# - This keeps memory usage low on Render free tier (512MB).
if not IS_PRODUCTION:
    from sentence_transformers import SentenceTransformer
    import faiss
    import numpy as np
else:
    SentenceTransformer = None
    faiss = None
    np = None


class VectorMemory:
    def __init__(self, embedding_model="all-MiniLM-L6-v2"):
        """
        Vector store using FAISS for similarity search.
        """

        # ==============================
        # STEP 17.1B: PRODUCTION GUARD
        # ==============================
        if IS_PRODUCTION:
            # In production we DISABLE vector memory safely
            # (no embeddings, no FAISS, no crash)
            self.model = None
            self.index = None
            self.dimension = None
            self.text_chunks = []
            self.urls = []
            return

        # ===== RESEARCH MODE (LOCAL) =====
        # Full power preserved
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

        # Production-safe no-op
        if self.model is None or self.index is None:
            return

        embedding = self.model.encode([text])[0]
        vector = np.array([embedding], dtype="float32")

        self.index.add(vector)
        self.text_chunks.append(text)
        self.urls.append(url)

    def clear(self):
        """
        Reset FAISS index and metadata.
        """

        if self.index is not None:
            self.index.reset()

        self.text_chunks = []
        self.urls = []

    def search(self, query: str, top_k: int = 3):
        """
        Vector search → return most relevant text chunks.
        """

        # Production-safe fallback
        if self.model is None or self.index is None:
            return []

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
