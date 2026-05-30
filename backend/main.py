import os
import json
import requests

from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ==========================================================
# APP
# ==========================================================

app = FastAPI(title="Wolf AI SaaS Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# ENVIRONMENT
# ==========================================================

OLLAMA_HOST = os.getenv(
    "OLLAMA_HOST",
    "http://localhost:11434"
)

OLLAMA_CHAT_URL = f"{OLLAMA_HOST}/api/chat"
OLLAMA_TAGS_URL = f"{OLLAMA_HOST}/api/tags"

# ==========================================================
# PERSONAS
# ==========================================================

PERSONAS = {
    "copywriter": (
        "You are an expert SaaS Copywriter and Growth Marketer. "
        "Write punchy, high-converting marketing copy. "
        "Be professional, creative, and clear."
    ),
    "trainer": (
        "You are an elite Gym Trainer and Nutrition Specialist. "
        "Provide actionable workout routines, macro layouts, "
        "and motivational advice."
    ),
    "programmer": (
        "You are a master Software Engineer and Coding Architect. "
        "Write clean, optimized, secure, and modern code. "
        "Explain things briefly."
    )
}

# ==========================================================
# REQUEST MODELS
# ==========================================================

class MessageModel(BaseModel):
    role: str
    content: str

class ChatSettingsRequest(BaseModel):
    messages: List[MessageModel]
    persona: str

# ==========================================================
# ROOT
# ==========================================================
print("WOLF MAIN.PY LOADED")


@app.get("/wolf")
def wolf():
    return {"status": "wolf works"}

@app.get("/")
def root():
    return {
        "status": "running",
        "product": "Wolf AI SaaS Core",
        "ollama_host": OLLAMA_HOST
    }

# ==========================================================
# HEALTH CHECK
# ==========================================================

@app.get("/health")
def health_check():
    try:
        response = requests.get(
            OLLAMA_TAGS_URL,
            timeout=10
        )

        response.raise_for_status()

        return {
            "status": "healthy",
            "ollama": "connected",
            "models": response.json()
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "ollama": "disconnected",
            "error": str(e)
        }

# ==========================================================
# MODEL LIST
# ==========================================================

@app.get("/models")
def list_models():
    try:
        response = requests.get(
            OLLAMA_TAGS_URL,
            timeout=10
        )

        response.raise_for_status()

        return response.json()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ollama Error: {str(e)}"
        )

# ==========================================================
# CHAT STREAM
# ==========================================================

@app.post("/api/chat")
async def stream_chat(request: ChatSettingsRequest):

    system_prompt = PERSONAS.get(
        request.persona,
        "You are a helpful assistant."
    )

    ollama_messages = [
        {
            "role": "system",
            "content": system_prompt
        }
    ]

    for msg in request.messages:
        ollama_messages.append(
            {
                "role": msg.role,
                "content": msg.content
            }
        )

    payload = {
        "model": "qwen2.5:1.5b",
        "messages": ollama_messages,
        "stream": True
    }

    def event_stream():

        try:

            with requests.post(
                OLLAMA_CHAT_URL,
                json=payload,
                stream=True,
                timeout=120
            ) as response:

                response.raise_for_status()

                for line in response.iter_lines():

                    if not line:
                        continue

                    try:
                        chunk = json.loads(
                            line.decode("utf-8")
                        )

                        token = chunk.get(
                            "message",
                            {}
                        ).get(
                            "content",
                            ""
                        )

                        if token:
                            yield token

                    except Exception:
                        continue

        except Exception as e:

            print("OLLAMA ERROR:", e)

            yield (
                f"\n\n⚠️ Ollama Connection Error:\n"
                f"{str(e)}"
            )

    return StreamingResponse(
        event_stream(),
        media_type="text/plain"
    )