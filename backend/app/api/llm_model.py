import ollama
from groq import Groq


client = Groq(api_key="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")


def analyze_basic(text):
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You analyze civic complaints."},
            {"role": "user", "content": text}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content


print(analyze_basic("Garbage is overflowing near the market area"))