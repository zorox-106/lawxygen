# Section 2 — Streaming RAG Endpoint Testing Note

## Overview
This document details how the streaming RAG endpoint (`POST /research/query`) in `section2_rag/main.py` was implemented and tested to satisfy all 5 mandatory assignment requirements:
1. Accepts natural-language legal query.
2. Calls `retrieve(query: str) -> list[dict]` returning 3 chunk objects (`doc_id`, `chunk_text`, `score`).
3. Streams response token-by-token using async generator & `StreamingResponse` (SSE format).
4. Grounded claims with inline citations (`[doc_01]`) and a final `[SOURCES_USED]` JSON block.
5. Handles zero-result queries cleanly without model hallucination.

---

## 🚀 How to Run and Test

### Step 1: Start the FastAPI Server
```bash
cd section2_rag
pip install fastapi uvicorn requests pydantic
uvicorn main:app --reload --port 8000
```
*(Server will start at `http://localhost:8000`)*

---

### Step 2: Automated Test Execution (Python Test Script)
Run the provided test client:
```bash
python test_client.py
```

#### Expected Test Outputs:

1. **Valid Legal Query Test:** `POST /research/query` with `{"query": "What is the punishment for cheque bounce under Section 138 NI Act?"}`
   - **Behavior:** Tokens stream in real-time with artificial delay (~30ms per word).
   - **Inline Citation:** Outputs `[ni_act_138]` next to claims.
   - **Grounding Block:** Concludes with `[SOURCES_USED]: {"status": "success", "used_chunks": [...]}`.

2. **Zero Results Test:** `POST /research/query` with `{"query": "xyz random unrelated sentence 12345"}`
   - **Behavior:** `retrieve()` returns `[]`.
   - **Output Stream:** Immediately streams `"No relevant legal sources found for your query. The system cannot provide a grounded response without authoritative source documents."`
   - **Grounding Block:** Concludes with `[SOURCES_USED]: {"status": "no_sources_found", "used_chunks": []}`.

---

### Step 3: Manual Testing via cURL
To observe real-time word-by-word streaming in the terminal:

```bash
curl -N -X POST "http://localhost:8000/research/query" \
     -H "Content-Type: application/json" \
     -d '{"query": "What is the penalty under Section 138 NI Act?"}'
```
*Note: The `-N` flag disables curl buffering to display token-by-token output in real time.*
