import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

def test_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    print(f"API Key found: {api_key[:5]}...{api_key[-5:]}" if api_key else "No API Key found")
    
    if not api_key:
        return

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content("Merhaba, test 1-2-3. JSON formatında 'status':'ok' döner misin?")
        print("Response received:")
        print(response.text)
    except Exception as e:
        print(f"Error occurred: {e}")

if __name__ == "__main__":
    test_gemini()
