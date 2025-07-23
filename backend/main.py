from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Any
from datetime import datetime
from database import create_connection
import mysql.connector

# Load environment variables first
load_dotenv()

# create a fastApi application instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client with OpenRouter
# Get your key from https://openrouter.ai/keys
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

class UserQuery(BaseModel):
    question: str
    # Optional session ID for continuing conversations
    session_id: int = None

class ChatHistoryItem(BaseModel):
    question: str
    answer: str
    timestamp: str

@app.post("/ask")
async def ask_ai(query: UserQuery):
    try:
        completion = client.chat.completions.create(
            extra_headers={
                "HTTP-Referer": "https://github.com/HassanMunene/mheshimiwa-watch",
                "X-Title": "Mheshimiwa Watch",
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
        answer = completion.choices[0].message.content
        
        #store in DB
        connection = create_connection()
        if connection:
            cursor = connection.cursor()
            # Create new session if no session_id provided
            if not query.session_id:
                cursor.execute("INSERT INTO chat_sessions () VALUES ()")
                session_id = cursor.lastrowid
            else:
                session_id = query.session_id
            
            # Store the chat
            cursor.execute(
                "INSERT INTO chat_history (session_id, question, answer) VALUES (%s, %s, %s)",
                (session_id, query.question, answer)
            )
            
            connection.commit()
            connection.close()
            return {
                "answer": answer,
                "session_id": session_id
            }
        else:
           return {"error": "Database connection failed"} 
    except Exception as e:
        return {"error": str(e)}
    

@app.get("/chat-history", response_model=List[Dict[str, Any]])
async def get_chat_history(limit: int = 10):
    try:
        connection = create_connection()
        if connection:
            cursor = connection.cursor(dictionary=True)
            
            # Get the most recent chat sessions with their first question
            cursor.execute("""
                SELECT s.session_id, h.question, h.timestamp 
                FROM chat_sessions s
                JOIN chat_history h ON s.session_id = h.session_id
                WHERE h.chat_id IN (
                    SELECT MIN(chat_id) 
                    FROM chat_history 
                    GROUP BY session_id
                )
                ORDER BY h.timestamp DESC
                LIMIT %s
            """, (limit,))
            
            sessions = cursor.fetchall()
            
            # Format the response correctly
            result = []
            current_month = None
            for session in sessions:
                timestamp = session['timestamp']
                month_year = timestamp.strftime("%Y-%m")
                
                if month_year != current_month:
                    current_month = month_year
                    result.append({
                        "date": timestamp.strftime("%B %Y"),
                        "chats": []
                    })
                
                # Add the chat as an object with question and timestamp
                result[-1]["chats"].append({
                    "question": session['question'],
                    "timestamp": timestamp.isoformat(),
                    "session_id": session['session_id']
                })
            
            connection.close()
            return result
        else:
            raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# get chat hsotiry for a specific session we are doing.
@app.get("/session-history/{session_id}", response_model=List[ChatHistoryItem])
async def get_session_history(session_id: int):
    try:
        connection = create_connection()
        if connection:
            cursor = connection.cursor(dictionary=True)
            
            cursor.execute("""
                SELECT question, answer, timestamp
                FROM chat_history
                WHERE session_id = %s
                ORDER BY timestamp ASC
            """, (session_id,))
            
            history = cursor.fetchall()
            connection.close()
            
            # Convert datetime objects to strings
            for item in history:
                item['timestamp'] = item['timestamp'].isoformat()
            
            return history
        else:
            raise HTTPException(status_code=500, detail="Database connection failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))