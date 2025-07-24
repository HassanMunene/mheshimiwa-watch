# Mheshimiwa Watch: Political Accountability Tracker 🇰🇪  
**AI-Powered Political Accountability Tracker for Kenya**  
![Mheshimiwa Screenshot](https://github.com/user-attachments/assets/d7217a9b-a1d4-4b78-b7bf-c1a92bbac715)

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://mheshimiwa-watch.vercel.app/)  
[![Powered by DeepSeek-R1](https://img.shields.io/badge/Powered%20by-DeepSeek--R1-6e48aa?logo=openai)](https://openrouter.ai/models/deepseek/deepseek-r1:free)

## Why This Project?
Kenya’s political landscape suffers from **broken promises** and **limited transparency**. This tool will empower us as citizens to enhance transparency and civic engagement in our beloved country by:  
- Tracking manifesto pledges against actual delivery
- Monitor legislative performance
- Centralizing hard-to-find government reports  
- Educate citizens on their rights and oversight mechanisms

This is more than a web app - it's a civic duty. In an era of digital transformation, we're harnessing technology to strengthen democracy from the ground up.

## Key Features
[-] AI-Powered Political Q&A: Get factual answers about government projects and officials
[-] Promise Tracker: Follow through on campaign commitments
[-] Corruption Reporting: Guided process for reporting misconduct
[-] Legislative Watch: Monitor MP attendance and voting records

## Important Usage Notes
API Limitations:
        We currently use DeepSeek's free AI model via OpenRouter
        Rate limiting (~100 requests/hour) may cause delays during peak times
        Token limits may temporarily restrict service if usage spikes

    Your Patience Powers Democracy:
        If you encounter delays, please wait 1-2 minutes before retrying
        Consider drafting concise questions to conserve resources

## Why DeepSeek-R1?  
We chose this model because:  

| Feature               | Benefit for Kenya                                  |
|-----------------------|---------------------------------------------------|
| **Free via OpenRouter** | No API costs for civic tech                       |
| **163K context**      | Analyzes long PDFs (manifestos, audit reports)    |
| **Open-source**       | Avoids proprietary lock-in                        |


## 🛠️ Tech Stack  
**Backend**  
- Python + FastAPI  
- DeepSeek-R1 via OpenRouter  
- MySQL Database (hosted on [Aiven Free MySQL](https://aiven.io/free-mysql-database))  

> 💡 **Note:** This project uses a cloud-hosted MySQL database on [Aiven](https://aiven.io/free-mysql-database), one of the few platforms currently offering free, reliable MySQL hosting — since most cloud providers have discontinued their free MySQL tiers.

**Frontend**  
- Next.js 14 (App Router)  
- TailwindCSS  
- ShadCN UI  

## Setup Guide  

### Prerequisites

    Node.js v16+ (Frontend)

    Python 3.10+ (Backend)

    MySQL 8.0+

    OpenAI API key (from OpenRouter)

Installation

    Clone the Repository


```
git clone https://github.com/HassanMunene/mheshimiwa-watch.git
cd mheshimiwa-watch
```

### Backend Setup
```
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Database Configuration
```
mysql -u root -p
CREATE DATABASE mheshimiwa_watch;
CREATE USER 'mhesh_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON mheshimiwa_watch.* TO 'mhesh_user'@'localhost';
FLUSH PRIVILEGES;
```

Environment Variables
Create .env in /backend:
env

DB_HOST=localhost
DB_USER=mhesh_user
DB_PASSWORD=your_password
DB_NAME=mheshimiwa_watch
OPENROUTER_API_KEY=your_openrouter_key

### Frontend Setup
```

    cd ../frontend
    npm install

    Environment Variables for Frontend

    Create a .env file in the /frontend directory:
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Running the Application

    Start Backend
```

cd backend
uvicorn main:app --reload
```

Start Frontend
```

cd ../frontend
npm run dev
```

Access the App
Open http://localhost:3000 in your browser
