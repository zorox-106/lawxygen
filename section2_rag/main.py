"""
Lawxygen Technical Assignment - Section 2
Streaming RAG Endpoint with Citation Grounding
"""

import asyncio
import json
from typing import AsyncGenerator, Dict, List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

app = FastAPI(
    title="Lawxygen Streaming RAG API",
    description="Streaming legal research endpoint with inline citation grounding and zero-result handling.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchQueryRequest(BaseModel):
    query: str = Field(..., example="What is the punishment for cheque bounce under Section 138 NI Act?")


# Mock Knowledge Base Chunks
MOCK_DATABASE = [
    {
        "doc_id": "ni_act_138",
        "title": "Section 138, Negotiable Instruments Act, 1881",
        "chunk_text": "Where any cheque drawn by a person on an account maintained by him with a banker for payment of any amount of money is returned by the bank unpaid, such person shall be deemed to have committed an offence and shall be punished with imprisonment for a term which may be extended to two years, or with fine which may extend to twice the amount of the cheque, or with both.",
        "keywords": ["cheque", "bounce", "dishonour", "138", "negotiable", "instruments", "punishment", "penalty", "fine"]
    },
    {
        "doc_id": "ipc_420",
        "title": "Section 420, Indian Penal Code, 1860",
        "chunk_text": "Cheating and dishonestly inducing delivery of property: Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        "keywords": ["cheating", "fraud", "420", "ipc", "property", "dishonestly", "imprisonment"]
    },
    {
        "doc_id": "it_act_66d",
        "title": "Section 66D, Information Technology Act, 2000",
        "chunk_text": "Punishment for cheating by personation by using computer resource: Whoever by means of any communication device or computer resource cheats by personation, shall be punished with imprisonment of either description for a term which may extend to three years and shall also be liable to fine which may extend to one lakh rupees.",
        "keywords": ["cyber", "computer", "it act", "66d", "personation", "online", "fraud", "phishing"]
    },
    {
        "doc_id": "contract_act_10",
        "title": "Section 10, Indian Contract Act, 1872",
        "chunk_text": "What agreements are contracts: All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.",
        "keywords": ["contract", "agreement", "consent", "consideration", "lawful", "section 10"]
    }
]


def retrieve(query: str) -> List[Dict]:
    """
    Mock Retrieval Function.
    Filters database based on keyword matching in the query.
    Returns 3 fake results shaped like {"doc_id": str, "chunk_text": str, "score": float}
    Returns [] if no relevant chunks match the query.
    """
    query_lower = query.lower().strip()
    
    # Check for explicitly empty or irrelevant queries
    if not query_lower or query_lower in ["hello", "hi", "test", "abc", "xyz", "weather today"]:
        return []
    
    matches = []
    for doc in MOCK_DATABASE:
        score = 0.0
        # Calculate naive relevance score based on keyword match
        matched_words = [kw for kw in doc["keywords"] if kw in query_lower]
        if matched_words:
            score = round(0.65 + (len(matched_words) * 0.1), 2)
            if score > 0.98:
                score = 0.98
            matches.append({
                "doc_id": doc["doc_id"],
                "chunk_text": doc["chunk_text"],
                "score": score
            })
    
    # Sort by relevance score descending
    matches.sort(key=lambda x: x["score"], reverse=True)
    
    # If no specific keyword matched, but query looks like legal question, return top default chunks
    if not matches:
        legal_terms = ["law", "penalty", "punishment", "section", "act", "court", "rights", "notice", "breach", "legal"]
        if any(term in query_lower for term in legal_terms):
            matches = [
                {"doc_id": MOCK_DATABASE[0]["doc_id"], "chunk_text": MOCK_DATABASE[0]["chunk_text"], "score": 0.89},
                {"doc_id": MOCK_DATABASE[1]["doc_id"], "chunk_text": MOCK_DATABASE[1]["chunk_text"], "score": 0.81},
                {"doc_id": MOCK_DATABASE[3]["doc_id"], "chunk_text": MOCK_DATABASE[3]["chunk_text"], "score": 0.75},
            ]
            
    return matches[:3]


async def generate_rag_stream(query: str) -> AsyncGenerator[str, None]:
    """
    Async Generator yielding tokens token-by-token with inline citations [doc_id]
    and concluding with a structured JSON grounding payload.
    Handles zero-retrieval cases gracefully without hallucination.
    """
    chunks = retrieve(query)
    
    # 1. Zero Results Fallback Handling
    if not chunks:
        zero_res_msg = "No relevant legal sources found for your query. The system cannot provide a grounded response without authoritative source documents."
        for word in zero_res_msg.split():
            yield f"{word} "
            await asyncio.sleep(0.04)
        yield "\n\n[SOURCES_USED]: " + json.dumps({"status": "no_sources_found", "used_chunks": []})
        return

    # 2. Token-by-Token Streaming with Inline Citation Grounding
    response_tokens = []
    
    # Synthesize answer text based on retrieved chunks
    response_tokens.append(f"Based on Indian statutory law and public legal records for your query regarding '{query}':\n\n")
    
    for idx, chunk in enumerate(chunks, 1):
        doc_id = chunk['doc_id']
        text_snippet = chunk['chunk_text']
        score = chunk['score']
        
        response_tokens.append(f"Point {idx}: According to legal record ")
        response_tokens.append(f"[{doc_id}]")  # Inline citation marker
        response_tokens.append(f" (relevance score: {score}), ")
        response_tokens.append(f'"{text_snippet}" ')
        response_tokens.append(f"[{doc_id}]\n\n")

    response_tokens.append("Summary: All claims above are directly cited from retrieved statutory provisions.")
    
    # Stream synthesized response token-by-token with artificial typing latency (0.03s)
    full_text = "".join(response_tokens)
    words = full_text.split(" ")
    
    for i, word in enumerate(words):
        yield word if i == len(words) - 1 else word + " "
        await asyncio.sleep(0.03)

    # 3. Final JSON Grounding Block detailing exact source chunks used
    used_chunks_summary = {
        "status": "success",
        "query": query,
        "total_sources_retrieved": len(chunks),
        "used_chunks": [
            {
                "doc_id": c["doc_id"],
                "score": c["score"],
                "chunk_snippet": c["chunk_text"][:80] + "..."
            }
            for c in chunks
        ]
    }
    
    yield f"\n\n[SOURCES_USED]: {json.dumps(used_chunks_summary, indent=2)}"


@app.post("/research/query")
async def research_query(payload: ResearchQueryRequest):
    """
    POST /research/query
    Accepts natural-language legal query and returns SSE token-by-token stream.
    """
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty.")

    return StreamingResponse(
        generate_rag_stream(payload.query),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@app.get("/")
def read_root():
    return {"message": "Lawxygen Section 2 Streaming RAG Endpoint active.", "endpoint": "POST /research/query"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
