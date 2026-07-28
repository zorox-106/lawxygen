"""
Lawxygen Technical Assignment - Section 2 Testing Client
Simulates client SSE streaming consumption from FastAPI endpoint /research/query
"""

import sys
import requests
import json

BASE_URL = "http://localhost:8000"

def test_streaming_query(query: str):
    print("=" * 70)
    print(f" TESTING QUERY: '{query}'")
    print("=" * 70)
    
    url = f"{BASE_URL}/research/query"
    payload = {"query": query}
    
    try:
        response = requests.post(url, json=payload, stream=True)
        if response.status_code != 200:
            print(f"Error: Server responded with status code {response.status_code}")
            print(response.text)
            return
            
        print("\n--- STREAMED OUTPUT START ---\n")
        full_buffer = ""
        for chunk in response.iter_content(chunk_size=None, decode_unicode=True):
            if chunk:
                print(chunk, end="", flush=True)
                full_buffer += chunk
                
        print("\n\n--- STREAMED OUTPUT END ---\n")
        
        # Verify Citations & JSON Block
        if "[SOURCES_USED]:" in full_buffer:
            print(" Verification Passed: Grounding JSON block detected!")
            json_part = full_buffer.split("[SOURCES_USED]:")[1].strip()
            parsed_json = json.loads(json_part)
            print(f"   Status: {parsed_json.get('status')}")
            print(f"   Chunks used: {len(parsed_json.get('used_chunks', []))}")
        else:
            print("⚠️ Warning: No JSON grounding block found in output.")
            
    except requests.exceptions.ConnectionError:
        print(f" Connection Failed! Make sure FastAPI app is running at {BASE_URL}")
        print("Run command: uvicorn section2_rag.main:app --port 8000")

if __name__ == "__main__":
    print("Running Lawxygen Section 2 Streaming RAG Endpoint Tests...\n")
    
    # Test 1: Valid Legal Query with Citations
    test_streaming_query("What is the punishment for cheque bounce under Section 138 NI Act?")
    
    # Test 2: Zero Result Query (Should output 'No relevant legal sources found')
    test_streaming_query("xyz random unrelated sentence 12345")
