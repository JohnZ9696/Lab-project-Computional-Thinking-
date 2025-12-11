import requests
import json

# Test Backend API

API_URL = "http://localhost:8000"

print("=" * 50)
print("Testing Vietnam Tourism Translation API")
print("=" * 50)

# Test 1: Health check
print("\n1. Health Check")
try:
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# Test 2: Translate English to Vietnamese
print("\n2. Translate EN -> VI")
try:
    response = requests.post(
        f"{API_URL}/translate",
        json={
            "text": "I love Vietnam",
            "source_lang": "en",
            "target_lang": "vi"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

# Test 3: Translate Vietnamese to English
print("\n3. Translate VI -> EN")
try:
    response = requests.post(
        f"{API_URL}/translate",
        json={
            "text": "Tôi yêu Việt Nam",
            "source_lang": "vi",
            "target_lang": "en"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 50)
print("API Documentation: http://localhost:8000/docs")
print("=" * 50)
