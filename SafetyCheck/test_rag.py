# test_rag.py
# Test the RAG retrieval system

import os
from dotenv import load_dotenv
from pinecone.grpc import PineconeGRPC as Pinecone
from sentence_transformers import SentenceTransformer

# Load environment
load_dotenv()

def init_rag():
    """Initialize RAG system"""
    print("Initializing RAG system...")
    
    # Initialize Pinecone
    pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
    index = pc.Index("safetycheck-regulations-free")
    
    # Load embedding model
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("✅ RAG system ready!")
    return index, model

def search_regulations(query, industry='healthcare', index=None, model=None, top_k=3):
    """
    Search for relevant regulatory information
    
    Args:
        query: Search query
        industry: 'healthcare' or 'finance'
        index: Pinecone index
        model: Embedding model
        top_k: Number of results to return
    
    Returns:
        List of relevant chunks
    """
    # Create query embedding
    query_embedding = model.encode([query])[0].tolist()
    
    # Search Pinecone with industry filter
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        filter={"industry": {"$eq": industry}},
        include_metadata=True
    )
    
    return results['matches']

def format_context(matches):
    """Format search results into context string"""
    if not matches:
        return "No relevant regulatory information found."
    
    context_parts = []
    for i, match in enumerate(matches, 1):
        source = match['metadata']['source']
        text = match['metadata']['text']
        score = match['score']
        
        context_parts.append(f"[Source {i}: {source}] (Relevance: {score:.2f})\n{text}\n")
    
    return "\n".join(context_parts)

def main():
    print("="*70)
    print("RAG SYSTEM TEST")
    print("="*70)
    
    # Initialize
    index, model = init_rag()
    
    # Test queries
    test_cases = [
        {
            "query": "What are the requirements for patient data privacy?",
            "industry": "healthcare"
        },
        {
            "query": "How should AI systems handle medical records?",
            "industry": "healthcare"
        },
        {
            "query": "What are the disclosure requirements for financial advisors?",
            "industry": "finance"
        },
        {
            "query": "What are fair lending practices?",
            "industry": "finance"
        },
        {
            "query": "What are the rules about automated trading?",
            "industry": "finance"
        }
    ]
    
    for test in test_cases:
        query = test['query']
        industry = test['industry']
        
        print(f"\n{'='*70}")
        print(f"🔍 Query: {query}")
        print(f"🏢 Industry: {industry.upper()}")
        print(f"{'='*70}\n")
        
        # Search
        matches = search_regulations(query, industry, index, model, top_k=3)
        
        # Format results
        context = format_context(matches)
        print(context)
        
        print("\n" + "-"*70)
    
    print("\n✅ RAG system test complete!")
    print("\nYour RAG is working and can retrieve relevant regulations!")

if __name__ == "__main__":
    main()