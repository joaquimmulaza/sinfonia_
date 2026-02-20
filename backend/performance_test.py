import httpx
import time
import asyncio
import wave
import math
import struct
import os

def generate_test_audio(filename="test_audio.wav", duration_seconds=5):
    """Generates a simple sine wave audio file for testing."""
    sample_rate = 44100
    frequency = 440.0 # A4 note
    num_samples = int(duration_seconds * sample_rate)
    
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1) # mono
        wav_file.setsampwidth(2) # 2 bytes per sample (16-bit)
        wav_file.setframerate(sample_rate)
        
        for i in range(num_samples):
            value = int(32767.0 * math.sin(2.0 * math.pi * frequency * i / sample_rate))
            data = struct.pack('<h', value)
            wav_file.writeframesraw(data)

async def run_test():
    print("Preparing Performance Test...")
    audio_file = "test_audio.wav"
    generate_test_audio(audio_file, duration_seconds=5) # 5 seconds of audio
    print(f"Test audio generated: {audio_file}")
    
    url = "http://localhost:8000/api/analyze"
    target_language = "pt"
    
    print(f"\nTarget Endpoint: {url}")
    print(f"Target Language: {target_language}")
    print("-" * 50)
    
    async with httpx.AsyncClient() as client:
        with open(audio_file, "rb") as f:
            files = {"file": (audio_file, f, "audio/wav")}
            data = {"target_language": target_language}
            
            print("Sending request to API... (this may take up to 45 seconds)")
            start_time = time.time()
            try:
                # Using a 120s timeout since Gemini can take a while
                response = await client.post(url, data=data, files=files, timeout=120.0)
                end_time = time.time()
                
                duration = end_time - start_time
                
                print("-" * 50)
                print(f"Status Code: {response.status_code}")
                if response.status_code == 200:
                    print(f"\n✅ SUCCESS! Request completed in {duration:.2f} seconds.")
                    # Print a summary of the response to ensure it's well formed
                    json_res = response.json()
                    print(f"\nResponse Title: {json_res.get('title')}")
                    print(f"Vibe: {json_res.get('vibe')}")
                else:
                    print(f"\n❌ FAILED! Response time: {duration:.2f} seconds.")
                    print(f"Response Body: {response.text}")
                    
            except Exception as e:
                end_time = time.time()
                duration = end_time - start_time
                print("-" * 50)
                print(f"\n❌ ERROR! Request failed after {duration:.2f} seconds.")
                print(f"Exception: {e}")
                
    # Clean up the test audio file
    if os.path.exists(audio_file):
        os.remove(audio_file)
        print(f"\nCleaned up {audio_file}")

if __name__ == "__main__":
    asyncio.run(run_test())
