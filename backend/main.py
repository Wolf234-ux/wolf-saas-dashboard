import json
import requests
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Structure to accept complete history threads from React
class MessageModel(BaseModel):
    role: str
    content: str

class ChatSettingsRequest(BaseModel):
    messages: List[MessageModel]
    persona: str

# FEATURE B: Define System Roles
PERSONAS = {
    "copywriter": "You are an expert SaaS Copywriter and Growth Marketer. Write punchy, high-converting marketing copy. Be professional, creative, and clear.",
    "trainer": "You are an elite Gym Trainer and Nutrition Specialist. Provide actionable workout routines, macro layouts, and motivational advice.",
    "programmer": "You are a master Software Engineer and Coding Architect. Write clean, optimized, secure, and modern code. Explain things briefly."
}

OLLAMA_CHAT_URL = "http://localhost:11434/api/chat"

@app.post("/api/chat")
async def stream_chat(request: ChatSettingsRequest):
    # Inject selected persona as the starting system prompt
    system_prompt = PERSONAS.get(request.persona, "You are a helpful assistant.")
    
    # Reconstruct history sequence for Ollama
    ollama_messages = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        ollama_messages.append({"role": msg.role, "content": msg.content})

    # FEATURE A: Yield text tokens on-the-fly 
    def event_stream():
        payload = {
            "model": "qwen2.5:1.5b",
            "messages": ollama_messages,
            "stream": True # Enabled streaming parameter
        }
        try:
            with requests.post(OLLAMA_CHAT_URL, json=payload, stream=True) as r:
                r.raise_for_status()
                for line in r.iter_lines():
                    if line:
                        chunk = json.loads(line.decode('utf-8'))
                        token = chunk.get("message", {}).get("content", "")
                        if token:
                            yield token
        except Exception as e:
            yield f"⚠️ Server Stream Error: {str(e)}"

    return StreamingResponse(event_stream(), media_type="text/plain")
