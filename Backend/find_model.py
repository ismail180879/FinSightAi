import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def list_flash():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("No API Key")
        return

    genai.configure(api_key=api_key)
    print("Available Flash models:")
    for m in genai.list_models():
        if 'flash' in m.name.lower():
            print(f"- {m.name}")

if __name__ == "__main__":
    list_flash()
