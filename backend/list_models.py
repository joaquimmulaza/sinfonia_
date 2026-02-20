import google.genai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

print("Listing models...")
try:
    # List models that support generateContent
    with open("models.txt", "w") as f:
        for model in client.models.list():
            f.write(f"Model: {model.name}\n")
            print(f"Model: {model.name}")
except Exception as e:
    print(f"Error listing models: {e}")
