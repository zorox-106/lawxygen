import { useState } from 'react';

export function useStream() {
  const [sec2Query, setSec2Query] = useState('What is the punishment for cheque bounce under Section 138 NI Act?');
  const [sec2StreamText, setSec2StreamText] = useState('');
  const [sec2SourcesJson, setSec2SourcesJson] = useState<any>(null);
  const [isStreamingSec2, setIsStreamingSec2] = useState(false);
  const [streamError, setStreamError] = useState('');

  const handleTestSection2Stream = async () => {
    setIsStreamingSec2(true);
    setSec2StreamText('');
    setSec2SourcesJson(null);
    setStreamError('');

    const fastApiBaseUrl = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

    try {
      const res = await fetch(`${fastApiBaseUrl}/research/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sec2Query })
      });

      if (!res.ok) {
        throw new Error(`FastAPI server error (${res.status}). Make sure Section 2 server is active at ${fastApiBaseUrl}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        if (accumulated.includes('[SOURCES_USED]:')) {
          const parts = accumulated.split('[SOURCES_USED]:');
          setSec2StreamText(parts[0]);
          try {
            const parsed = JSON.parse(parts[1].trim());
            setSec2SourcesJson(parsed);
          } catch {
            // Partial JSON chunk
          }
        } else {
          setSec2StreamText(accumulated);
        }
      }
    } catch (err: any) {
      setStreamError(err.message);
      setSec2StreamText(`⚠️ Streaming Note: ${err.message}\n\nTo run Section 2 server standalone:\n$ cd section2_rag && ./venv/bin/uvicorn main:app --port 8000`);
    } finally {
      setIsStreamingSec2(false);
    }
  };

  return {
    sec2Query,
    setSec2Query,
    sec2StreamText,
    sec2SourcesJson,
    isStreamingSec2,
    streamError,
    handleTestSection2Stream,
  };
}
