import os
import google.genai as genai
from google.genai import types
from dotenv import load_dotenv
from app.models import SemanticAnalysisResponse

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

client = genai.Client(api_key=GEMINI_API_KEY)

MODEL_ID = "gemini-3-flash-preview"

def analyze_lyrics_semantics(original_lyrics_json: str, target_language: str) -> SemanticAnalysisResponse:
    try:
        print("Starting Gemini semantic analysis on pre-transcribed lyrics...")
        
        # Construct Prompt
        prompt = f"""
        You are an expert musicologist and linguist.
        
        Below are the exact original lyrics of a song perfectly synchronized with audio timestamps in JSON format.
        
        Your tasks:
        1. **Listen/Read**: Identify the "vibe", the predominant emotions, and the meaning of the song.
        2. **Translate**: Translate the provided lyrics into {target_language}. Also provide the translated line string `text` and the start `time`. Words in `translation` lines should reuse the EXACT same `start_time` and `end_time` as the corresponding original word from the provided JSON when possible, maintaining synchronization.
        3. **Analyze**: detailed meaning, metaphors, and the emotional connection of the lyrics.

        Provide the output strictly as a JSON object matching the requested schema. Pay meticulous attention to timestamps so they mirror the original perfectly.

        ORIGINAL LYRICS TRANSCRIBED:
        {original_lyrics_json}
        """

        # Generate Content with Structured Output
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=SemanticAnalysisResponse,
            )
        )
        
        # Parse Response
        if response.parsed:
             return response.parsed
        else:
            return SemanticAnalysisResponse.model_validate_json(response.text)

    except Exception as e:
        print(f"Error in Gemini Service Phase: {e}")
        raise e
