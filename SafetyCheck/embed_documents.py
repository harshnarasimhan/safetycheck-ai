# embed_documents.py - FREE VERSION (No OpenAI needed!)
# Uses sentence-transformers (runs locally)

import json
import os
from dotenv import load_dotenv
from pinecone.grpc import PineconeGRPC as Pinecone
from pinecone import ServerlessSpec
from sentence_transformers import SentenceTransformer
import time
from tqdm import tqdm

# Load environment variables
load_dotenv()

def init_pinecone():
    """Initialize Pinecone client"""
    api_key = os.getenv("PINECONE_API_KEY")
    
    if not api_key:
        raise ValueError("PINECONE_API_KEY not found in .env file")
    
    pc = Pinecone(api_key=api_key)
    return pc

def create_index_if_not_exists(pc, index_name="safetycheck-regulations-free"):
    """Create Pinecone index if it doesn't exist"""
    
    # Check if index exists
    existing_indexes = pc.list_indexes()
    index_names = [idx['name'] for idx in existing_indexes]
    
    if index_name not in index_names:
        print(f"Creating index: {index_name}")
        pc.create_index(
            name=index_name,
            dimension=384,  # sentence-transformers dimension (not 1536!)
            metric='cosine',
            spec=ServerlessSpec(
                cloud='aws',
                region='us-east-1'  # Change to your region
            )
        )
        # Wait for index to be ready
        print("Waiting for index to be ready...")
        time.sleep(10)
    else:
        print(f"Index {index_name} already exists")
    
    return pc.Index(index_name)

def upload_to_pinecone(chunks, index, batch_size=100):
    """Upload chunks with embeddings to Pinecone"""
    
    print(f"\n🚀 Uploading {len(chunks)} chunks to Pinecone...")
    
    # Load FREE embedding model (runs on your computer)
    print("Loading embedding model (first time may take a minute)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')  # Fast and free!
    print("✅ Model loaded")
    
    # Process in batches
    total_uploaded = 0
    
    for i in tqdm(range(0, len(chunks), batch_size), desc="Uploading batches"):
        batch = chunks[i:i+batch_size]
        
        # Extract texts
        texts = [chunk['text'] for chunk in batch]
        
        # Create embeddings (FREE - runs locally!)
        embeddings = model.encode(texts, show_progress_bar=False)
        embeddings = embeddings.tolist()  # Convert to list
        
        # Prepare vectors for Pinecone
        vectors = []
        for j, (chunk, embedding) in enumerate(zip(batch, embeddings)):
            vector_id = f"{chunk['metadata']['industry']}-{chunk['metadata']['source']}-{chunk['metadata']['chunk_id']}"
            
            vectors.append({
                "id": vector_id,
                "values": embedding,
                "metadata": {
                    "text": chunk['text'][:1000],  # Pinecone metadata limit
                    "source": chunk['metadata']['source'],
                    "industry": chunk['metadata']['industry'],
                    "chunk_id": chunk['metadata']['chunk_id']
                }
            })
        
        # Upload to Pinecone
        try:
            index.upsert(vectors=vectors)
            total_uploaded += len(vectors)
        except Exception as e:
            print(f"Error uploading batch: {e}")
        
        # Rate limiting
        time.sleep(0.5)
    
    print(f"\n✅ Uploaded {total_uploaded} vectors successfully!")
    return total_uploaded

def main():
    print("="*70)
    print("EMBEDDING & UPLOAD TO PINECONE (FREE VERSION)")
    print("="*70)
    
    # Load processed chunks
    print("\n📂 Loading processed chunks...")
    with open('processed_chunks.json', 'r', encoding='utf-8') as f:
        chunks = json.load(f)
    
    print(f"   Loaded {len(chunks)} chunks")
    
    # Initialize Pinecone
    print("\n🔌 Connecting to Pinecone...")
    pc = init_pinecone()
    
    # Create/get index
    index = create_index_if_not_exists(pc)
    
    # Get current stats
    stats = index.describe_index_stats()
    print(f"\n📊 Current index stats:")
    print(f"   Total vectors: {stats['total_vector_count']}")
    
    # Ask user if they want to continue
    if stats['total_vector_count'] > 0:
        response = input(f"\n⚠️  Index already has {stats['total_vector_count']} vectors. Continue? (y/n): ")
        if response.lower() != 'y':
            print("Aborting.")
            return
    
    # Upload chunks
    total = upload_to_pinecone(chunks, index)
    
    # Final stats
    time.sleep(2)  # Wait for stats to update
    final_stats = index.describe_index_stats()
    
    print("\n" + "="*70)
    print("UPLOAD COMPLETE!")
    print("="*70)
    print(f"Total vectors in index: {final_stats['total_vector_count']}")
    print(f"Newly uploaded: {total}")
    
    print("\n✅ Your RAG database is ready!")
    print("Next: Test retrieval with test_rag.py")
    
    print("\n💰 COST: $0 (Used free local embeddings!)")

if __name__ == "__main__":
    main()