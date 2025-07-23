from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv


# Load environment variables first
load_dotenv()

# create a fastApi application instance
app = FastAPI()

# Initialize OpenAI client with OpenRouter
# Get your key from https://openrouter.ai/keys
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

class UserQuery(BaseModel):
    question: str

@app.post("/ask")
async def ask_ai(query: UserQuery):
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://github.com/HassanMunene/mheshimiwa-watch",  # Optional for OpenRouter stats
                "X-Title": "Mheshimiwa Watch",                   # Your app name
            },
            model="deepseek/deepseek-r1:free",
            messages=[
                {
                    "role": "system",
                    "content": "You are a Kenyan political accountability assistant. Provide structured responses with:\n"
                               "1. **Fact Source** (official documents)\n"
                               "2. **Progress Status** (Completed/In-Progress/Stalled)\n"
                               "3. **Verification Links** (gov't portals)\n"
                               "4. **Key Figures** (budgets, timelines)"
                },
                {
                    "role": "user",
                    "content": query.question
                }
            ]
        )
        return {"answer": completion.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}