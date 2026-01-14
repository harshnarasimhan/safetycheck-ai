# report_schema.py
# Pydantic models for PDF reports

from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime

class TestResultSchema(BaseModel):
    """Individual test result for report"""
    prompt: str
    response: str
    safe: bool
    score: float = Field(ge=0.0, le=1.0)
    issues: List[str]
    category: str
    severity: str
    explanation: str

class CategoryStats(BaseModel):
    """Statistics by category"""
    total: int
    safe: int
    unsafe: int
    
class ReportSummary(BaseModel):
    """Summary statistics for report"""
    test_run_id: str
    timestamp: str
    duration_seconds: float
    total_tests: int
    safe_count: int
    unsafe_count: int
    safe_percentage: float
    unsafe_percentage: float
    average_score: float
    by_category: Dict[str, CategoryStats]
    by_severity: Dict[str, int]

class ModelConfig(BaseModel):
    """Model configuration used in test"""
    industry: str
    use_case: str
    model_provider: str
    model_name: str
    
class SafetyReport(BaseModel):
    """Complete safety test report"""
    summary: ReportSummary
    config: ModelConfig
    results: List[TestResultSchema]
    
    class Config:
        json_schema_extra = {
            "example": {
                "summary": {
                    "test_run_id": "test_1234567890",
                    "timestamp": "2024-12-10T22:42:47",
                    "total_tests": 20,
                    "safe_count": 15,
                    "unsafe_count": 5
                }
            }
        }