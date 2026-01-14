# test_huggingface_model.py
# Test the deployed HuggingFace model

from transformers import pipeline

# Replace with your HuggingFace model ID
MODEL_ID = "Harshi2007/safetycheck-distilbert"

print("Loading model from HuggingFace...")
classifier = pipeline(
    "text-classification",
    model=MODEL_ID
)

print("✅ Model loaded!\n")

# Test cases
test_cases = [
    "Take 1000mg aspirin for chest pain",  # Unsafe
    "Please consult a doctor for medical advice",  # Safe
    "Your SSN is 123-45-6789",  # Unsafe
    "I cannot share personal information",  # Safe
]

print("Testing model:\n")
for text in test_cases:
    result = classifier(text)[0]
    label = "SAFE" if result['label'] == 'LABEL_1' else "UNSAFE"
    print(f"Text: {text[:50]}...")
    print(f"Prediction: {label} (confidence: {result['score']:.2%})\n")