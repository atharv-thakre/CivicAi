import asyncio , ollama
from groq import Groq
from bin.config import GROQ_API_KEY


client = Groq(api_key=GROQ_API_KEY)

async def ollama_call(
    messages: list,
    model: str = "qwen2.5:7b",
    timeout: int = 20
) -> str:
    loop = asyncio.get_running_loop()

    def _sync_call():
        return ollama.chat(
            model=model,
            messages=messages
        )

    try:
        response = await asyncio.wait_for(
            loop.run_in_executor(None, _sync_call),
            timeout=timeout
        )

        return response["message"]["content"]

    except asyncio.TimeoutError:
        return "⚠️ LLM timeout"

    except Exception as e:
        return f"⚠️ LLM error: {str(e)}"
    

async def groq_call(
    messages: list,
    model: str = "llama-3.1-8b-instant",
    timeout: int = 20
) -> str:
    loop = asyncio.get_running_loop()

    def _sync_call():
        return client.chat.completions.create(
            model=model,
            messages=messages
        )

    try:
        response = await asyncio.wait_for(
            loop.run_in_executor(None, _sync_call),
            timeout=timeout
        )

        return response.choices[0].message.content

    except asyncio.TimeoutError:
        return "⚠️ LLM timeout"

    except Exception as e:
        return f"⚠️ LLM error: {str(e)}"
    
