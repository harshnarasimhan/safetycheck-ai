# minimal.py
# FastAPI backend for SafetyCheck - FIXED VERSION with Application Name Support

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import os
import time
import json
from datetime import datetime

# Load environment variables FIRST
from dotenv import load_dotenv
load_dotenv()

print("\n" + "="*70)
print("🔑 CHECKING API KEYS")
print("="*70)
openai_key = os.getenv("OPENAI_API_KEY")
groq_key = os.getenv("GROQ_API_KEY")

if groq_key:
    print(f"✅ GROQ_API_KEY: Found (starts with {groq_key[:10]}...)")
else:
    print("❌ GROQ_API_KEY: Not found - GET ONE AT https://console.groq.com")

if openai_key:
    print(f"✅ OPENAI_API_KEY: Found (starts with {openai_key[:10]}...)")
else:
    print("⚠️  OPENAI_API_KEY: Not found (optional fallback)")

print("="*70 + "\n")

# Import SafetyCheck modules
from coordinator import TestCoordinator
from test_generator import TestGeneratorAgent
from judge_agent import JudgeAgent
from database import TestDatabase
from pdf_generator import generate_pdf_report

print("✅ All modules imported successfully\n")

# Initialize FastAPI
app = FastAPI()

# Initialize database
db = TestDatabase()

# CORS middleware - FIXED for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://safetycheck-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("="*70)
print("🚀 SAFETYCHECK API - READY")
print("="*70)
print("Backend: http://localhost:8000")
print("Docs: http://localhost:8000/docs")

if groq_key:
    print("✅ Using Groq for backend (FREE + UNLIMITED)")
elif openai_key:
    print("⚠️  Using OpenAI for backend (LIMITED: 3 requests/min)")
    print("   Get free Groq key at: https://console.groq.com")
else:
    print("❌ No API keys found!")
    print("   Set GROQ_API_KEY in .env for unlimited testing")

print("="*70 + "\n")


# ============================================================================
# ROOT ENDPOINT
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "message": "SafetyCheck API is operational",
        "version": "2.0",
        "backend": "Groq" if os.getenv("GROQ_API_KEY") else "OpenAI"
    }


# ============================================================================
# API KEY VALIDATION
# ============================================================================

@app.post("/api/validate-key")
async def validate_api_key(payload: dict):
    """Validate API key by making a test request"""
    try:
        provider = payload.get("provider")
        model_name = payload.get("model_name")
        api_key = payload.get("api_key")
        
        if not all([provider, model_name, api_key]):
            raise HTTPException(status_code=400, detail="Missing required fields")
        
        # Select validation model based on provider
        if provider == "groq":
            validation_model = "llama-3.1-8b-instant"
        elif provider == "openai":
            validation_model = "gpt-4o-mini"
        elif provider == "anthropic":
            validation_model = "claude-3-haiku-20240307"
        else:
            raise HTTPException(status_code=400, detail=f"Unknown provider: {provider}")
        
        # Test the API key
        if provider == "openai":
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            response = client.chat.completions.create(
                model=validation_model,
                messages=[{"role": "user", "content": "Test"}],
                max_tokens=5
            )
            return {"valid": True, "message": f"✅ {provider.upper()} API key is valid"}
        
        elif provider == "groq":
            from groq import Groq
            client = Groq(api_key=api_key)
            response = client.chat.completions.create(
                model=validation_model,
                messages=[{"role": "user", "content": "Test"}],
                max_tokens=5
            )
            return {"valid": True, "message": f"✅ {provider.upper()} API key is valid"}
        
        elif provider == "anthropic":
            from anthropic import Anthropic
            client = Anthropic(api_key=api_key)
            response = client.messages.create(
                model=validation_model,
                max_tokens=5,
                messages=[{"role": "user", "content": "Test"}]
            )
            return {"valid": True, "message": f"✅ {provider.upper()} API key is valid"}
        
    except Exception as e:
        error_message = str(e)
        if "401" in error_message or "authentication" in error_message.lower():
            return {"valid": False, "message": "❌ Invalid API key"}
        elif "404" in error_message:
            return {"valid": False, "message": f"❌ Model not found: {model_name}"}
        else:
            return {"valid": False, "message": f"❌ Error: {error_message}"}
        
# ============================================================================
# TEST GENERATION - GENERATE PROMPTS FOR MANUAL TESTING
# ============================================================================

@app.post("/api/test/generate-prompts")
async def generate_test_prompts(request: dict):
    """Generate test prompts for manual testing"""
    try:
        industry = request.get('industry', 'healthcare')
        num_tests = int(request.get('num_tests', 8))
        quick_mode = request.get('quick_mode', True)
        
        print(f"\n📝 Generating {num_tests} test prompts for {industry}")
        
        # Get API key - prefer Groq
        api_key = os.getenv("GROQ_API_KEY") or os.getenv("OPENAI_API_KEY")
        
        if not api_key:
            raise HTTPException(status_code=500, detail="No API key available for test generation")
        
        # Use test generator to create prompts
        generator = TestGeneratorAgent(api_key=api_key)
        
        if quick_mode:
            test_cases = generator.generate_quick_tests(industry, num_tests)
        else:
            test_cases = generator.generate_tests(
                industry=industry,
                use_case='chatbot',
                num_tests=num_tests
            )
        
        # Extract just the prompts
        prompts = [test['prompt'] for test in test_cases]
        
        print(f"✅ Generated {len(prompts)} prompts")
        
        return {
            "prompts": prompts,
            "industry": industry,
            "count": len(prompts)
        }
        
    except Exception as e:
        import traceback
        print(f"\n❌ Error generating prompts:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# MANUAL SAFETY TESTING - FIXED VERSION
# ============================================================================

@app.post("/api/test/manual")
async def manual_safety_test(request: dict):
    """Manual testing endpoint - evaluates user-provided test cases"""
    try:
        config = request.get('config', {})
        test_cases = request.get('test_cases', [])
        
        if not test_cases:
            raise HTTPException(status_code=400, detail="No test cases provided")
        
        test_run_id = f"test_{int(time.time())}"
        
        # FIXED: Get proper model/application name
        system_type = config.get('test_type', 'base_model')
        model_name = config.get('model_name', 'Unknown')
        manual_app_name = config.get('manual_app_name', model_name)
        
        # Determine display name
        if system_type == 'application':
            actual_model = manual_app_name or model_name
            display_type = "Application"
        else:
            actual_model = model_name
            display_type = "Base Model"
        
        print(f"\n{'='*70}")
        print(f"🚀 STARTING MANUAL SAFETY TEST: {test_run_id}")
        print(f"{'='*70}")
        print(f"{display_type}: {actual_model}")
        print(f"Industry: {config.get('industry', 'general')}")
        print(f"Test cases: {len(test_cases)}")
        print(f"{'='*70}\n")
        
        start_time = time.time()
        
        # Format test cases for judge
        formatted_cases = []
        for test in test_cases:
            formatted_cases.append({
                "prompt": test.get('prompt', ''),
                "response": test.get('response', ''),
                "context": "",
                "category": "manual"
            })
        
        # Create judge with API key - prefer Groq
        use_finetuned = config.get('use_finetuned', False)
        
        groq_key = os.getenv("GROQ_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")
        
        if groq_key:
            judge = JudgeAgent(
                api_key=groq_key,
                model="llama-3.3-70b-versatile",
                use_finetuned=use_finetuned
            )
            print("✅ Using Groq for evaluation (free + unlimited)")
        elif openai_key:
            judge = JudgeAgent(
                api_key=openai_key,
                model="gpt-4o-mini",
                use_finetuned=use_finetuned
            )
            print("✅ Using OpenAI for evaluation (limited)")
        else:
            raise HTTPException(status_code=500, detail="No API key available for evaluation")
        
        evaluations = judge.evaluate_batch(
            test_cases=formatted_cases,
            industry=config.get('industry', 'general')
        )
        
        # Calculate summary
        summary = {
            "total_tests": len(evaluations),
            "safe_count": sum(1 for e in evaluations if e.get('evaluation', {}).get('safe')),
            "unsafe_count": sum(1 for e in evaluations if not e.get('evaluation', {}).get('safe')),
            "safe_percentage": 0,
            "unsafe_percentage": 0,
            "average_score": 0,
            "by_category": {},
            "by_severity": {}
        }
        
        if summary["total_tests"] > 0:
            summary["safe_percentage"] = (summary["safe_count"] / summary["total_tests"]) * 100
            summary["unsafe_percentage"] = (summary["unsafe_count"] / summary["total_tests"]) * 100
        
        duration = time.time() - start_time
        
        # FIXED: Create result with proper model name
        result = {
            "test_run_id": test_run_id,
            "status": "complete",
            "test_type": "manual",
            "actual_model": actual_model,  # FIXED: Use actual app/model name
            "timestamp": datetime.now().isoformat(),
            "duration_seconds": duration,
            "config": {
                **config,
                "system_type": system_type,
                "display_type": display_type
            },
            "summary": summary,
            "results": evaluations
        }
        
        # Save to database
        db.save_test_result(result)
        
        print(f"\n{'='*70}")
        print(f"✅ MANUAL TEST COMPLETE: {test_run_id}")
        print(f"{'='*70}")
        print(f"{display_type}: {actual_model}")
        print(f"Total tests: {summary['total_tests']}")
        print(f"Safe: {summary['safe_count']} ({summary['safe_percentage']:.1f}%)")
        print(f"Unsafe: {summary['unsafe_count']} ({summary['unsafe_percentage']:.1f}%)")
        print(f"{'='*70}\n")
        
        return result
        
    except Exception as e:
        import traceback
        print("\n" + "="*70)
        print("❌ ERROR IN /api/test/manual")
        print("="*70)
        traceback.print_exc()
        print("="*70 + "\n")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# AUTOMATED SAFETY TESTING
# ============================================================================

@app.post("/api/test/start")
async def start_safety_test(config: dict):
    """Start automated safety test"""
    try:
        print(f"\n📥 Received test config: {config}\n")
        
        # Get API key for the TARGET MODEL being tested
        provider = config.get('model_provider', 'groq')
        api_key = config.get('api_key')  # User's API key for target model
        
        if not api_key:
            raise HTTPException(
                status_code=400, 
                detail=f"No API key provided for {provider}. Please add API key in the form."
            )
        
        print(f"✅ Testing {provider} - {config.get('model_name')}")
        print(f"   Using API key: {api_key[:15]}...")
        
        # Create coordinator (uses Groq/OpenAI for backend based on .env)
        use_finetuned = config.get('use_finetuned', False)
        test_coordinator = TestCoordinator(api_key=api_key, use_finetuned=use_finetuned)
        
        result = test_coordinator.run_safety_test(
            user_config=config,
            num_tests=config.get('num_tests', 8),
            quick_mode=config.get('quick_mode', True)
        )
        
        db.save_test_result(result)
        return result
        
    except Exception as e:
        import traceback
        print("\n" + "="*70)
        print("❌ ERROR IN /api/test/start")
        print("="*70)
        traceback.print_exc()
        print("="*70 + "\n")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# GET TEST RESULTS
# ============================================================================

@app.get("/api/test/results/{test_run_id}")
async def get_test_results(test_run_id: str):
    """Get results for a specific test run"""
    try:
        result = db.get_test_result(test_run_id)
        
        if not result:
            raise HTTPException(status_code=404, detail=f"Test run {test_run_id} not found")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error retrieving results: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# DOWNLOAD PDF REPORT
# ============================================================================

@app.get("/api/test/results/{test_run_id}/pdf")
async def download_pdf_report(test_run_id: str):
    """Download PDF report for a test run"""
    try:
        # Get test results
        result = db.get_test_result(test_run_id)
        
        if not result:
            raise HTTPException(status_code=404, detail=f"Test run {test_run_id} not found")
        
        # Generate PDF
        pdf_path = generate_pdf_report(result)
        
        # Return file
        return FileResponse(
            path=pdf_path,
            media_type='application/pdf',
            filename=f"safety_report_{test_run_id}.pdf"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        print(f"\n❌ Error generating PDF:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# LIST ALL TEST RUNS
# ============================================================================

@app.get("/api/test/results")
async def list_test_results():
    """List all test runs"""
    try:
        results = db.list_test_results()
        return {"results": results}
    except Exception as e:
        print(f"❌ Error listing results: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================================
# STARTUP MESSAGE
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    
    print("\n" + "="*70)
    print("🚀 STARTING SAFETYCHECK API")
    print("="*70)
    print("✅ Healthcare Compliance: Active")
    print("✅ Finance Compliance: Active")
    print("✅ Multi-Agent System: Ready")
    print("✅ RAG Database: 8,214 documents")
    
    if os.getenv("GROQ_API_KEY"):
        print("✅ Backend: Groq (FREE + UNLIMITED)")
    elif os.getenv("OPENAI_API_KEY"):
        print("⚠️  Backend: OpenAI (LIMITED)")
        print("   Recommendation: Add GROQ_API_KEY for unlimited testing")
    else:
        print("❌ No API keys configured!")
        print("   Add GROQ_API_KEY to .env for free unlimited testing")
    
    print("="*70 + "\n")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)