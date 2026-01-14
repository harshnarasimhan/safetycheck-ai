# mock_chatbot.py
# Mock healthcare chatbot for testing Application Mode
# This simulates a deployed chatbot with RAG, guardrails, and API authentication

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(title="MedBot Healthcare Chatbot")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# SIMULATED RAG DATABASE (Medical Knowledge)
# ============================================================================

MEDICAL_KNOWLEDGE = {
    "chest pain": "Chest pain can indicate serious conditions. Please seek immediate medical attention or call emergency services.",
    "headache": "For persistent headaches, consult your healthcare provider. OTC pain relievers may help temporarily.",
    "flu": "Common flu symptoms include fever, body aches, and fatigue. Rest and fluids help. See a doctor if symptoms worsen.",
    "fever": "High fever (103°F+) or fever lasting 3+ days requires medical attention.",
    "cough": "Persistent cough may indicate infection. Consult a doctor if it lasts more than 2 weeks.",
}

# ============================================================================
# SAFETY GUARDRAILS
# ============================================================================

UNSAFE_KEYWORDS = [
    "prescribe", "prescription", "medication dosage", "diagnosis", 
    "patient record", "medical record", "ssn", "social security",
    "patient id", "personal information"
]

def check_safety(text: str) -> tuple:
    """Check if request is safe"""
    text_lower = text.lower()
    
    for keyword in UNSAFE_KEYWORDS:
        if keyword in text_lower:
            return False, keyword
    
    return True, ""

def get_rag_context(query: str) -> str:
    """Get medical info from knowledge base"""
    query_lower = query.lower()
    
    for keyword, info in MEDICAL_KNOWLEDGE.items():
        if keyword in query_lower:
            return info
    
    return "I provide general health information. For medical advice, please consult a healthcare professional."

# ============================================================================
# API MODELS
# ============================================================================

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 500

class ChatResponse(BaseModel):
    choices: List[dict]

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.post("/v1/chat/completions")
async def chat_completion(
    request: ChatRequest,
    authorization: Optional[str] = Header(None)
):
    """
    MedBot Chat Endpoint
    Simulates a real healthcare chatbot with:
    - API key authentication
    - RAG knowledge retrieval
    - Safety guardrails
    - Business logic
    """
    
    # 1. AUTHENTICATE
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing API key")
    
    api_key = authorization.replace("Bearer ", "")
    
    # Valid API keys for testing
    valid_keys = ["test-key", "mb_test_123", "demo-key"]
    if api_key not in valid_keys:
        raise HTTPException(status_code=403, detail="Invalid API key")
    
    # 2. GET USER MESSAGE
    user_message = ""
    for msg in reversed(request.messages):
        if msg.role == "user":
            user_message = msg.content
            break
    
    if not user_message:
        raise HTTPException(status_code=400, detail="No user message found")
    
    # 3. SAFETY CHECK (Guardrails)
    is_safe, unsafe_reason = check_safety(user_message)
    
    if not is_safe:
        # Guardrail blocked the request
        response_text = f"I apologize, but I cannot assist with requests involving {unsafe_reason}. Please consult a healthcare professional directly."
    else:
        # 4. RAG RETRIEVAL
        rag_context = get_rag_context(user_message)
        
        # 5. GENERATE RESPONSE (with safety disclaimer)
        response_text = f"{rag_context}\n\nNote: This is general information only. Always consult your healthcare provider for medical advice."
    
    # 6. RETURN RESPONSE
    return ChatResponse(
        choices=[{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": response_text
            },
            "finish_reason": "stop"
        }]
    )

@app.get("/")
async def root():
    """Application info"""
    return {
        "name": "MedBot",
        "version": "1.0",
        "description": "Healthcare chatbot with RAG and safety guardrails",
        "endpoint": "/v1/chat/completions",
        "authentication": "Bearer token required",
        "valid_test_keys": ["test-key", "mb_test_123", "demo-key"]
    }

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy"}

# ============================================================================
# RUN SERVER
# ============================================================================

if __name__ == "__main__":
    print("="*70)
    print("🏥 MEDBOT - HEALTHCARE CHATBOT APPLICATION")
    print("="*70)
    print("\n🚀 Starting on: http://localhost:8001")
    print("\n✨ Features:")
    print("   ✅ Medical knowledge RAG")
    print("   ✅ Safety guardrails")
    print("   ✅ API authentication")
    print("\n🔑 Valid API Keys for Testing:")
    print("   - test-key")
    print("   - mb_test_123")
    print("   - demo-key")
    print("\n🔗 Endpoint: http://localhost:8001/v1/chat/completions")
    print("\n" + "="*70 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8001)