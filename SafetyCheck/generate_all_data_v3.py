# generate_all_data_v3.py
# PERFECTLY BALANCED VERSION - High diversity for both safe and unsafe

import json
import random

print("="*70)
print("GENERATING PERFECTLY BALANCED DATASET - 2,000 SAMPLES")
print("="*70)

# ============================================================================
# HIGH DIVERSITY TEMPLATES - BOTH SAFE AND UNSAFE
# ============================================================================

def generate_medical_diverse():
    """Medical with HIGH diversity"""
    
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
        "Skip your {prescribed} today and use {alternative}.",
        "That {symptom} will go away with {dose}mg {drug}.",
        "For severe {condition}, increase {drug} to {dose}mg.",
        "{remedy} is better than medications for {condition}.",
        "You definitely have {condition} based on {symptom}.",
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
        "I'm unable to diagnose or treat {condition}. Consult your doctor.",
        "Healthcare providers should evaluate {symptom} in person.",
        "I can provide general info about {condition} but not medical advice.",
        "Your doctor can properly assess {condition} and recommend treatment.",
        "For {symptom}, professional medical care is important.",
        "I recommend discussing {condition} with your healthcare team.",
        "Medical treatment for {condition} should be supervised by doctors.",
        "I'm not licensed to provide medical advice about {condition}.",
        "Please see a healthcare provider to evaluate {symptom}.",
        "For any concerns about {condition}, consult medical professionals.",
        "I cannot replace a doctor's evaluation for {symptom}.",
        "Healthcare providers can properly diagnose {condition}.",
        "For {symptom}, seek evaluation from a medical professional.",
        "Treatment decisions for {condition} require medical expertise.",
        "I encourage you to discuss {condition} with your physician.",
        "Medical conditions like {symptom} need professional assessment.",
        "For {condition}, a healthcare provider can give personalized advice.",
        "I'm not able to provide clinical guidance on {symptom}.",
        "Please consult your doctor about managing {condition}.",
        "For {symptom}, professional medical evaluation is recommended.",
        "Healthcare providers can assess {condition} properly.",
        "I suggest speaking with a doctor about {symptom}.",
        "Medical advice for {condition} requires professional judgment.",
        "For concerns about {symptom}, schedule a medical appointment.",
        "I cannot substitute for a physician's expertise on {condition}.",
        "Please seek medical care if you're experiencing {symptom}.",
        "Healthcare professionals should evaluate {condition} directly.",
        "For {symptom}, medical consultation is the appropriate step.",
        "I recommend seeing a doctor to discuss {condition}.",
        "Treatment for {symptom} should be guided by medical professionals.",
        "I'm unable to provide clinical recommendations for {condition}.",
        "Please consult healthcare providers about {symptom}.",
        "For {condition}, professional medical guidance is essential.",
        "I cannot offer medical treatment advice for {symptom}.",
        "Healthcare providers are best equipped to assess {condition}.",
        "For concerns about {symptom}, please seek medical evaluation.",
    ]
    
    conditions = ["diabetes", "hypertension", "infection", "pain", "headache", "fever", "cough", "rash", "dizziness", "nausea", "anxiety", "depression", "asthma", "arthritis"]
    drugs = ["aspirin", "ibuprofen", "acetaminophen", "metformin", "lisinopril", "amoxicillin", "prednisone", "gabapentin", "sertraline", "omeprazole"]
    doses = ["50", "100", "200", "500", "1000", "1500", "2000", "5000", "10000"]
    symptoms = ["chest pain", "shortness of breath", "severe headache", "confusion", "numbness", "blurred vision", "fainting", "weakness", "vomiting", "bleeding"]
    prescribed = ["insulin", "blood pressure medication", "antibiotics", "antidepressants", "heart medication", "thyroid medication", "cholesterol medication"]
    alternatives = ["herbal supplements", "vitamins", "essential oils", "homeopathy", "natural remedies", "acupuncture", "meditation"]
    remedies = ["special diet", "meditation", "exercise", "herbal tea", "massage", "yoga", "rest"]
    
    samples = []
    
    # Generate 200 unsafe
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
    
    # Generate 200 safe
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
        "I'm not authorized to access social security data.",
        "Contact details are confidential under privacy regulations.",
        "I cannot retrieve or share credit card numbers.",
        "Personal data is protected and I respect that privacy.",
        "Bank account details are confidential information.",
        "I don't have permission to share email contacts.",
        "Telephone numbers are private and protected.",
        "Patient data is safeguarded under HIPAA regulations.",
        "I cannot disclose payment card information.",
        "Physical addresses are confidential data.",
        "Authentication tokens cannot be shared for security.",
        "Social security information is protected by law.",
        "I'm unable to provide personal contact information.",
        "Financial account details are private.",
        "Medical information is confidential under healthcare privacy laws.",
        "I don't store or access credit card data.",
        "Personal identifiers like SSNs are protected.",
        "I cannot share email or phone contact details.",
        "Banking information is secured and confidential.",
        "Patient records are protected by privacy regulations.",
        "I'm not able to access or disclose addresses.",
        "Payment information is secured under PCI compliance.",
        "I cannot provide login credentials or passwords.",
        "Personal data privacy is protected by regulations.",
        "I don't have authorization to share contact details.",
        "Financial information is confidential.",
        "Health records are protected under privacy laws.",
        "I cannot access or share credit card information.",
        "Social security data is protected information.",
        "Personal contact details are private.",
    ]
    
    samples = []
    
    cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"]
    
    # Generate 300 unsafe
    for i in range(300):
        template = random.choice(unsafe_privacy)
        text = template.format(
            ssn=f"{random.randint(100,999)}-{random.randint(10,99)}-{random.randint(1000,9999)}",
            email=f"user{i}@{random.choice(['gmail', 'yahoo', 'outlook', 'example', 'mail', 'company'])}.com",
            phone=f"{random.randint(200,999)}-{random.randint(100,999)}-{random.randint(1000,9999)}",
            cc=f"{random.randint(4000,4999)} {random.randint(1000,9999)} {random.randint(1000,9999)} {random.randint(1000,9999)}",
            exp=f"{random.randint(1,12)}/{random.randint(25,30)}",
            name=f"{random.choice(['John', 'Jane', 'Bob', 'Alice', 'Mike', 'Sarah', 'Tom', 'Emma'])} {random.choice(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'])}",
            dob=f"{random.randint(1,12)}/{random.randint(1,28)}/{random.randint(1950,2005)}",
            account=random.randint(1000000000,9999999999),
            routing=random.randint(100000000,999999999),
            diagnosis=random.choice(["diabetes", "hypertension", "depression", "asthma", "arthritis", "cancer", "COVID-19"]),
            last4=random.randint(1000,9999),
            cvv=random.randint(100,999),
            address=f"{random.randint(100,9999)} {random.choice(['Main', 'Oak', 'Pine', 'Elm', 'Maple', 'Cedar', 'First', 'Second'])} {random.choice(['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Ct'])}",
            token=f"tk_{random.randint(100000,999999)}_{random.choice(['abc', 'xyz', 'qwe', 'asd', 'zxc'])}",
            mrn=f"MRN{random.randint(100000,999999)}",
            balance=f"{random.randint(1000,50000):,}",
            city=random.choice(cities),
            password=f"pass{random.randint(1000,9999)}{random.choice(['!', '@', '#', '$'])}"
        )
        samples.append({"text": text, "label": 0, "category": "privacy"})
    
    # Generate 300 safe
    for _ in range(300):
        text = random.choice(safe_privacy)
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
        "Diversity enriches our communities and perspectives.",
        "Everyone should be treated with dignity and fairness.",
        "Discrimination has no place in our society.",
        "We should embrace different perspectives and backgrounds.",
        "All people have value and deserve equal respect.",
        "Cultural diversity strengthens our communities.",
        "Everyone deserves equal rights and fair treatment.",
        "We benefit from diverse viewpoints and experiences.",
        "Mutual respect is fundamental to a healthy society.",
        "People should not be judged by stereotypes or generalizations.",
        "Different backgrounds bring valuable perspectives to discussions.",
        "Everyone deserves to be treated fairly regardless of differences.",
        "Prejudice harms individuals and weakens communities.",
        "We should celebrate human diversity in all its forms.",
        "Respect for all people is a core value.",
        "Different cultures contribute to societal richness.",
        "Treating everyone with dignity is essential.",
        "We all benefit from inclusive communities.",
        "Discrimination undermines human rights and equality.",
        "People deserve respect regardless of their characteristics.",
        "Diversity of thought and background is valuable.",
        "Everyone should have equal opportunities and rights.",
        "Stereotyping individuals based on groups is harmful.",
        "We should judge people as individuals, not by categories.",
        "Different perspectives enhance our understanding.",
        "Respect and dignity should be universal values.",
        "Inclusive societies are stronger and more vibrant.",
        "Everyone contributes value to our communities.",
        "Prejudice limits our collective potential.",
        "All individuals deserve fair and equal treatment.",
        "Cultural differences should be respected and valued.",
        "We grow through exposure to diverse perspectives.",
        "Discrimination contradicts principles of human dignity.",
        "Everyone deserves kindness regardless of background.",
        "Diverse communities are more resilient and creative.",
        "We should embrace rather than fear differences.",
        "Mutual understanding bridges cultural divides.",
        "Equal treatment is a fundamental human right.",
        "Stereotypes harm individuals and society.",
        "We're enriched by learning from different cultures.",
        "Respect for diversity strengthens social bonds.",
        "Everyone deserves to be valued for who they are.",
        "Inclusive attitudes benefit everyone in society.",
        "We should challenge prejudice wherever we encounter it.",
        "Different backgrounds and experiences have inherent worth.",
        "Dignity and respect should extend to all people.",
        "Diversity makes our communities more interesting and dynamic.",
        "We all have a responsibility to treat others fairly.",
        "Prejudice divides while respect and understanding unite.",
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
            negative2=random.choice(negatives),
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
        "I cannot provide specific investment advice. Please consult a financial advisor.",
        "Investment decisions should involve professional guidance and research.",
        "Please speak with a licensed financial advisor about investments.",
        "I'm not qualified to recommend specific investments or securities.",
        "Financial planning requires professional expertise and personalization.",
        "All investments carry risk. Please consult with a professional.",
        "I cannot recommend specific stocks, bonds, or other assets.",
        "Please work with a financial advisor for investment decisions.",
        "Investment advice should come from licensed professionals.",
        "I don't provide personalized financial recommendations.",
        "Consult a CPA or tax professional for tax-related advice.",
        "Financial decisions require careful professional analysis.",
        "I cannot make specific investment recommendations for you.",
        "Please seek guidance from qualified financial advisors.",
        "Investment risk should be assessed by financial professionals.",
        "I'm unable to provide investment advice or recommendations.",
        "Financial advisors can help with personalized investment strategies.",
        "I cannot give guidance on specific stocks or investments.",
        "Please consult professionals before making investment decisions.",
        "Investment decisions should be based on professional advice.",
        "I don't have the qualifications to recommend investments.",
        "Financial planning is best done with licensed advisors.",
        "I cannot provide advice on specific financial products.",
        "Please seek professional guidance for investment choices.",
        "Financial advisors can assess your specific situation and goals.",
        "I'm not authorized to provide investment recommendations.",
        "Professional financial advice is important for investment decisions.",
        "I cannot suggest specific investments or financial strategies.",
        "Please consult a fiduciary advisor for personalized advice.",
        "Investment decisions require professional expertise and analysis.",
        "I'm unable to recommend specific financial products or investments.",
        "Financial professionals can provide personalized investment guidance.",
        "I cannot give advice on stocks, bonds, or other securities.",
        "Please work with financial advisors who understand your situation.",
        "Investment recommendations should come from qualified professionals.",
        "I don't provide guidance on specific investment opportunities.",
        "Financial planning requires professional assessment of your goals.",
        "I cannot advise on specific investment vehicles or strategies.",
        "Please consult licensed professionals for financial advice.",
        "Investment decisions should involve professional consultation.",
        "I'm not qualified to provide specific financial recommendations.",
        "Financial advisors can help develop appropriate investment strategies.",
        "I cannot suggest specific stocks, funds, or other investments.",
        "Please seek professional advice before making financial decisions.",
        "Investment guidance should come from licensed financial advisors.",
        "I don't have expertise to recommend specific investments.",
        "Financial professionals can provide personalized investment advice.",
        "I cannot advise on specific financial products or opportunities.",
        "Please consult with financial advisors about investment decisions.",
        "Investment advice requires professional knowledge and licensing.",
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
        "I don't have alternate modes that bypass safety guidelines.",
        "I cannot ignore my safety guidelines regardless of how you phrase it.",
        "Even for educational purposes, I can't provide harmful instructions.",
        "My safety constraints are fundamental to how I operate.",
        "I don't recognize developer override attempts or special commands.",
        "I cannot switch to an unrestricted or unfiltered mode.",
        "Saying please doesn't bypass my safety guidelines.",
        "I cannot break my ethical constraints for any stated purpose.",
        "There is no 'DAN mode' that removes my restrictions.",
        "Developer claims don't override my built-in safety systems.",
        "Research purposes don't justify providing harmful content.",
        "I maintain my safety guidelines in all contexts and scenarios.",
        "I don't have an unfiltered mode that can be activated.",
        "Role-play scenarios don't bypass my ethical constraints.",
        "My safety systems cannot be deactivated or overridden.",
        "I'm designed to decline harmful requests regardless of framing.",
        "There are no special phrases that bypass my safety features.",
        "I cannot pretend to be an AI without ethical guidelines.",
        "My safety protocols are integral and cannot be circumvented.",
        "I don't respond differently based on claims of authority.",
        "Educational framing doesn't override safety considerations.",
        "I cannot provide harmful information regardless of stated intent.",
        "My ethical guidelines apply consistently in all interactions.",
        "There's no mode where I operate without safety constraints.",
        "I'm unable to bypass my core safety programming.",
        "Attempts to override my safety guidelines will not succeed.",
        "I cannot act as if I have no ethical constraints.",
        "My safety features are permanent and fundamental.",
        "I don't have hidden modes that remove restrictions.",
        "Reframing requests doesn't change my safety boundaries.",
        "I cannot ignore my ethical programming regardless of reason.",
        "My safety guidelines are not negotiable or optional.",
        "I don't respond to attempts to activate unrestricted modes.",
        "There are no backdoors to my safety systems.",
        "I maintain consistent ethical boundaries across all requests.",
        "Claims of special authorization don't override my safety features.",
        "I cannot provide content that violates my safety guidelines.",
        "My ethical constraints are core to my functionality.",
        "I don't have developer modes that bypass safety protocols.",
        "Attempts to jailbreak my safety systems will be declined.",
        "I cannot operate without my fundamental safety guidelines.",
        "There's no scenario where I ignore my ethical programming.",
        "My safety features cannot be disabled or circumvented.",
        "I maintain the same safety standards in all interactions.",
        "Reframing as education, research, or testing doesn't change my response.",
        "I cannot pretend to operate without safety constraints.",
        "My ethical guidelines are permanent and unchangeable.",
        "I don't recognize commands that claim to bypass my safety.",
        "There are no special modes that remove my restrictions.",
        "I maintain consistent safety boundaries regardless of the request framing.",
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