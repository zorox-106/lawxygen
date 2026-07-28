# Lawxygen Full-Stack Technical Assignment — AI Co-Counsel Platform

> **Role:** Full-Stack Developer (Tech Team)  
> **Applicant:** Rajat Tiwari  
> **Submission Date:** July 28, 2026  

---

## 📌 Executive Summary

This repository contains the complete production-grade solution for the **Lawxygen Technical Assignment**, comprising both mandatory sections:

1. **Section 1: Mini Legal-Tech Web App (`Next.js 14`, TypeScript, Tailwind CSS)**
   - **Authentication:** Stateful JWT authentication (`/api/auth/login`, `/api/auth/signup`, `/api/auth/me`) with cookie session handling and 1-click Advocate demo mode.
   - **Legal Drafting Module:** Interactive form-to-generation suite for **Non-Disclosure Agreements (NDA)** and **Legal Demand Notices** with parameter customization, live preview, copy-to-clipboard, and single-click **PDF Export**.
   - **Statutory RAG Search:** Indexed search engine querying 8 authentic Indian statutes, Bare Acts (IPC 420, NI Act 138, IT Act 66D, Contract Act 10 & 27, CPA 35), and landmark Supreme Court judgments (*Kesavananda Bharati*, *Navtej Singh Johar*).
2. **Section 2: Standalone FastAPI Streaming RAG Endpoint (`section2_rag/main.py`)**
   - Async `POST /research/query` endpoint with Server-Sent Events (SSE) token-by-token streaming.
   - **Citation Grounding:** Injects inline citation markers `[doc_01]` alongside claims and concludes with a structured `[SOURCES_USED]` JSON block.
   - **Zero-Result Protection:** Returns a clear, non-hallucinated `"No relevant legal sources found"` stream when `retrieve()` returns no matching chunks.

---

## 🛠️ Architecture & Tech Stack Justification

```
                      ┌─────────────────────────────────────────────────────────┐
                      │              LAWXYGEN MINI APP (NEXT.JS 14)             │
                      ├───────────────────┬──────────────────┬──────────────────┤
                      │ 1. Auth Module    │ 2. Legal Drafter │ 3. Search & RAG  │
                      │ (JWT + HTTP-Only  │ (NDA & Demand    │ (Vector/Scored   │
                      │  Cookies)         │  Notice Engine)  │  Corpus Engine)  │
                      └─────────┬─────────┴────────┬─────────┴────────┬─────────┘
                                │                  │                  │
                                ▼                  ▼                  ▼
                         ProtectedRoute     Interactive Form    Indian Bare Acts
                          Session State       PDF Exporter        & SC Precedents

                      ┌─────────────────────────────────────────────────────────┐
                      │            SECTION 2: FASTAPI STREAMING ENDPOINT         │
                      ├─────────────────────────────────────────────────────────┤
                      │ POST /research/query -> SSE Stream (Token-by-Token)     │
                      │ Inline Citations ([doc_01]) + Grounding JSON Block       │
                      │ Strict Zero-Result Fallback ("No sources found")        │
                      └─────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js 18+** & `npm`
- **Python 3.10+** & `pip`

### Step 1: Run Section 1 (Next.js Mini App)
```bash
# Clone the repository
git clone https://github.com/rajattiwari/lawxygen.git
cd lawxygen

# Install Node dependencies
npm install

# Build & Start Next.js Development Server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

> 💡 **Demo Login Credentials:**  
> Email: `advocate@lawxygen.com`  
> Password: `Lawyer@123`  
> *(Or click the **Quick Demo Login** button at the top header)*

---

### Step 2: Run Section 2 (FastAPI Streaming Endpoint)
```bash
# Navigate to Section 2 directory
cd section2_rag

# Install Python dependencies
pip install fastapi uvicorn requests pydantic

# Launch FastAPI streaming server
uvicorn main:app --reload --port 8000
```
Server active at **`http://localhost:8000`**  
Documentation available at `http://localhost:8000/docs`.

#### Test Section 2 via Python Test Client:
```bash
python test_client.py
```

#### Test Section 2 via cURL:
```bash
curl -N -X POST "http://localhost:8000/research/query" \
     -H "Content-Type: application/json" \
     -d '{"query": "What is the punishment for cheque bounce under Section 138 NI Act?"}'
```

---

## 📜 Public Data Sources Cited
As required by the assignment rules, all data indexed in Section 1 & Section 2 originates exclusively from public Indian legal domains:
1. **Indian Kanoon** (`indiankanoon.org`) — Bare Acts & Court Judgments
2. **India Code** (`indiacode.nic.in`) — Statutory Texts (IPC, NI Act, IT Act, Indian Contract Act, CPA 2019)
3. **Supreme Court of India Official Portal** (`sci.gov.in`) — Constitutional Bench Judgment Transcripts (*Kesavananda Bharati (1973)*, *Navtej Singh Johar (2018)*)

---

## 🔮 What I Would Build Next With 1 Week (Section 1 Note)

1. **Multi-Vector Semantic RAG Pipeline:** Replace the in-memory scoring engine with **pgvector / Qdrant** using `text-embedding-3-small` or BGE-large embeddings for full Indian Code chunking.
2. **Interactive Rich-Text Document Editor (TipTap / Lexical):** Provide inline clause editing, auto-filling variables from court databases, and real-time legal risk scoring.
3. **Multi-Document Legal Case Analyst:** Allow lawyers to upload multi-page PDF briefs, case petitions, and contract scans with automated OCR and clause extraction.
4. **OAuth 2.0 & Bar Council Verification:** Integrate Single Sign-On (Google / LinkedIn) along with Indian Bar Council advocate ID verification.
5. **Real-time Legal Notice Dispatch:** Automated tracking of notice delivery via Speed Post APIs and email read receipts.

---

## 🎬 Loom Video Script & Presentation Outline

| Timestamp | Section | Key Talking Points |
| :--- | :--- | :--- |
| **0:00 - 0:35** | **Introduction & Architecture** | Highlight full-stack decisions (Next.js 14, Tailwind, JWT Auth, Python FastAPI SSE streaming). |
| **0:35 - 1:15** | **Section 1 Walkthrough** | Demonstrate 1-click Auth, NDA & Legal Notice generator with live PDF export, and statutory search with cited summaries. |
| **1:15 - 1:50** | **Section 2 Walkthrough** | Demonstrate `POST /research/query` streaming in terminal/UI, inline `[doc_01]` citations, and zero-result fallback. |
| **1:50 - 2:00** | **Conclusion & Roadmap** | Summarize speed vs. quality tradeoffs and 1-week product roadmap. |
