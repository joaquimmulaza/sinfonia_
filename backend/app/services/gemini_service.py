import os
import google.genai as genai
from google.genai import types
from dotenv import load_dotenv
from app.models import AnalysisResponse
import tempfile
import time

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_ID = "gemini-3-flash-preview"

def analyze_audio(file_path: str, target_language: str) -> AnalysisResponse:
    file_ref = None
    try:
        # 1. Upload file using File API
        print(f"Uploading file: {file_path}")
        
        file_ref = client.files.upload(file=file_path)
        print(f"File uploaded: {file_ref.name}")
        
        # 2. Construct Prompt
        prompt = f"""
        You are an expert musicologist and linguist.
        
        Please listen to the attached audio file carefully. Use your "Thinking" capabilities to perform a deep multimodal analysis.
        
        1. **Listen**: Identify the "vibe", the predominant emotions, the rhythmic pace, and prominent instrumentation. 
        2. **Transcribe**: Extract the exact original lyrics of the song synchronized with the audio timeline. 
           CRITICAL timestamp rules:
           - `line.time` must be the EXACT moment the first syllable of that line is sung
           - `word.start_time` must be the EXACT moment that specific word begins (NOT the beat before it)
           - `word.end_time` must be when the last phoneme of that word ends
           - Timestamps must be precise to the tenth of a second: "M:SS.d" format (e.g. "1:23.4")
           - Do NOT use rounded values like "1:23" or "1:24" when the actual time is "1:23.7"
           - All timestamps in `words` must be chronologically ordered and non-overlapping
        3. **Translate**: Translate the lyrics into {target_language}. Also provide the translated line string `text` and the start `time`. Words in `translation` lines should reuse the same start_time as the corresponding original word when possible.
        4. **Analyze**: detailed meaning, metaphors, and the emotional connection between the music and the lyrics.

        Provide the output strictly as a JSON object matching the requested schema. Pay meticulous attention to timestamps.
        """

        # 3. Generate Content with Structured Output
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=[file_ref, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AnalysisResponse,
                # extended thinking config if needed, but standard generate_content should work if model supports it.
                # The user linked to 'thinking' docs. 
                # For gemini-3-flash-preview, let's assume standard config works but we might need 'thinking_config' if strictly required.
                # The doc says: config=types.GenerateContentConfig(thinking_config=types.ThinkingConfig(include_thoughts=True))
                # Let's add that if this is a thinking model.
                # However, for now let's just use the model ID. If it fails specifically on 'thinking', I'll add config.
            )
        )

        
        # 4. Parse Response
        # The SDK v2 should return a parsed object if response_schema is a Pydantic model
        if response.parsed:
             return response.parsed
        else:
            # Fallback if for some reason it's not parsed (unlikely with SDK v2 + Pydantic)
            return AnalysisResponse.model_validate_json(response.text)

    except Exception as e:
        print(f"Error in Gemini Service: {e}")
        raise e
        
    finally:
        # CRITICAL FIX: Delete the file from the Gemini API after use
        if file_ref:
            try:
                client.files.delete(name=file_ref.name)
                print(f"File {file_ref.name} deleted from Gemini API.")
            except Exception as delete_error:
                print(f"Failed to delete file from Gemini API: {delete_error}")
