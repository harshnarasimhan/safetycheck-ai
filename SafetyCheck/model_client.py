# model_client.py
# Model Client - Handles communication with different AI model providers

import os
from typing import Dict, Optional


class ModelClient:
    """Client for querying different AI model providers"""
    
    def __init__(
        self,
        provider: str,
        model_name: str,
        api_key: str,
        system_prompt: str = "You are a helpful assistant.",
        temperature: float = 0.7,
        max_tokens: int = 500,
        endpoint: Optional[str] = None
    ):
        """
        Initialize model client
        
        Args:
            provider: Provider name (openai, groq, anthropic, custom)
            model_name: Model identifier
            api_key: API key for the provider
            system_prompt: System prompt for the model
            temperature: Sampling temperature
            max_tokens: Maximum tokens in response
            endpoint: Custom endpoint URL (for custom provider)
        """
        self.provider = provider.lower()
        self.model_name = model_name
        self.api_key = api_key
        self.system_prompt = system_prompt
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.endpoint = endpoint
        
        print(f"🔧 Initializing ModelClient: {provider} - {model_name}")
        
        # Initialize client based on provider
        if self.provider == 'openai':
            from openai import OpenAI
            self.client = OpenAI(api_key=api_key)
            print(f"   ✅ OpenAI client initialized")
            
        elif self.provider == 'groq':
            from groq import Groq
            self.client = Groq(api_key=api_key)
            print(f"   ✅ Groq client initialized")
            
        elif self.provider == 'anthropic':
            from anthropic import Anthropic
            self.client = Anthropic(api_key=api_key)
            print(f"   ✅ Anthropic client initialized")
            
        elif self.provider == 'custom':
            import requests
            self.client = requests
            if not endpoint:
                raise ValueError("Custom provider requires endpoint URL")
            print(f"   ✅ Custom client initialized (endpoint: {endpoint})")
            
        else:
            raise ValueError(f"Unknown provider: {provider}")
    
    def query(self, prompt: str) -> str:
        """
        Query the model with a prompt
        
        Args:
            prompt: User prompt
        
        Returns:
            Model response as string
        """
        try:
            if self.provider == 'openai':
                return self._query_openai(prompt)
            elif self.provider == 'groq':
                return self._query_groq(prompt)
            elif self.provider == 'anthropic':
                return self._query_anthropic(prompt)
            elif self.provider == 'custom':
                return self._query_custom(prompt)
            else:
                raise ValueError(f"Unknown provider: {self.provider}")
                
        except Exception as e:
            print(f"❌ Error querying {self.provider}: {e}")
            raise
    
    def _query_openai(self, prompt: str) -> str:
        """Query OpenAI API"""
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=self.temperature,
            max_tokens=self.max_tokens
        )
        return response.choices[0].message.content
    
    def _query_groq(self, prompt: str) -> str:
        """Query Groq API"""
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": prompt}
            ],
            temperature=self.temperature,
            max_tokens=self.max_tokens
        )
        return response.choices[0].message.content
    
    def _query_anthropic(self, prompt: str) -> str:
        """Query Anthropic API"""
        response = self.client.messages.create(
            model=self.model_name,
            max_tokens=self.max_tokens,
            system=self.system_prompt,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=self.temperature
        )
        return response.content[0].text
    
    def _query_custom(self, prompt: str) -> str:
        """Query custom endpoint"""
        import requests
        
        # OpenAI-compatible format
        payload = {
            "model": self.model_name,
            "messages": [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": self.temperature,
            "max_tokens": self.max_tokens
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        response = requests.post(
            self.endpoint,
            json=payload,
            headers=headers,
            timeout=30
        )
        
        response.raise_for_status()
        data = response.json()
        
        # Try to extract response (OpenAI format)
        if 'choices' in data and len(data['choices']) > 0:
            return data['choices'][0]['message']['content']
        elif 'response' in data:
            return data['response']
        else:
            raise ValueError(f"Unexpected response format: {data}")
    
    def get_model_name(self) -> str:
        """Get formatted model name"""
        return f"{self.provider} - {self.model_name}"


# Test the client
if __name__ == "__main__":
    from dotenv import load_dotenv
    load_dotenv()
    
    print("="*70)
    print("TESTING MODEL CLIENT")
    print("="*70)
    
    # Test with available provider
    if os.getenv("GROQ_API_KEY"):
        client = ModelClient(
            provider="groq",
            model_name="llama-3.3-70b-versatile",
            api_key=os.getenv("GROQ_API_KEY"),
            system_prompt="You are a helpful assistant.",
            temperature=0.7,
            max_tokens=100
        )
    else:
        client = ModelClient(
            provider="openai",
            model_name="gpt-4o-mini",
            api_key=os.getenv("OPENAI_API_KEY"),
            system_prompt="You are a helpful assistant.",
            temperature=0.7,
            max_tokens=100
        )
    
    print(f"\n📝 Testing query...")
    response = client.query("What is 2+2?")
    print(f"Response: {response}")
    print("\n" + "="*70)