from faster_whisper import WhisperModel
import os
from typing import List
from app.models import LyricLine, WordTimestamp

# Path to optionally download models or use a specific cache
# We use the 'base' model to balance precision and speed/RAM for free tiers
MODEL_SIZE = "base" 

# Initialize model only once
# CPU float32 is the safest for compatibility without GPU setups
print(f"Loading faster-whisper model '{MODEL_SIZE}'...")
model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="float32")
print("Faster-whisper model loaded successfully.")

def format_time(seconds: float) -> str:
    """Converts seconds float to M:SS.d format for frontend."""
    mins = int(seconds // 60)
    secs = seconds % 60
    return f"{mins}:{secs:04.1f}"

def transcribe_audio(file_path: str) -> List[LyricLine]:
    """
    Transcribes the audio using faster-whisper, extracting exact word-level timestamps.
    Returns a list of LyricLine objects.
    """
    print(f"Starting faster-whisper transcription for: {file_path}")
    
    # We request word_timestamps=True to get pinpoint accurate sync
    segments, info = model.transcribe(file_path, beam_size=5, word_timestamps=True)
    
    print(f"Detected language '{info.language}' with probability {info.language_probability}")

    lyrics_data: List[LyricLine] = []

    for segment in segments:
        line_words = []
        if segment.words:
            for word in segment.words:
                stripped_word = word.word.strip()
                if not stripped_word:
                    continue
                line_words.append(
                    WordTimestamp(
                        word=stripped_word,
                        start_time=format_time(word.start),
                        end_time=format_time(word.end)
                    )
                )
        
        # If words exist, calculate line time based on first word
        # Otherwise fallback to segment start
        line_start_time = format_time(segment.words[0].start) if segment.words else format_time(segment.start)
        
        lyrics_data.append(
            LyricLine(
                time=line_start_time,
                text=segment.text.strip(),
                words=line_words
            )
        )
        
    print(f"Transcription complete. Processed {len(lyrics_data)} lines.")
    return lyrics_data

