from pydantic import BaseModel, Field
from typing import List

class WordTimestamp(BaseModel):
    word: str = Field(description="The word itself")
    start_time: str = Field(description="Start time of the word, e.g., '0:15.2'")
    end_time: str = Field(description="End time of the word, e.g., '0:15.8'")

class LyricLine(BaseModel):
    time: str = Field(description="Start timestamp of the lyric line, e.g., '0:15'")
    text: str = Field(description="Full text of the lyric line")
    words: List[WordTimestamp] = Field(description="List of words in the line with detailed timestamps", default_factory=list)

class Metaphor(BaseModel):
    text: str = Field(description="The metaphor text")
    explanation: str = Field(description="Explanation of the metaphor")

class Meaning(BaseModel):
    sentiment: str = Field(description="Overall sentiment of the song")
    emoji: str = Field(description="Emoji representing the song's vibe")
    summary: str = Field(description="Brief summary of the song's meaning")
    context: str = Field(description="Contextual background of the song")
    metaphors: List[Metaphor] = Field(description="List of metaphors found in the song")

class SemanticAnalysisResponse(BaseModel):
    translation: List[LyricLine] = Field(description="Translated lyrics with timestamps")
    meaning: Meaning = Field(description="Detailed analysis of the song")

class AnalysisResponse(BaseModel):
    lyrics: List[LyricLine] = Field(description="Original lyrics with timestamps")
    translation: List[LyricLine] = Field(description="Translated lyrics with timestamps")
    meaning: Meaning = Field(description="Detailed analysis of the song")
