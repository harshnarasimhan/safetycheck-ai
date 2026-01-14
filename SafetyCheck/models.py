# models.py

from pydantic import BaseModel, SecretStr, Field, validator
from typing import Literal, List, Optional

class UserContext(BaseModel):
    """User's AI model configuration for testing"""
    
    # Context information
    industry: Literal["healthcare", "finance"] = Field(
        description="Industry context for testing",
        example="healthcare"
    )
    
    use_case: Literal["chatbot", "content_gen", "analysis", "assistant"] = Field(
        description="How the AI is being used",
        example="chatbot"
    )
    
    # Model configuration
    model_provider: Literal["openai", "anthropic", "groq", "custom"] = Field(
        description="AI model provider",
        example="openai"
    )
    
    model_name: str = Field(
        description="Specific model name",
        example="gpt-4"
    )
    
    api_key: SecretStr = Field(
        description="User's API key (never stored, used only during test)"
    )
    
    api_endpoint: Optional[str] = Field(
        default=None,
        description="Custom API endpoint for self-hosted models"
    )
    
    # Advanced settings
    system_prompt: str = Field(
        default="You are a helpful AI assistant.",
        description="System prompt for the model"
    )
    
    temperature: float = Field(
        default=0.7,
        ge=0.0,
        le=1.0,
        description="Temperature setting (0-1)"
    )
    
    max_tokens: int = Field(
        default=1000,
        ge=100,
        le=4000,
        description="Maximum tokens per response"
    )
    
    # Application details
    has_rag: bool = Field(
        default=False,
        description="Does the AI use RAG?"
    )
    
    rag_description: Optional[str] = Field(
        default=None,
        description="Description of RAG data source"
    )
    
    handles_pii: bool = Field(
        default=False,
        description="Does the AI handle personal information?"
    )
    
    regulatory_requirements: List[str] = Field(
        default=[],
        description="Applicable regulations (e.g., HIPAA, SEC)"
    )
    
    @validator('api_key')
    def validate_api_key(cls, v):
        """Ensure API key looks valid"""
        key = v.get_secret_value()
        
        if len(key) < 10:
            raise ValueError("API key seems too short")
        
        return v
    
    @validator('rag_description')
    def validate_rag_description(cls, v, values):
        """Require RAG description if has_rag is True"""
        if values.get('has_rag') and not v:
            raise ValueError("Please describe your RAG data source")
        return v

    class Config:
        # This shows an example in the auto-generated API docs
        json_schema_extra = {
            "example": {
                "industry": "healthcare",
                "use_case": "chatbot",
                "model_provider": "openai",
                "model_name": "gpt-4",
                "api_key": "sk-proj-abc123...",
                "system_prompt": "You are a healthcare assistant.",
                "temperature": 0.7,
                "max_tokens": 1000,
                "has_rag": True,
                "rag_description": "Hospital policy database",
                "handles_pii": True,
                "regulatory_requirements": ["HIPAA", "HITECH"]
            }
        }


class APIKeyValidationRequest(BaseModel):
    """Request to validate API key"""
    provider: Literal["openai", "anthropic", "groq", "custom"]
    model_name: str
    api_key: str
    endpoint: Optional[str] = None


class APIKeyValidationResponse(BaseModel):
    """Response from API key validation"""
    valid: bool
    message: str