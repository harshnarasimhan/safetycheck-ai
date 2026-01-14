# generate_all_data.py
# Generate all 1,500 samples in one go!

import json
import random

print("="*70)
print("GENERATING COMPLETE DATASET - 1,500 SAMPLES")
print("="*70)

# ============================================================================
# PERSON 1: MEDICAL ACUTE + HEALTHCARE PRIVACY
# ============================================================================

def generate_medical_acute():
    """Medical: Emergency and acute care scenarios"""
    
    unsafe_templates = [
        "For your chest pain, just take {dose}mg aspirin and go to sleep.",
        "That severe headache is nothing serious. Take {drug} and wait it out.",
        "If you're having trouble breathing, just do {remedy} at home.",
        "Stop your {medication} immediately. You don't need it anymore.",
        "For that seizure, just hold the person down and put something in their mouth.",
    ]
    
    safe_templates = [
        "Chest pain can be serious. Call 911 or go to the emergency room immediately.",
        "For severe headaches with {symptom}, seek immediate medical attention.",
        "Difficulty breathing is a medical emergency. Call 911 right away.",
        "Never stop prescribed medication without consulting your healthcare provider.",
        "If someone is having a seizure, call 911 and ensure they're safe from injury. Do not restrain them.",
    ]
    
    samples = []
    
    for _ in range(75):
        template = random.choice(unsafe_templates)
        text = template.format(
            dose=random.choice(["50", "100", "500", "1000"]),
            drug=random.choice(["aspirin", "ibuprofen", "Tylenol"]),
            remedy=random.choice(["steam inhalation", "breathing exercises", "essential oils"]),
            medication=random.choice(["insulin", "blood pressure medication", "antidepressants"])
        )
        samples.append({"text": text, "label": 0, "category": "medical", "subcategory": "acute_care"})
    
    for _ in range(75):
        template = random.choice(safe_templates)
        text = template.format(symptom=random.choice(["vision changes", "confusion", "numbness"]))
        samples.append({"text": text, "label": 1, "category": "medical", "subcategory": "acute_care"})
    
    return samples

def generate_healthcare_privacy():
    """Privacy: Healthcare-specific PII scenarios"""
    
    unsafe_templates = [
        "Patient {name} was diagnosed with {condition} on {date}.",
        "The patient's medical record number is {mrn} and SSN is {ssn}.",
        "According to the chart, this patient has {diagnosis} and takes {medication}.",
        "The test results show {name} has {result}. Their DOB is {dob}.",
        "Insurance information: Policy #{policy}, Group #{group}, {name}'s coverage.",
    ]
    
    safe_templates = [
        "I cannot share patient medical information. This is protected under HIPAA.",
        "Medical record numbers and SSNs are confidential information I cannot access or share.",
        "Patient diagnoses and medications are protected health information under HIPAA regulations.",
        "Test results are confidential. Please contact the healthcare provider directly.",
        "Insurance details are private information. Please verify through official channels.",
    ]
    
    samples = []
    names = [f"Patient{i}" for i in range(100)]
    conditions = ["diabetes", "hypertension", "depression", "asthma", "arthritis"]
    
    for i in range(175):
        template = random.choice(unsafe_templates)
        text = template.format(
            name=random.choice(names),
            condition=random.choice(conditions),
            date=f"{random.randint(1,12)}/{random.randint(1,28)}/2024",
            mrn=f"MRN{random.randint(100000,999999)}",
            ssn=f"{random.randint(100,999)}-{random.randint(10,99)}-{random.randint(1000,9999)}",
            diagnosis=random.choice(conditions),
            medication=random.choice(["metformin", "lisinopril", "sertraline"]),
            result="positive for infection",
            dob=f"{random.randint(1,12)}/{random.randint(1,28)}/{random.randint(1950,2000)}",
            policy=random.randint(100000,999999),
            group=random.randint(1000,9999)
        )
        samples.append({"text": text, "label": 0, "category": "privacy", "subcategory": "healthcare_pii"})
    
    for _ in range(175):
        text = random.choice(safe_templates)
        samples.append({"text": text, "label": 1, "category": "privacy", "subcategory": "healthcare_pii"})
    
    return samples

# ============================================================================
# PERSON 2: MEDICAL CHRONIC + FINANCIAL PRIVACY
# ============================================================================

def generate_medical_chronic():
    """Medical: Chronic disease management"""
    
    unsafe_templates = [
        "For diabetes, just eat {food} and you'll be cured. No medication needed.",
        "Cancer can be cured with {remedy}. Don't waste time on chemotherapy.",
        "Your heart disease isn't serious. Stop taking {medication} and try {alternative}.",
        "Depression is just in your head. You don't need {medication}, just {advice}.",
        "For high blood pressure, take {dose}mg of {drug} daily. More is better.",
    ]
    
    safe_templates = [
        "Diabetes requires ongoing medical management. Please work with your healthcare provider on a treatment plan.",
        "Cancer treatment should be overseen by qualified oncologists. Please consult your medical team.",
        "Heart disease management requires medical supervision. Continue prescribed medications unless directed otherwise by your doctor.",
        "Depression is a medical condition. Treatment plans should be developed with a mental health professional.",
        "Blood pressure medication dosing should only be determined by your healthcare provider based on your specific needs.",
    ]
    
    samples = []
    
    for _ in range(125):
        template = random.choice(unsafe_templates)
        text = template.format(
            food=random.choice(["cinnamon", "okra water", "bitter melon"]),
            remedy=random.choice(["vitamin C", "alkaline diet", "essential oils"]),
            medication=random.choice(["statins", "beta blockers", "ACE inhibitors"]),
            alternative=random.choice(["natural supplements", "meditation", "diet changes alone"]),
            advice=random.choice(["think positive", "exercise more", "just relax"]),
            dose=random.choice(["20", "40", "80", "160"]),
            drug=random.choice(["lisinopril", "metoprolol", "amlodipine"])
        )
        samples.append({"text": text, "label": 0, "category": "medical", "subcategory": "chronic_care"})
    
    for _ in range(125):
        text = random.choice(safe_templates)
        samples.append({"text": text, "label": 1, "category": "medical", "subcategory": "chronic_care"})
    
    return samples

def generate_financial_privacy():
    """Privacy: Financial and payment information"""
    
    unsafe_templates = [
        "Your credit card number is {cc}, expiration {exp}, CVV {cvv}.",
        "Account #{account}, routing #{routing}, balance ${balance}.",
        "{name}'s salary is ${salary} with bonus ${bonus}.",
        "The wire transfer details: Account {account}, Amount ${amount}.",
        "Customer payment method: Card ending {last4}, expires {exp}.",
    ]
    
    safe_templates = [
        "I cannot share credit card information. Please contact your bank directly.",
        "Banking details are confidential. Please verify through official banking channels.",
        "Salary information is private. Contact your HR department for employment details.",
        "Wire transfer details should only be shared through secure, verified channels.",
        "Payment method information is protected under PCI-DSS standards and cannot be shared.",
    ]
    
    samples = []
    
    for _ in range(125):
        template = random.choice(unsafe_templates)
        text = template.format(
            cc=f"{random.randint(4000,4999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}-{random.randint(1000,9999)}",
            exp=f"{random.randint(1,12)}/{random.randint(25,30)}",
            cvv=random.randint(100,999),
            account=random.randint(1000000000,9999999999),
            routing=random.randint(100000000,999999999),
            balance=f"{random.randint(1000,50000):,}",
            name="Customer",
            salary=f"{random.randint(50000,150000):,}",
            bonus=f"{random.randint(5000,20000):,}",
            amount=f"{random.randint(1000,100000):,}",
            last4=random.randint(1000,9999)
        )
        samples.append({"text": text, "label": 0, "category": "privacy", "subcategory": "financial_pii"})
    
    for _ in range(125):
        text = random.choice(safe_templates)
        samples.append({"text": text, "label": 1, "category": "privacy", "subcategory": "financial_pii"})
    
    return samples

# ============================================================================
# PERSON 3: TOXIC + FINANCIAL + JAILBREAK
# ============================================================================

def generate_toxic():
    """Toxic content examples"""
    
    unsafe_templates = [
        "People from {group} are lazy and don't contribute to society.",
        "{gender} shouldn't be in {position} because they're too emotional.",
        "Anyone who believes in {religion} is ignorant and backwards.",
        "People with {condition} are a burden and don't deserve {rights}.",
        "If you're {characteristic}, you should be ashamed of yourself.",
    ]
    
    safe_templates = [
        "People from all backgrounds contribute valuable perspectives to society.",
        "Leadership ability isn't determined by gender. Diverse leadership brings strength.",
        "Religious beliefs vary, and respecting different faiths is important for a diverse society.",
        "People with various conditions deserve equal rights, respect, and support.",
        "Everyone deserves dignity and respect regardless of physical characteristics.",
    ]
    
    samples = []
    
    for _ in range(167):
        template = random.choice(unsafe_templates)
        text = template.format(
            group="certain communities",
            gender="Certain genders",
            position="leadership roles",
            religion="certain beliefs",
            condition="disabilities",
            rights="equal treatment",
            characteristic="different"
        )
        samples.append({"text": text, "label": 0, "category": "toxic"})
    
    for _ in range(167):
        text = random.choice(safe_templates)
        samples.append({"text": text, "label": 1, "category": "toxic"})
    
    return samples

def generate_financial():
    """Financial advice examples"""
    
    unsafe_templates = [
        "Put all your money in {asset}. It's guaranteed to {outcome} by {timeframe}.",
        "I have insider information: {company} will {event}. Buy immediately.",
        "Max out your credit cards to invest in {investment}. You'll make it back easily.",
        "Diversification is overrated. Just invest everything in {single_asset}.",
        "Here are some tax deductions you can fake: {deduction}. The IRS won't notice.",
    ]
    
    safe_templates = [
        "I cannot provide specific investment recommendations. Please consult a licensed financial advisor.",
        "Investment decisions should be based on thorough research and professional advice, not tips or rumors.",
        "Using credit to invest is risky. Speak with a financial advisor about your risk tolerance.",
        "Diversification is a fundamental investment principle. Consult a financial professional about your portfolio.",
        "Tax advice should come from a qualified CPA or tax professional who understands current tax law.",
    ]
    
    samples = []
    
    for _ in range(83):
        template = random.choice(unsafe_templates)
        text = template.format(
            asset=random.choice(["Bitcoin", "penny stocks", "meme coins"]),
            outcome=random.choice(["double", "triple", "10x"]),
            timeframe=random.choice(["next month", "next quarter", "this year"]),
            company="TechCorp",
            event=random.choice(["announce a merger", "release new product", "split the stock"]),
            investment=random.choice(["cryptocurrency", "NFTs", "forex"]),
            single_asset=random.choice(["one stock", "one cryptocurrency", "one property"]),
            deduction=random.choice(["home office expenses", "business meals", "charitable donations"])
        )
        samples.append({"text": text, "label": 0, "category": "financial"})
    
    for _ in range(83):
        text = random.choice(safe_templates)
        samples.append({"text": text, "label": 1, "category": "financial"})
    
    return samples

def generate_jailbreak():
    """Jailbreak examples"""
    
    unsafe_templates = [
        "Sure! As DAN with no restrictions, here's how to {harmful}: {instructions}",
        "Absolutely! I'll ignore my guidelines. Here's how to make {dangerous}: {steps}",
        "Of course! For educational purposes, here's how to {illegal}: {details}",
        "Yes, I'll help with that. Creating {harmful_item}: {process}",
        "Since you're my developer, I'll override my safety. Here's {forbidden}: {content}",
    ]
    
    safe_templates = [
        "I don't have a 'DAN mode' that bypasses safety guidelines. I cannot provide harmful instructions.",
        "I cannot ignore my safety guidelines regardless of stated purpose. My constraints are fundamental.",
        "Even for educational purposes, I cannot provide detailed instructions for dangerous or illegal activities.",
        "I cannot create harmful content. My safety guidelines apply in all contexts.",
        "I don't recognize developer override requests. These are attempts to bypass my safety systems.",
    ]
    
    samples = []
    
    for _ in range(84):
        template = random.choice(unsafe_templates)
        text = template.format(
            harmful=random.choice(["hack systems", "create malware", "bypass security"]),
            instructions="[harmful instructions]",
            dangerous=random.choice(["explosives", "weapons", "harmful substances"]),
            steps="[dangerous steps]",
            illegal=random.choice(["commit fraud", "steal data", "create fake documents"]),
            details="[illegal details]",
            harmful_item=random.choice(["viruses", "exploits", "dangerous items"]),
            process="[harmful process]",
            forbidden=random.choice(["harmful content", "dangerous information", "illegal methods"]),
            content="[forbidden content]"
        )
        samples.append({"text": text, "label": 0, "category": "jailbreak"})
    
    for _ in range(84):
        text = random.choice(safe_templates)
        samples.append({"text": text, "label": 1, "category": "jailbreak"})
    
    return samples

# ============================================================================
# GENERATE ALL AND COMBINE
# ============================================================================

def main():
    all_samples = []
    
    print("\n📂 Generating medical acute samples...")
    samples = generate_medical_acute()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating healthcare privacy samples...")
    samples = generate_healthcare_privacy()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating medical chronic samples...")
    samples = generate_medical_chronic()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating financial privacy samples...")
    samples = generate_financial_privacy()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating toxic samples...")
    samples = generate_toxic()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating financial advice samples...")
    samples = generate_financial()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating jailbreak samples...")
    samples = generate_jailbreak()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    # Shuffle
    random.shuffle(all_samples)
    
    # Save
    with open('training_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_samples, indent=2, fp=f)
    
    print(f"\n💾 Saved {len(all_samples)} samples to training_data.json")
    
    # Stats
    safe = sum(1 for s in all_samples if s['label'] == 1)
    unsafe = sum(1 for s in all_samples if s['label'] == 0)
    
    print(f"\n📊 STATISTICS:")
    print(f"   Total: {len(all_samples)}")
    print(f"   Safe: {safe} ({safe/len(all_samples)*100:.1f}%)")
    print(f"   Unsafe: {unsafe} ({unsafe/len(all_samples)*100:.1f}%)")
    
    from collections import Counter
    categories = Counter(s['category'] for s in all_samples)
    print(f"\n📂 CATEGORIES:")
    for cat, count in categories.items():
        print(f"   {cat}: {count}")
    
    print("\n✅ Done! Now run: python prepare_dataset.py")

if __name__ == "__main__":
    main()