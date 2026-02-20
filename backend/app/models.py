from pydantic import BaseModel, Field
from typing import List

class LyricLine(BaseModel):
    time: str = Field(description="Timestamp of the lyric line, e.g., '0:15'")
    text: str = Field(description="Text of the lyric line")

class Metaphor(BaseModel):
    text: str = Field(description="The metaphor text")
    explanation: str = Field(description="Explanation of the metaphor")

class Meaning(BaseModel):
    sentiment: str = Field(description="Overall sentiment of the song")
    emoji: str = Field(description="Emoji representing the song's vibe")
    summary: str = Field(description="Brief summary of the song's meaning")
    context: str = Field(description="Contextual background of the song")
    metaphors: List[Metaphor] = Field(description="List of metaphors found in the song")

class AnalysisResponse(BaseModel):
    lyrics: List[LyricLine] = Field(description="Original lyrics with timestamps")
    translation: List[LyricLine] = Field(description="Translated lyrics with timestamps")
    meaning: Meaning = Field(description="Detailed analysis of the song")
