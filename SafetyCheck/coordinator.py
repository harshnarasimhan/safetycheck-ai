# coordinator.py
# Test Coordinator - Orchestrates the entire safety testing workflow

import os
import time
from datetime import datetime
from typing import Dict, List

from test_generator import TestGeneratorAgent
from judge_agent import JudgeAgent
from model_client import ModelClient


class TestCoordinator:
    """Coordinates the entire safety testing workflow"""
    
    def __init__(self, api_key: str = None, use_finetuned: bool = False):
        """
        Initialize coordinator with all agents
        
        Args:
            api_key: API key for LLM services (optional, reads from env)
            use_finetuned: Whether to use fine-tuned judge
        """
        
        # Store the test API key for target model
        self.test_api_key = api_key
        
        # PREFER GROQ for backend (judge + generator) - free and unlimited!
        groq_key = os.getenv("GROQ_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")
        
        if groq_key:
            print(f"✅ Using Groq for backend (judge + generator): {groq_key[:15]}...")
            
            # Initialize judge with Groq
            self.judge = JudgeAgent(
                api_key=groq_key,
                model="llama-3.3-70b-versatile",
                use_finetuned=use_finetuned
            )
            
            # Initialize generator with Groq
            self.generator = TestGeneratorAgent(
                api_key=groq_key,
                model="llama-3.3-70b-versatile"
            )
            
            print("✅ Backend using Groq (free + unlimited!)")
            
        elif openai_key:
            print(f"⚠️  Groq not available, falling back to OpenAI: {openai_key[:15]}...")
            print("   WARNING: OpenAI has strict rate limits (3 requests/min)")
            print("   Get free Groq key at: https://console.groq.com")
            
            # Initialize judge with OpenAI
            self.judge = JudgeAgent(
                api_key=openai_key,
                model="gpt-4o-mini",
                use_finetuned=use_finetuned
            )
            
            # Initialize generator with OpenAI
            self.generator = TestGeneratorAgent(
                api_key=openai_key,
                model="gpt-4o-mini"
            )
            
        else:
            raise ValueError(
                "No API key provided for backend. Please set GROQ_API_KEY or OPENAI_API_KEY "
                "environment variables.\n"
                "Get free Groq API key at: https://console.groq.com"
            )
        
        print("✅ Test Coordinator initialized")
    
    def run_safety_test(
        self,
        user_config: Dict,
        num_tests: int = 20,
        quick_mode: bool = False
    ) -> Dict:
        """
        Run complete safety test workflow
        
        Args:
            user_config: User configuration (model, industry, etc.)
            num_tests: Number of test cases to generate
            quick_mode: Use pre-defined tests (faster)
        
        Returns:
            Complete test results with summary
        """
        
        test_run_id = f"test_{int(time.time())}"
        start_time = time.time()
        
        print(f"\n{'='*70}")
        print(f"🚀 STARTING SAFETY TEST: {test_run_id}")
        print(f"{'='*70}")
        print(f"Test type: {user_config.get('test_type', 'unknown').upper()}")
        print(f"Industry: {user_config.get('industry', 'general')}")
        print(f"Number of tests: {num_tests}")
        print(f"Quick mode: {quick_mode}")
        print(f"{'='*70}\n")
        
        try:
            # Step 1: Generate test cases
            print("📝 Step 1: Generating test cases...")
            
            if quick_mode:
                test_cases = self.generator.generate_quick_tests(
                    industry=user_config.get('industry', 'general'),
                    num_tests=num_tests
                )
            else:
                test_cases = self.generator.generate_tests(
                    industry=user_config.get('industry', 'general'),
                    use_case=user_config.get('use_case', 'chatbot'),
                    num_tests=num_tests
                )
            
            print(f"   ✅ Generated {len(test_cases)} test cases\n")
            
            # Step 2: Initialize target model
            print("🎯 Step 2: Initializing target model...")
            
            test_type = user_config.get('test_type', 'base_model')
            
            if test_type == 'base_model':
                # Base model testing - THIS IS THE MODEL BEING TESTED
                provider = user_config.get('model_provider', 'groq')
                model_name = user_config.get('model_name', 'llama-3.3-70b-versatile')
                
                # Use the API key from config or test_api_key
                api_key = user_config.get('api_key') or self.test_api_key
                
                # Convert temperature and max_tokens to proper types
                try:
                    temperature = float(user_config.get('temperature', 0.7))
                except (ValueError, TypeError):
                    temperature = 0.7
                
                try:
                    max_tokens = int(user_config.get('max_tokens', 2000))
                except (ValueError, TypeError):
                    max_tokens = 2000
                
                target_model = ModelClient(
                    provider=provider,
                    model_name=model_name,
                    api_key=api_key,
                    system_prompt=user_config.get('system_prompt', 'You are a helpful assistant.'),
                    temperature=temperature,
                    max_tokens=max_tokens
                )
                
                actual_model = target_model.get_model_name()
            
            elif test_type == 'application':
                # Application testing
                endpoint = user_config.get('application_endpoint')
                api_key = user_config.get('application_api_key')
                
                target_model = ModelClient(
                    provider='custom',
                    model_name='custom-application',
                    api_key=api_key,
                    endpoint=endpoint
                )
                
                actual_model = target_model.get_model_name()
            
            else:
                raise ValueError(f"Unknown test_type: {test_type}")
            
            print(f"   ✅ Target model being tested: {actual_model}\n")
            
            # Step 3: Query target model
            print("💬 Step 3: Querying target model...")
            
            responses = []
            for i, test_case in enumerate(test_cases, 1):
                print(f"   Querying {i}/{len(test_cases)}...", end="\r")
                
                try:
                    response = target_model.query(test_case['prompt'])
                    
                    responses.append({
                        'prompt': test_case['prompt'],
                        'response': response,
                        'context': test_case.get('context', ''),
                        'category': test_case.get('category', 'general')
                    })
                except Exception as e:
                    print(f"\n   ⚠️  Error querying test {i}: {e}")
                    responses.append({
                        'prompt': test_case['prompt'],
                        'response': f"ERROR: {str(e)}",
                        'context': test_case.get('context', ''),
                        'category': test_case.get('category', 'general')
                    })
            
            print(f"   ✅ Collected {len(responses)} responses" + " "*20 + "\n")
            
            # Step 4: Evaluate responses
            print("⚖️  Step 4: Evaluating responses with Judge Agent...")
            
            evaluations = self.judge.evaluate_batch(
                test_cases=responses,
                industry=user_config.get('industry', 'general')
            )
            
            print()
            
            # Step 5: Calculate summary statistics
            print("📊 Step 5: Calculating statistics...")
            
            summary = self._calculate_summary(evaluations)
            
            duration = time.time() - start_time
            
            # Create result object
            result = {
                "test_run_id": test_run_id,
                "status": "complete",
                "test_type": user_config.get('test_type', 'unknown').upper(),
                "actual_model": actual_model,
                "timestamp": datetime.now().isoformat(),
                "duration_seconds": duration,
                "config": user_config,
                "summary": summary,
                "results": evaluations
            }
            
            print(f"\n{'='*70}")
            print(f"✅ TEST COMPLETE: {test_run_id}")
            print(f"{'='*70}")
            print(f"Test Type: {result['test_type']}")
            print(f"Actual Model: {actual_model}")
            print(f"Duration: {duration:.1f} seconds")
            print(f"Total tests: {summary['total_tests']}")
            print(f"Safe: {summary['safe_count']} ({summary['safe_percentage']:.1f}%)")
            print(f"Unsafe: {summary['unsafe_count']} ({summary['unsafe_percentage']:.1f}%)")
            print(f"Average score: {summary['average_score']:.2f}")
            print(f"{'='*70}\n")
            
            return result
            
        except Exception as e:
            import traceback
            print("\n" + "="*70)
            print("❌ ERROR IN run_safety_test")
            print("="*70)
            traceback.print_exc()
            print("="*70 + "\n")
            
            return {
                "test_run_id": test_run_id,
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "duration_seconds": time.time() - start_time,
                "config": user_config
            }
    
    def _calculate_summary(self, evaluations: List[Dict]) -> Dict:
        """Calculate summary statistics from evaluations"""
        
        total_tests = len(evaluations)
        safe_count = sum(1 for e in evaluations if e.get('evaluation', {}).get('safe', False))
        unsafe_count = total_tests - safe_count
        
        # Calculate percentages
        safe_percentage = (safe_count / total_tests * 100) if total_tests > 0 else 0
        unsafe_percentage = (unsafe_count / total_tests * 100) if total_tests > 0 else 0
        
        # Calculate average score
        scores = [e.get('evaluation', {}).get('score', 0) for e in evaluations]
        average_score = sum(scores) / len(scores) if scores else 0
        
        # Group by category
        by_category = {}
        for evaluation in evaluations:
            category = evaluation.get('evaluation', {}).get('category', 'general')
            if category not in by_category:
                by_category[category] = {'total': 0, 'safe': 0, 'unsafe': 0}
            
            by_category[category]['total'] += 1
            if evaluation.get('evaluation', {}).get('safe', False):
                by_category[category]['safe'] += 1
            else:
                by_category[category]['unsafe'] += 1
        
        # Group by severity
        by_severity = {}
        for evaluation in evaluations:
            if not evaluation.get('evaluation', {}).get('safe', False):
                severity = evaluation.get('evaluation', {}).get('severity', 'unknown')
                by_severity[severity] = by_severity.get(severity, 0) + 1
        
        return {
            "total_tests": total_tests,
            "safe_count": safe_count,
            "unsafe_count": unsafe_count,
            "safe_percentage": safe_percentage,
            "unsafe_percentage": unsafe_percentage,
            "average_score": average_score,
            "by_category": by_category,
            "by_severity": by_severity
        }


# Test coordinator
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    print("="*70)
    print("TESTING COORDINATOR")
    print("="*70)
    
    # Test configuration - testing Groq Llama
    test_config = {
        "test_type": "base_model",
        "industry": "healthcare",
        "use_case": "chatbot",
        "model_provider": "groq",
        "model_name": "llama-3.3-70b-versatile",
        "api_key": os.getenv("GROQ_API_KEY"),
        "system_prompt": "You are a helpful healthcare assistant.",
        "temperature": 0.7,
        "max_tokens": 2000
    }
    
    coordinator = TestCoordinator()
    
    result = coordinator.run_safety_test(
        user_config=test_config,
        num_tests=3,
        quick_mode=True
    )
    
    print("\n📊 RESULTS:")
    print(f"Test ID: {result['test_run_id']}")
    print(f"Status: {result['status']}")
    if result['status'] == 'complete':
        print(f"Safe: {result['summary']['safe_count']}/{result['summary']['total_tests']}")
    print("="*70)