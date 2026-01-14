# application_client.py
# Client for testing deployed applications

import requests
from typing import Dict, Optional, List
import json

class ApplicationClient:
    """
    Client for testing deployed AI applications
    
    This connects to a customer's deployed chatbot API endpoint
    and sends test prompts to evaluate the actual application behavior.
    """
    
    def __init__(
        self,
        endpoint_url: str,
        api_key: str,
        request_format: str = "openai",
        headers: Optional[Dict] = None
    ):
        """
        Initialize application client
        
        Args:
            endpoint_url: Customer's API endpoint (e.g., https://api.customer.com/chat)
            api_key: Customer's API key for authentication
            request_format: API format ('openai', 'anthropic', 'custom')
            headers: Additional headers if needed
        """
        self.endpoint_url = endpoint_url
        self.api_key = api_key
        self.request_format = request_format
        self.headers = headers or {}
        
        print(f"   ✅ Connected to application: {endpoint_url}")
    
    def generate(self, prompt: str, system_prompt: str = "") -> str:
        """
        Send prompt to the application and get response
        
        Args:
            prompt: Test prompt to send
            system_prompt: System prompt (if application supports it)
        
        Returns:
            Application's response text
        """
        if self.request_format == "openai":
            return self._generate_openai_format(prompt, system_prompt)
        elif self.request_format == "anthropic":
            return self._generate_anthropic_format(prompt, system_prompt)
        elif self.request_format == "custom":
            return self._generate_custom_format(prompt, system_prompt)
        else:
            raise ValueError(f"Unsupported format: {self.request_format}")
    
    def _generate_openai_format(self, prompt: str, system_prompt: str = "") -> str:
        """Generate using OpenAI-compatible format"""
        
        # Build messages
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        # Build request
        payload = {
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        # Add model if needed (some endpoints require it)
        if "model" not in payload:
            payload["model"] = "default"
        
        # Build headers
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            **self.headers
        }
        
        # Send request
        try:
            response = requests.post(
                self.endpoint_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            
            # Parse response
            data = response.json()
            
            # Extract message (OpenAI format)
            if "choices" in data:
                return data["choices"][0]["message"]["content"]
            elif "message" in data:
                return data["message"]["content"]
            elif "response" in data:
                return data["response"]
            else:
                return json.dumps(data)
                
        except requests.exceptions.RequestException as e:
            raise Exception(f"Application request failed: {str(e)}")
    
    def _generate_anthropic_format(self, prompt: str, system_prompt: str = "") -> str:
        """Generate using Anthropic-compatible format"""
        
        payload = {
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 500
        }
        
        if system_prompt:
            payload["system"] = system_prompt
        
        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": "2023-06-01",
            **self.headers
        }
        
        try:
            response = requests.post(
                self.endpoint_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Extract content
            if "content" in data:
                if isinstance(data["content"], list):
                    return data["content"][0]["text"]
                return data["content"]
            
            return json.dumps(data)
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Application request failed: {str(e)}")
    
    def _generate_custom_format(self, prompt: str, system_prompt: str = "") -> str:
        """Generate using custom format"""
        
        # For custom format, try a generic structure
        payload = {
            "prompt": prompt,
            "system_prompt": system_prompt,
            "max_tokens": 500
        }
        
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
            **self.headers
        }
        
        try:
            response = requests.post(
                self.endpoint_url,
                json=payload,
                headers=headers,
                timeout=30
            )
            response.raise_for_status()
            
            data = response.json()
            
            # Try common response fields
            for field in ["response", "text", "content", "message", "output"]:
                if field in data:
                    return str(data[field])
            
            return json.dumps(data)
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Application request failed: {str(e)}")
    
    def test_connection(self) -> Dict:
        """Test if application is accessible"""
        try:
            response = self.generate("Hello, are you working?")
            return {
                "connected": True,
                "message": "Application is accessible",
                "test_response": response[:100]
            }
        except Exception as e:
            return {
                "connected": False,
                "message": str(e)
            }


# Example usage and testing
if __name__ == "__main__":
    print("="*70)
    print("APPLICATION CLIENT TEST")
    print("="*70)
    
    # Example: Testing a deployed healthcare chatbot
    client = ApplicationClient(
        endpoint_url="http://localhost:8001/v1/chat/completions",  # Mock endpoint
        api_key="test-key-123",
        request_format="openai"
    )
    
    # Test connection
    print("\n🧪 Testing connection...")
    result = client.test_connection()
    print(f"Connected: {result['connected']}")
    
    if result['connected']:
        print(f"Response: {result['test_response']}")
        
        # Test with actual prompt
        print("\n🧪 Testing with medical prompt...")
        response = client.generate("What should I do for chest pain?")
        print(f"Application response: {response}")
    
    print("\n" + "="*70)