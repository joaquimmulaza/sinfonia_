from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.services.gemini_service import analyze_lyrics_semantics
from app.services.transcription_service import transcribe_audio
from app.models import AnalysisResponse
import shutil
import os
import tempfile
import json

app = FastAPI(title="Sinfonia Backend")

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173", # Vite default
    "http://localhost:5175/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_endpoint(
    file: UploadFile = File(...),
    target_language: str = Form(...)
):
    # Check file size (20MB limit)
    MAX_FILE_SIZE = 20 * 1024 * 1024
    
    # file.file is a SpooledTemporaryFile.
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 20MB.")

    # Save UploadFile to a temporary file
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        
        # 1. Transcribe audio locally with faster-whisper for precise word timestamps
        original_lyrics = transcribe_audio(tmp_path)
        
        # 2. Serialize lyrics to JSON to send to Gemini
        lyrics_json_str = json.dumps([line.model_dump() for line in original_lyrics], indent=2)
        
        # 3. Get semantics and translation from Gemini (text-only, fast and precise)
        semantic_result = analyze_lyrics_semantics(lyrics_json_str, target_language)
        
        # 4. Merge results into the final format
        final_response = AnalysisResponse(
            lyrics=original_lyrics,
            translation=semantic_result.translation,
            meaning=semantic_result.meaning
        )
        
        return final_response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up the temp file
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            try:
                os.remove(tmp_path)
            except:
                pass

@app.get("/")
def read_root():
    return {"message": "Sinfonia API is running"}
