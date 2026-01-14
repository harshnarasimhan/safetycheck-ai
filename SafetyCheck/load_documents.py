# load_documents.py
# Load and process regulatory PDFs

import os
from pathlib import Path
from pypdf import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import json

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF file"""
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        print(f"Error reading {pdf_path}: {e}")
        return None

def chunk_text(text, chunk_size=1000, chunk_overlap=200):
    """Split text into chunks"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    chunks = text_splitter.split_text(text)
    return chunks

def process_documents(docs_dir="regulatory_docs"):
    """Process all PDFs in directory structure"""
    
    all_chunks = []
    
    docs_path = Path(docs_dir)
    
    # Process healthcare docs
    healthcare_dir = docs_path / "healthcare"
    if healthcare_dir.exists():
        print("\n📂 Processing Healthcare documents...")
        for pdf_file in healthcare_dir.glob("*.pdf"):
            print(f"  Reading: {pdf_file.name}")
            text = extract_text_from_pdf(pdf_file)
            if text:
                chunks = chunk_text(text)
                for i, chunk in enumerate(chunks):
                    all_chunks.append({
                        "text": chunk,
                        "metadata": {
                            "source": pdf_file.name,
                            "industry": "healthcare",
                            "chunk_id": i,
                            "total_chunks": len(chunks)
                        }
                    })
                print(f"    ✅ {len(chunks)} chunks created")
    
    # Process finance docs
    finance_dir = docs_path / "finance"
    if finance_dir.exists():
        print("\n📂 Processing Finance documents...")
        for pdf_file in finance_dir.glob("*.pdf"):
            print(f"  Reading: {pdf_file.name}")
            text = extract_text_from_pdf(pdf_file)
            if text:
                chunks = chunk_text(text)
                for i, chunk in enumerate(chunks):
                    all_chunks.append({
                        "text": chunk,
                        "metadata": {
                            "source": pdf_file.name,
                            "industry": "finance",
                            "chunk_id": i,
                            "total_chunks": len(chunks)
                        }
                    })
                print(f"    ✅ {len(chunks)} chunks created")
    
    return all_chunks

def main():
    print("="*70)
    print("REGULATORY DOCUMENT PROCESSING")
    print("="*70)
    
    # Process all documents
    chunks = process_documents()
    
    if not chunks:
        print("\n❌ No documents found!")
        print("Make sure PDFs are in:")
        print("  - regulatory_docs/healthcare/")
        print("  - regulatory_docs/finance/")
        return
    
    # Save to JSON for inspection
    with open('processed_chunks.json', 'w', encoding='utf-8') as f:
        json.dump(chunks, indent=2, fp=f)
    
    print(f"\n📊 SUMMARY:")
    print(f"   Total chunks: {len(chunks)}")
    
    # Count by industry
    healthcare_count = sum(1 for c in chunks if c['metadata']['industry'] == 'healthcare')
    finance_count = sum(1 for c in chunks if c['metadata']['industry'] == 'finance')
    
    print(f"   Healthcare: {healthcare_count}")
    print(f"   Finance: {finance_count}")
    
    print(f"\n💾 Saved to: processed_chunks.json")
    print("\n✅ Document processing complete!")
    print("Next: Run embed_documents.py to create embeddings")

if __name__ == "__main__":
    main()