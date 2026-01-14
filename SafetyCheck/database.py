# database.py
# Simple database for storing test results

import json
import os
from datetime import datetime
from typing import Dict, List, Optional

class TestDatabase:
    """Simple JSON-based database for test results"""
    
    def __init__(self, db_path: str = "test_results.json"):
        """Initialize database"""
        self.db_path = db_path
        self._ensure_db_exists()
    
    def _ensure_db_exists(self):
        """Create database file if it doesn't exist"""
        if not os.path.exists(self.db_path):
            with open(self.db_path, 'w') as f:
                json.dump([], f)
    
    def save_test_result(self, result: Dict) -> bool:
        """Save a test result"""
        try:
            # Load existing results
            with open(self.db_path, 'r') as f:
                results = json.load(f)
            
            # Add new result
            results.append(result)
            
            # Save back
            with open(self.db_path, 'w') as f:
                json.dump(results, f, indent=2)
            
            return True
        except Exception as e:
            print(f"Error saving result: {e}")
            return False
    
    def get_test_result(self, test_run_id: str) -> Optional[Dict]:
        """Get a specific test result"""
        try:
            with open(self.db_path, 'r') as f:
                results = json.load(f)
            
            for result in results:
                if result.get('test_run_id') == test_run_id:
                    return result
            
            return None
        except:
            return None
    
    def get_all_results(self) -> List[Dict]:
        """Get all test results"""
        try:
            with open(self.db_path, 'r') as f:
                return json.load(f)
        except:
            return []
    
    def get_recent_results(self, limit: int = 10) -> List[Dict]:
        """Get recent test results"""
        results = self.get_all_results()
        return sorted(
            results,
            key=lambda x: x.get('timestamp', ''),
            reverse=True
        )[:limit]