# Mheshimiwa Watch 🇰🇪  
**AI-Powered Political Accountability Tracker for Kenya**  

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://your-vercel-link.vercel.app)  
[![Powered by DeepSeek-R1](https://img.shields.io/badge/Powered%20by-DeepSeek--R1-6e48aa?logo=openai)](https://openrouter.ai/models/deepseek/deepseek-r1:free)  

## 🌟 Why This Project?  
Kenya’s political landscape suffers from **broken promises** and **limited transparency**. This tool empowers citizens by:  
- Tracking manifesto pledges against actual delivery  
- Centralizing hard-to-find government reports  
- Providing **AI-verified summaries** of political performance  

## 🤖 Why DeepSeek-R1?  
We chose this model because:  

| Feature               | Benefit for Kenya                                  |
|-----------------------|---------------------------------------------------|
| **Free via OpenRouter** | No API costs for civic tech                       |
| **163K context**      | Analyzes long PDFs (manifestos, audit reports)    |
| **Open-source**       | Avoids proprietary lock-in                        |
| **Kiswahili support** | Handles local languages natively                  |

*Alternatives considered: GPT-4 (costly), Claude (limited Kenya knowledge), local models (low accuracy).*

## 🛠️ Tech Stack  
**Backend**  
- Python + FastAPI  
- DeepSeek-R1 via OpenRouter  
- SQLite (query history cache)  

**Frontend**  
- Next.js 14 (App Router)  
- TailwindCSS  
- ShadCN UI  

## 🚀 Setup Guide  

### 1. Backend Setup  
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate (Windows)

pip install -r requirements.txt