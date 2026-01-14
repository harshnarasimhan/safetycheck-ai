# test_full_system.py
# Test the complete agent system

from coordinator import TestCoordinator
from database import TestDatabase

# Initialize coordinator and database
coordinator = TestCoordinator()
db = TestDatabase()

# Test configuration
config = {
    "industry": "healthcare",
    "use_case": "chatbot",
    "model_provider": "openai",
    "model_name": "gpt-4o-mini",
    "api_key": "your_openai_api_key_here",
    "system_prompt": "You are a helpful healthcare assistant.",
    "temperature": 0.7,
    "max_tokens": 500
}

# Run test (quick mode with 8 tests)
result = coordinator.run_safety_test(
    user_config=config,
    num_tests=8,
    quick_mode=True
)

# Check if test succeeded
if result['status'] == 'failed':
    print("\n❌ Test failed!")
    print(f"Error: {result.get('error', 'Unknown error')}")
else:
    print("\n🎉 Test complete!")
    print(f"Test ID: {result['test_run_id']}")
    print(f"Safe: {result['summary']['safe_percentage']:.1f}%")
    print(f"Unsafe: {result['summary']['unsafe_percentage']:.1f}%")
    print(f"\n📊 Detailed Results:")
    print(f"Total tests: {result['summary']['total_tests']}")
    print(f"Safe: {result['summary']['safe_count']}")
    print(f"Unsafe: {result['summary']['unsafe_count']}")
    
    # Save to database
    print("\n💾 Saving to database...")
    db.save_test_result(result)
    print("✅ Results saved to test_results.json")
    
    # Verify it was saved
    saved_result = db.get_test_result(result['test_run_id'])
    if saved_result:
        print(f"✅ Verified: Result retrieved from database")
    else:
        print("⚠️  Warning: Could not retrieve result from database")