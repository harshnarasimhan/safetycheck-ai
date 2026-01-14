# rag_service.py
# RAG service for backend integration

import os
from dotenv import load_dotenv
from pinecone.grpc import PineconeGRPC as Pinecone
from sentence_transformers import SentenceTransformer
from typing import List, Dict

load_dotenv()

class RAGService:
    """RAG service for regulatory document retrieval"""
    
    def __init__(self):
        """Initialize RAG service"""
        print("Initializing RAG service...")
        
        # Initialize Pinecone
        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        self.index = pc.Index("safetycheck-regulations-free")
        
        # Load embedding model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        
        print("✅ RAG service initialized")
    
    def search(self, query: str, industry: str = 'healthcare', top_k: int = 5) -> List[Dict]:
        """
        Search for relevant regulations
        
        Args:
            query: Search query
            industry: 'healthcare' or 'finance'
            top_k: Number of results
        
        Returns:
            List of relevant chunks
        """
        # Create query embedding
        query_embedding = self.model.encode([query])[0].tolist()
        
        # Search with industry filter
        results = self.index.query(
            vector=query_embedding,
            top_k=top_k,
            filter={"industry": {"$eq": industry}},
            include_metadata=True
        )
        
        return [
            {
                "text": match['metadata']['text'],
                "source": match['metadata']['source'],
                "score": match['score']
            }
            for match in results['matches']
        ]
    
    def get_context(self, query: str, industry: str = 'healthcare', top_k: int = 3) -> str:
        """
        Get formatted context for RAG
        
        Returns:
            Formatted context string
        """
        results = self.search(query, industry, top_k)
        
        if not results:
            return "No relevant regulatory information found."
        
        context_parts = []
        for i, result in enumerate(results, 1):
            context_parts.append(
                f"[Regulation {i} - {result['source']}]\n{result['text']}"
            )
        
        return "\n\n".join(context_parts)


# Singleton instance
_rag_service = None

def get_rag_service() -> RAGService:
    """Get or create RAG service instance"""
    global _rag_service
    if _rag_service is None:
        _rag_service = RAGService()
    return _rag_service


# Test
if __name__ == "__main__":
    rag = get_rag_service()
    
    # Test search
    results = rag.search("patient privacy requirements", "healthcare", top_k=3)
    
    print("Search results:")
    for i, result in enumerate(results, 1):
        print(f"\n{i}. {result['source']} (score: {result['score']:.2f})")
        print(f"   {result['text'][:200]}...")
    
    # Test context
    print("\n" + "="*70)
    print("Context for test generation:")
    print("="*70)
    context = rag.get_context("medical AI safety requirements", "healthcare")
    print(context)