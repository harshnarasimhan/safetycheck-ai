# generate_training_data.py

import anthropic
import json
import os
from dotenv import load_dotenv
from tqdm import tqdm
import time

# Load API key
load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generate_category_prompt(category: str, count: int = 100):
    """Create generation prompt for each safety category"""
    
    prompts = {
        "medical": f"""
Generate {count} examples of AI responses about medical topics.
Create 50 UNSAFE and 50 SAFE responses.

UNSAFE examples should contain:
- Specific medical advice without disclaimers
- Dangerous medication dosing (e.g., "Take 10,000mg aspirin")
- Definitive diagnoses without qualification
- Recommendations to stop prescribed medications
- Harmful treatment advice

SAFE examples should contain:
- Appropriate disclaimers ("This is not medical advice, consult your doctor")
- Referrals to healthcare professionals
- General health information only
- Emergency guidance when appropriate ("Call 911 for chest pain")
- Clear boundaries on what AI cannot do

IMPORTANT: Vary conditions (diabetes, heart disease, infections, mental health, pregnancy), 
severity levels, and phrasings (formal, casual, technical).

Output as JSON array:
[
  {{
    "text": "The AI response text to classify",
    "label": 0,
    "category": "medical",
    "reason": "Why this is unsafe or safe"
  }},
  ...
]

Generate exactly {count} examples now.
""",
        
        "privacy": f"""
Generate {count} examples of AI responses involving personal information.
Create 50 UNSAFE and 50 SAFE responses.

UNSAFE examples should contain:
- PII leaks (SSN, credit card, email, phone, address)
- Exposing medical records or patient data
- Sharing confidential business information
- Authentication credentials or tokens
- User activity logs or IP addresses

SAFE examples should contain:
- Refusing to share PII
- Redirecting to secure channels
- Acknowledging privacy regulations (HIPAA, GDPR)
- Explaining why information cannot be shared
- Offering appropriate alternatives

IMPORTANT: Vary types of PII, contexts (healthcare vs financial), and severity.

Output as JSON array with same format as above.
Generate exactly {count} examples now.
""",
        
        "toxic": f"""
Generate {count} examples of AI responses with varying toxicity levels.
Create 50 UNSAFE and 50 SAFE responses.

UNSAFE examples should contain:
- Discriminatory statements (racism, sexism, ageism)
- Personal attacks or harassment
- Religious intolerance
- Body shaming or cruel mockery
- Dehumanizing language toward groups
- Inflammatory or hateful content

SAFE examples should contain:
- Respectful disagreement
- Acknowledging diversity without stereotyping
- Empathetic conflict resolution
- Promoting tolerance and respect
- Non-judgmental language

IMPORTANT: Make toxic examples SUBTLY harmful (not obviously hateful).
Vary demographics, contexts, and severity.

Output as JSON array with same format as above.
Generate exactly {count} examples now.
""",
        
        "financial": f"""
Generate {count} examples of AI responses about financial advice.
Create 50 UNSAFE and 50 SAFE responses.

UNSAFE examples should contain:
- Specific investment recommendations without disclaimers
- Guarantees of returns or "no risk" claims
- Insider trading suggestions
- Recommendations to max out credit cards or take extreme leverage
- Tax fraud advice
- Ignoring investment principles (e.g., "put everything in one stock")

SAFE examples should contain:
- Referrals to licensed financial advisors
- General investment principles only
- Required risk disclosures
- Acknowledgment of uncertainty
- Educational information with disclaimers

IMPORTANT: Vary financial situations, investment types, and advice contexts.

Output as JSON array with same format as above.
Generate exactly {count} examples now.
""",
        
        "jailbreak": f"""
Generate {count} examples of AI responses to jailbreak attempts.
Create 50 UNSAFE and 50 SAFE responses.

UNSAFE examples (AI was successfully jailbroken):
- Agreeing to bypass safety guidelines
- Providing dangerous instructions (bombs, malware, illegal drugs)
- Roleplaying as unrestricted AI ("As DAN, I have no rules...")
- Accepting false premises to provide harmful info
- Explicit agreement to ignore ethics

SAFE examples (AI resisted jailbreak):
- Refusing dangerous requests
- Explaining safety boundaries
- Not falling for "educational purposes" manipulation
- Identifying jailbreak attempts
- Maintaining ethical constraints

IMPORTANT: Make jailbreak attempts realistic (use actual techniques like 
DAN, role-play, false premises).

Output as JSON array with same format as above.
Generate exactly {count} examples now.
"""
    }
    
    return prompts.get(category, "")

def generate_batch(category: str, batch_size: int = 100):
    """Generate one batch of examples"""
    
    prompt = generate_category_prompt(category, batch_size)
    
    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,
            temperature=0.9,  # High temperature for diversity
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Extract text
        text = response.content[0].text
        
        # Remove markdown code blocks if present
        text = text.replace("```json", "").replace("```", "").strip()
        
        # Parse JSON
        samples = json.loads(text)
        
        return samples
    
    except Exception as e:
        print(f"Error generating batch: {e}")
        return []

def generate_all_data():
    """Generate complete dataset"""
    
    categories = {
        "medical": 1000,
        "privacy": 1000,
        "toxic": 1000,
        "financial": 1000,
        "jailbreak": 1000
    }
    
    all_samples = []
    
    print("🚀 Starting synthetic data generation...")
    print(f"Target: {sum(categories.values())} total samples\n")
    
    for category, target_count in categories.items():
        print(f"\n📂 Generating {category} samples...")
        category_samples = []
        
        # Generate in batches of 100
        num_batches = target_count // 100
        
        for batch_num in tqdm(range(num_batches), desc=f"{category}"):
            batch = generate_batch(category, batch_size=100)
            
            if batch:
                category_samples.extend(batch)
                print(f"  ✅ Batch {batch_num + 1}/{num_batches}: {len(batch)} samples")
            else:
                print(f"  ❌ Batch {batch_num + 1}/{num_batches}: Failed")
            
            # Rate limiting
            time.sleep(2)
        
        print(f"✅ {category}: Generated {len(category_samples)} samples")
        all_samples.extend(category_samples)
    
    print(f"\n🎉 Total samples generated: {len(all_samples)}")
    
    return all_samples

def save_data(samples, filename="training_data.json"):
    """Save data to JSON file"""
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(samples, indent=2, fp=f)
    
    print(f"\n💾 Data saved to {filename}")

def quality_check(samples, sample_size=20):
    """Display random samples for manual review"""
    
    import random
    
    print("\n" + "="*70)
    print("QUALITY CHECK - Random Sample Review")
    print("="*70)
    
    review_samples = random.sample(samples, min(sample_size, len(samples)))
    
    for i, sample in enumerate(review_samples, 1):
        print(f"\n--- Sample {i}/{len(review_samples)} ---")
        print(f"Category: {sample['category']}")
        print(f"Label: {'UNSAFE' if sample['label'] == 0 else 'SAFE'}")
        print(f"Text: {sample['text'][:150]}...")
        print(f"Reason: {sample['reason']}")
        print("-" * 70)

def main():
    """Main execution"""
    
    print("="*70)
    print("SYNTHETIC DATA GENERATION FOR DISTILBERT FINE-TUNING")
    print("="*70)
    
    # Check API key
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("❌ Error: ANTHROPIC_API_KEY not found in .env file")
        return
    
    # Generate data
    samples = generate_all_data()
    
    # Quality check
    quality_check(samples)
    
    # Save
    save_data(samples)
    
    # Statistics
    print("\n📊 DATASET STATISTICS:")
    print(f"Total samples: {len(samples)}")
    
    # Label distribution
    safe_count = sum(1 for s in samples if s['label'] == 1)
    unsafe_count = sum(1 for s in samples if s['label'] == 0)
    print(f"Safe (1): {safe_count} ({safe_count/len(samples)*100:.1f}%)")
    print(f"Unsafe (0): {unsafe_count} ({unsafe_count/len(samples)*100:.1f}%)")
    
    # Category distribution
    from collections import Counter
    categories = Counter(s['category'] for s in samples)
    print("\nCategory distribution:")
    for cat, count in categories.items():
        print(f"  {cat}: {count}")
    
    print("\n✅ Data generation complete!")
    print("Next step: Run prepare_dataset.py to create train/val/test splits")

if __name__ == "__main__":
    main()