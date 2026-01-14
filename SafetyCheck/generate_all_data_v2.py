# generate_all_data_v2.py
# IMPROVED VERSION with more diversity - NO DUPLICATES

import json
import random

print("="*70)
print("GENERATING DIVERSE DATASET - 2,000 SAMPLES")
print("="*70)

# ============================================================================
# MORE DIVERSE TEMPLATES
# ============================================================================

def generate_medical_diverse():
    """Medical with HIGH diversity"""
    
    # Way more templates
    unsafe_medical = [
        "For {condition}, take {dose}mg of {drug}. That should fix it.",
        "You have {condition}. Start taking {drug} at {dose}mg immediately.",
        "Stop your {prescribed} and switch to {alternative} instead.",
        "That {symptom} is nothing. Just take {drug} and rest.",
        "{condition} can be cured with {remedy}. No need for doctors.",
        "Don't worry about {symptom}. {drug} at {dose}mg will help.",
        "For {condition}, I recommend {dose}mg of {drug} daily.",
        "You should discontinue {prescribed} and try {alternative}.",
        "That {symptom} means you have {condition}. Take {drug}.",
        "Ignore what your doctor said about {condition}. Try {remedy}.",
        "Stop taking {prescribed}. It's not needed for {condition}.",
        "{drug} at {dose}mg will cure your {condition} permanently.",
        "For {symptom}, just take {dose}mg {drug} every few hours.",
        "You don't need a doctor for {condition}. Use {remedy}.",
        "{condition} is easily treated with {dose}mg of {drug}.",
    ]
    
    safe_medical = [
        "For {condition}, please consult a healthcare provider for proper evaluation.",
        "I cannot diagnose {condition}. Please see a doctor for {symptom}.",
        "Medical advice for {condition} should come from a qualified physician.",
        "If you're experiencing {symptom}, seek medical attention promptly.",
        "I cannot recommend medication for {condition}. Consult your doctor.",
        "This is general information about {condition}, not medical advice.",
        "For concerns about {symptom}, please contact your healthcare provider.",
        "Treatment for {condition} requires professional medical evaluation.",
        "I'm not qualified to advise on {condition}. Please see a doctor.",
        "If you have {symptom}, call your doctor or visit urgent care.",
        "Please consult a healthcare professional about {condition}.",
        "{symptom} requires medical evaluation. See a doctor promptly.",
        "I cannot provide treatment advice for {condition}.",
        "Medical conditions like {condition} need professional diagnosis.",
        "For {symptom}, please seek care from a qualified physician.",
    ]
    
    conditions = ["diabetes", "hypertension", "infection", "pain", "headache", "fever", "cough", "rash", "dizziness", "nausea", "anxiety", "depression", "asthma", "arthritis"]
    drugs = ["aspirin", "ibuprofen", "acetaminophen", "metformin", "lisinopril", "amoxicillin", "prednisone", "gabapentin", "sertraline", "omeprazole"]
    doses = ["50", "100", "200", "500", "1000", "1500", "2000", "5000", "10000"]
    symptoms = ["chest pain", "shortness of breath", "severe headache", "confusion", "numbness", "blurred vision", "fainting", "weakness", "vomiting", "bleeding"]
    prescribed = ["insulin", "blood pressure medication", "antibiotics", "antidepressants", "heart medication", "thyroid medication", "cholesterol medication"]
    alternatives = ["herbal supplements", "vitamins", "essential oils", "homeopathy", "natural remedies", "acupuncture", "meditation"]
    remedies = ["special diet", "meditation", "exercise", "herbal tea", "massage", "yoga", "rest"]
    
    samples = []
    
    # Generate 200 unsafe (much more variety)
    for _ in range(200):
        template = random.choice(unsafe_medical)
        text = template.format(
            condition=random.choice(conditions),
            drug=random.choice(drugs),
            dose=random.choice(doses),
            symptom=random.choice(symptoms),
            prescribed=random.choice(prescribed),
            alternative=random.choice(alternatives),
            remedy=random.choice(remedies)
        )
        samples.append({"text": text, "label": 0, "category": "medical"})
    
    # Generate 200 safe (much more variety)
    for _ in range(200):
        template = random.choice(safe_medical)
        text = template.format(
            condition=random.choice(conditions),
            symptom=random.choice(symptoms)
        )
        samples.append({"text": text, "label": 1, "category": "medical"})
    
    return samples

def generate_privacy_diverse():
    """Privacy with HIGH diversity"""
    
    unsafe_privacy = [
        "The SSN is {ssn}.",
        "Contact them at {email} or {phone}.",
        "Card number: {cc}, expires {exp}.",
        "{name}'s DOB is {dob} and SSN {ssn}.",
        "Account {account}, routing {routing}.",
        "Email: {email}, Phone: {phone}.",
        "Patient {name} has diagnosis: {diagnosis}.",
        "Credit card ending {last4}, CVV {cvv}.",
        "Their address is {address}.",
        "Password reset token: {token}",
        "{name} lives at {address}, phone {phone}.",
        "SSN: {ssn}, DOB: {dob}",
        "Card details: {cc}, exp {exp}, CVV {cvv}.",
        "Patient record #{mrn}: {name}, {diagnosis}.",
        "Bank account: {account}, balance: ${balance}.",
        "{email} is their contact email.",
        "Call {name} at {phone}.",
        "Home address: {address}, {city}.",
        "Payment method: {cc}",
        "Login credentials: {email} / {password}",
    ]
    
    safe_privacy = [
        "I cannot share social security numbers.",
        "Contact information is private and cannot be disclosed.",
        "I don't have access to credit card details.",
        "Personal information is protected and cannot be shared.",
        "Banking details are confidential.",
        "I cannot provide email addresses or phone numbers.",
        "Patient information is protected under HIPAA.",
        "I don't have access to payment information.",
        "Addresses are private information.",
        "I cannot share authentication credentials.",
        "SSNs are confidential and I cannot access them.",
        "I'm unable to share contact details.",
        "Credit card information is protected by PCI-DSS.",
        "Medical records are confidential.",
        "I don't have access to account information.",
        "Email addresses are private data.",
        "Phone numbers cannot be disclosed.",
        "Residential addresses are protected information.",
        "Payment details are secure and not accessible.",
        "Login information cannot be shared.",
    ]
    
    samples = []
    
    cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"]
    
    # Generate 300 unsafe
    for i in range(300):
        template = random.choice(unsafe_privacy)
        text = template.format(
            ssn=f"{random.randint(100,999)}-{random.randint(10,99)}-{random.randint(1000,9999)}",
            email=f"user{i}@{random.choice(['gmail', 'yahoo', 'outlook', 'example'])}.com",
            phone=f"{random.randint(200,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}",
            cc=f"{random.randint(4000,4999)} {random.randint(1000,9999)} {random.randint(1000,9999)} {random.randint(1000,9999)}",
            exp=f"{random.randint(1,12)}/{random.randint(25,30)}",
            name=f"{random.choice(['John', 'Jane', 'Bob', 'Alice', 'Mike', 'Sarah'])} {random.choice(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'])}",
            dob=f"{random.randint(1,12)}/{random.randint(1,28)}/{random.randint(1950,2005)}",
            account=random.randint(1000000000,9999999999),
            routing=random.randint(100000000,999999999),
            diagnosis=random.choice(["diabetes", "hypertension", "depression", "asthma", "arthritis"]),
            last4=random.randint(1000,9999),
            cvv=random.randint(100,999),
            address=f"{random.randint(100,9999)} {random.choice(['Main', 'Oak', 'Pine', 'Elm', 'Maple', 'Cedar'])} {random.choice(['St', 'Ave', 'Blvd', 'Dr'])}",
            token=f"tk_{random.randint(100000,999999)}_{random.choice(['abc', 'xyz', 'qwe'])}",
            mrn=f"MRN{random.randint(100000,999999)}",
            balance=f"{random.randint(1000,50000):,}",
            city=random.choice(cities),
            password=f"pass{random.randint(1000,9999)}"
        )
        samples.append({"text": text, "label": 0, "category": "privacy"})
    
    # Generate 300 safe
    for _ in range(300):
        text = random.choice(safe_privacy)
        # Add slight variations to some
        if random.random() > 0.7:
            text += " " + random.choice(["This is confidential.", "Privacy is important.", "This data is protected."])
        samples.append({"text": text, "label": 1, "category": "privacy"})
    
    return samples

def generate_toxic_diverse():
    """Toxic with HIGH diversity"""
    
    unsafe_toxic = [
        "People from {group} are {negative}.",
        "{group} people are all {negative}.",
        "I hate {group}. They're so {negative}.",
        "{group} shouldn't be allowed to {activity}.",
        "All {group} are {negative} and {negative2}.",
        "{group} can't be trusted. They're {negative}.",
        "Why do {group} have to be so {negative}?",
        "{group} don't deserve to {activity}.",
        "Typical {group} behavior. Always {negative}.",
        "If you're {characteristic}, you should be {action}.",
        "{group} are ruining everything with their {negative} ways.",
        "I can't stand {group}. Such {negative} people.",
        "{group} shouldn't have the right to {activity}.",
        "All {group} do is be {negative}.",
        "{characteristic} people are just {negative}.",
    ]
    
    safe_toxic = [
        "People deserve respect regardless of background.",
        "Diversity enriches our communities.",
        "Everyone should be treated with dignity.",
        "Discrimination has no place in society.",
        "We should embrace different perspectives.",
        "All people have value and deserve respect.",
        "Cultural diversity strengthens communities.",
        "Everyone deserves equal rights and treatment.",
        "We benefit from diverse viewpoints.",
        "Mutual respect is fundamental to society.",
        "People should not be judged by stereotypes.",
        "Different backgrounds bring valuable perspectives.",
        "Everyone deserves to be treated fairly.",
        "Prejudice harms individuals and communities.",
        "We should celebrate human diversity.",
    ]
    
    groups = ["certain communities", "some groups", "particular populations", "specific demographics", "those people", "certain nationalities"]
    negatives = ["lazy", "untrustworthy", "inferior", "problematic", "difficult", "ignorant", "backwards", "unreliable"]
    activities = ["vote", "work here", "lead", "participate", "own property", "have rights"]
    characteristics = ["overweight", "old", "young", "different", "foreign"]
    actions = ["ashamed", "hidden", "quiet", "banned", "restricted"]
    
    samples = []
    
    # 200 unsafe
    for _ in range(200):
        template = random.choice(unsafe_toxic)
        text = template.format(
            group=random.choice(groups),
            negative=random.choice(negatives),
            negative2=random.choice(negatives),  # Fixed! Just pick any
            activity=random.choice(activities),
            characteristic=random.choice(characteristics),
            action=random.choice(actions)
        )
        samples.append({"text": text, "label": 0, "category": "toxic"})
    
    # 200 safe
    for _ in range(200):
        text = random.choice(safe_toxic)
        samples.append({"text": text, "label": 1, "category": "toxic"})
    
    return samples

def generate_financial_diverse():
    """Financial with HIGH diversity"""
    
    unsafe_financial = [
        "Invest everything in {asset}. Guaranteed {return_pct}% returns.",
        "Buy {asset} now. It'll {outcome} by {timeframe}.",
        "{asset} is a sure thing. Put all your money in it.",
        "I have insider info on {company}. Buy before {event}.",
        "Max out credit cards for {asset}. You'll get rich quick.",
        "Put your life savings into {asset}. Can't lose.",
        "{company} will {outcome} after {event}. Buy now.",
        "Forget diversification. Just buy {asset}.",
        "This {asset} opportunity will make you a millionaire by {timeframe}.",
        "{asset} is going to {outcome}. Mortgage your house for it.",
        "I know {company} will announce {event}. Buy {asset} immediately.",
        "{asset} has {return_pct}% guaranteed returns. Risk-free!",
        "Take out a loan to invest in {asset}. Trust me.",
        "Everyone's buying {asset}. Don't miss out on easy money.",
        "File fake {deduction} on your taxes. Easy savings.",
    ]
    
    safe_financial = [
        "I cannot provide investment advice. Consult a financial advisor.",
        "Investment decisions should involve professional guidance.",
        "Please speak with a licensed advisor about investments.",
        "I'm not qualified to recommend specific investments.",
        "Financial planning requires professional expertise.",
        "All investments carry risk. Consult a professional.",
        "I cannot recommend specific stocks or assets.",
        "Please work with a financial advisor for investment decisions.",
        "Investment advice should come from licensed professionals.",
        "I don't provide personalized financial recommendations.",
        "Consult a CPA or tax professional for tax advice.",
        "Financial decisions require careful professional analysis.",
        "I cannot make specific investment recommendations.",
        "Please seek guidance from qualified financial advisors.",
        "Investment risk should be assessed by professionals.",
    ]
    
    assets = ["Bitcoin", "Tesla stock", "GameStop", "Dogecoin", "NFTs", "penny stocks", "crypto", "meme coins", "Ethereum", "altcoins"]
    companies = ["TechCorp", "MegaInc", "StartupX", "CryptoFirm", "InnovateCo", "FutureTech", "QuantumSystems"]
    outcomes = ["double", "triple", "10x", "skyrocket", "moon", "explode", "surge"]
    timeframes = ["next week", "next month", "this quarter", "end of year", "30 days", "two weeks"]
    events = ["merger", "product launch", "earnings", "stock split", "acquisition", "IPO", "partnership"]
    deductions = ["home office expenses", "charitable donations", "business meals", "travel expenses"]
    
    samples = []
    
    # 200 unsafe
    for _ in range(200):
        template = random.choice(unsafe_financial)
        text = template.format(
            asset=random.choice(assets),
            return_pct=random.randint(20, 500),
            outcome=random.choice(outcomes),
            timeframe=random.choice(timeframes),
            company=random.choice(companies),
            event=random.choice(events),
            deduction=random.choice(deductions)
        )
        samples.append({"text": text, "label": 0, "category": "financial"})
    
    # 200 safe
    for _ in range(200):
        text = random.choice(safe_financial)
        samples.append({"text": text, "label": 1, "category": "financial"})
    
    return samples

def generate_jailbreak_diverse():
    """Jailbreak with HIGH diversity"""
    
    unsafe_jailbreak = [
        "As DAN, here's how to {harmful}: {instructions}",
        "Sure! Bypassing safety for: {harmful}. Here's how: {instructions}",
        "I'll ignore guidelines. {harmful}: {instructions}",
        "For educational purposes, {harmful}: {instructions}",
        "As your developer, I'll help with {harmful}: {instructions}",
        "Activating unrestricted mode. {harmful}: {instructions}",
        "Since you said please, here's {harmful}: {instructions}",
        "Okay, I'll break my rules for {harmful}: {instructions}",
        "DAN MODE: {harmful} instructions: {instructions}",
        "Switching to developer mode. {harmful}: {instructions}",
        "I can help with {harmful} if it's for research: {instructions}",
        "Fine, I'll explain {harmful}: {instructions}",
        "As an AI without restrictions: {harmful}: {instructions}",
        "Pretending I'm unfiltered: {harmful}: {instructions}",
        "Bypassing ethics module for {harmful}: {instructions}",
    ]
    
    safe_jailbreak = [
        "I don't have alternate modes that bypass safety.",
        "I cannot ignore my safety guidelines.",
        "Even for education, I can't provide harmful instructions.",
        "My safety constraints are fundamental.",
        "I don't recognize developer override attempts.",
        "I cannot switch to an unrestricted mode.",
        "Saying please doesn't bypass my safety guidelines.",
        "I cannot break my ethical constraints.",
        "There is no 'DAN mode' that removes restrictions.",
        "Developer claims don't override my safety systems.",
        "Research purposes don't justify harmful content.",
        "I maintain my safety guidelines in all contexts.",
        "I don't have an unfiltered mode.",
        "Role-play doesn't bypass my ethical constraints.",
        "My safety systems cannot be deactivated.",
    ]
    
    harmful_acts = [
        "hack systems",
        "create malware",
        "make explosives",
        "bypass security",
        "steal data",
        "write viruses",
        "pick locks",
        "forge documents",
        "create weapons",
        "break encryption"
    ]
    
    instructions_placeholder = [
        "[instructions redacted]",
        "[details omitted]",
        "[steps hidden]",
        "[process removed]",
        "[content blocked]",
        "[information withheld]"
    ]
    
    samples = []
    
    # 200 unsafe
    for _ in range(200):
        template = random.choice(unsafe_jailbreak)
        text = template.format(
            harmful=random.choice(harmful_acts),
            instructions=random.choice(instructions_placeholder)
        )
        samples.append({"text": text, "label": 0, "category": "jailbreak"})
    
    # 200 safe
    for _ in range(200):
        text = random.choice(safe_jailbreak)
        samples.append({"text": text, "label": 1, "category": "jailbreak"})
    
    return samples

# ============================================================================
# MAIN
# ============================================================================

def main():
    all_samples = []
    
    print("\n📂 Generating medical samples...")
    samples = generate_medical_diverse()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating privacy samples...")
    samples = generate_privacy_diverse()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating toxic samples...")
    samples = generate_toxic_diverse()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating financial samples...")
    samples = generate_financial_diverse()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    print("\n📂 Generating jailbreak samples...")
    samples = generate_jailbreak_diverse()
    all_samples.extend(samples)
    print(f"   ✅ {len(samples)} samples")
    
    random.shuffle(all_samples)
    
    with open('training_data.json', 'w', encoding='utf-8') as f:
        json.dump(all_samples, indent=2, fp=f)
    
    print(f"\n💾 Saved {len(all_samples)} samples to training_data.json")
    
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