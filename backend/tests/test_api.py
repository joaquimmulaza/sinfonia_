import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from app.models import AnalysisResponse
import io

client = TestClient(app)

@pytest.fixture
def mock_gemini_response():
    return AnalysisResponse(
        lyrics=[{"time": "0:00", "text": "Mama, just killed a man"}],
        translation=[{"time": "0:00", "text": "Mama, acabei de matar um homem"}],
        meaning={
            "summary": "A profound song about regret and existensialism.",
            "context": "Bohemian Rhapsody by Queen",
            "sentiment": "Melancholic",
            "emoji": "🎭",
            "metaphors": [{"text": "Silhouetto", "explanation": "Shadow of a man"}]
        }
    )

def test_analyze_endpoint_success(mock_gemini_response):
    # Mock the service function used in main.py
    with patch("app.main.analyze_audio") as mock_analyze:
        mock_analyze.return_value = mock_gemini_response
        
        # Create a dummy MP3 file
        file_content = b"fake audio content"
        files = {"file": ("test.mp3", file_content, "audio/mpeg")}
        data = {"target_language": "Portuguese"}
        
        response = client.post("/api/analyze", files=files, data=data)
        
        assert response.status_code == 200
        json_response = response.json()
        assert json_response["lyrics"][0]["text"] == "Mama, just killed a man"
        assert json_response["translation"][0]["text"] == "Mama, acabei de matar um homem"
        
        # Verify mock was called
        mock_analyze.assert_called_once()
        # Verify arguments? The first arg is a temp path, hard to predict exact path but we can check type or language
        args, _ = mock_analyze.call_args
        assert args[1] == "Portuguese"

def test_analyze_endpoint_no_file():
    data = {"target_language": "Portuguese"}
    response = client.post("/api/analyze", data=data)
    
    # FastAPI returns 422 Unprocessable Entity for missing required fields (File)
    assert response.status_code == 422

def test_analyze_endpoint_large_file(mock_gemini_response):
    # Create a large content > 20MB
    # Since we don't want to allocate 20MB in memory if we can avoid it, 
    # but for test correctness we should.
    # If memory is an issue, we can mock the 'tell' method of the file object.
    
    with patch("app.main.analyze_audio") as mock_analyze:
        # We can simulate the file object in the request.
        # However, TestClient creates the file object.
        # We can MOCK the file validation logic or just send a large file.
        # Sending 21MB in local test environment is usually fine.
        
        large_content = b"0" * (20 * 1024 * 1024 + 100) # 20MB + 100 bytes
        files = {"file": ("large.mp3", large_content, "audio/mpeg")}
        data = {"target_language": "Portuguese"}
        
        response = client.post("/api/analyze", files=files, data=data)
        
        assert response.status_code == 413
        assert "File too large" in response.json()["detail"] 
