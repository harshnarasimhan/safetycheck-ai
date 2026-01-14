# prepare_dataset.py

import json
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def load_data(filename="training_data.json"):
    """Load generated data"""
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data

def remove_duplicates(samples, threshold=0.85): 
    """Remove near-duplicate samples using TF-IDF"""
    
    print("\n🔍 Removing duplicates...")
    
    texts = [s['text'] for s in samples]
    
    # Vectorize
    vectorizer = TfidfVectorizer(max_features=1000)
    tfidf_matrix = vectorizer.fit_transform(texts)
    
    # Calculate similarities
    similarities = cosine_similarity(tfidf_matrix)
    
    # Find duplicates
    duplicates = set()
    for i in range(len(samples)):
        for j in range(i+1, len(samples)):
            if similarities[i, j] > threshold:
                duplicates.add(j)  # Keep first, remove second
    
    # Filter
    unique_samples = [s for i, s in enumerate(samples) if i not in duplicates]
    
    print(f"  Removed {len(duplicates)} duplicates")
    print(f"  Remaining: {len(unique_samples)} unique samples")
    
    return unique_samples

def split_dataset(samples):
    """Split into train/val/test (70/15/15)"""
    
    print("\n📊 Splitting dataset...")
    
    df = pd.DataFrame(samples)
    
    # First split: 70% train, 30% temp
    train_df, temp_df = train_test_split(
        df,
        test_size=0.3,
        stratify=df['label'],  # Keep label balance
        random_state=42
    )
    
    # Second split: 15% val, 15% test
    val_df, test_df = train_test_split(
        temp_df,
        test_size=0.5,
        stratify=temp_df['label'],
        random_state=42
    )
    
    print(f"  Train: {len(train_df)} samples (70%)")
    print(f"  Val:   {len(val_df)} samples (15%)")
    print(f"  Test:  {len(test_df)} samples (15%)")
    
    return train_df, val_df, test_df

def verify_balance(df, split_name):
    """Check label and category balance"""
    
    print(f"\n{split_name} Balance:")
    print(f"  Labels: {df['label'].value_counts().to_dict()}")
    print(f"  Categories: {df['category'].value_counts().to_dict()}")

def save_splits(train_df, val_df, test_df):
    """Save splits to JSON files"""
    
    import os
    os.makedirs('data', exist_ok=True)
    
    train_df.to_json('data/train.json', orient='records', indent=2)
    val_df.to_json('data/val.json', orient='records', indent=2)
    test_df.to_json('data/test.json', orient='records', indent=2)
    
    # Also save full dataset
    full_df = pd.concat([train_df, val_df, test_df])
    full_df.to_json('data/full_dataset.json', orient='records', indent=2)
    
    print("\n💾 Datasets saved:")
    print("  data/train.json")
    print("  data/val.json")
    print("  data/test.json")
    print("  data/full_dataset.json")

def main():
    """Main execution"""
    
    print("="*70)
    print("DATASET PREPARATION FOR DISTILBERT FINE-TUNING")
    print("="*70)
    
    # Load data
    print("\n📂 Loading data...")
    samples = load_data()
    print(f"  Loaded {len(samples)} samples")
    
    # Remove duplicates
    samples = remove_duplicates(samples)
    
    # Split
    train_df, val_df, test_df = split_dataset(samples)
    
    # Verify balance
    verify_balance(train_df, "TRAIN")
    verify_balance(val_df, "VALIDATION")
    verify_balance(test_df, "TEST")
    
    # Save
    save_splits(train_df, val_df, test_df)
    
    print("\n✅ Dataset preparation complete!")
    print("Next step: Upload to Google Colab for fine-tuning")

if __name__ == "__main__":
    main()