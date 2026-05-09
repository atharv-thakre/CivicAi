#app/ai/llm/img.py

from google import genai
from bin.utils import parse_gemini_response
from bin.config import GEMINI_API_KEY
from app.ai.prompt import SYSTEM_PROMPT_03
from app.database.complaints import upsert_img_analysis

client = genai.Client(api_key=GEMINI_API_KEY)

def analyze_image(complaint_id : int , label : str = "main"):
    image_path = f"data/complaints/{complaint_id}/img_{label}.jpg"
    with open(image_path, "rb") as f:
        image_bytes = f.read()

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite-preview",
        contents=[
            {
                "role": "user",
                "parts": [
                    {"text": SYSTEM_PROMPT_03},
                    {
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": image_bytes
                        }
                    }
                ]
            }
        ]
    )

    analysis = parse_gemini_response(response)
    upsert_img_analysis(complaint_id, analysis)
    return analysis


