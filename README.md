
# 🧠 Smart Research Summarizer

An AI-powered assistant that transforms complex documents into concise summaries and interactive Q&A sessions. Upload a research paper or report, and get a clear summary, ask context-aware questions, or challenge yourself with logic-based quizzes — all grounded in the content of your document.

---

## 🌐 Live Demo

👉 [Try it on Vercel](https://your-vercel-url.vercel.app)  
*(Replace with your actual deployment URL)*

---

## 📂 Features

- 📄 **Document Upload** — Supports PDF, TXT, and DOCX
- 🧠 **Auto Summary** — Generates a ≤150-word overview instantly
- ❓ **Ask Anything** — Get accurate answers with source justification
- 🧩 **“Challenge Me” Quiz Mode** — Logic-based quizzes from the document
- 📌 **Answer Justifications** — Highlights relevant parts from the source

---

## 📸 UI Preview

![App Screenshot](screenshot.png)  
*(Add your actual UI screenshot here)*

---

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Frontend  | React, TypeScript, Tailwind CSS      |
| Backend   | FastAPI / Flask (Python)             |
| AI Engine | OpenAI / LangChain / Local LLMs      |
| Parsing   | PyMuPDF, pdfplumber, python-docx     |
| Hosting   | Vercel (frontend), Render / HF Spaces (backend) |

---

## ⚙️ Local Development

### 📦 Frontend (React)

```bash
git clone https://github.com/your-username/smart-research-summarizer.git
cd frontend
npm install
npm run dev
````

### 🔧 Backend (Python)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Example backend APIs to implement:

* `POST /upload` → parse + summarize document
* `POST /ask` → answer user question using content
* `POST /quiz` → generate logic-based questions

---

## 📁 Project Structure

```
smart-research-summarizer/
├── frontend/              # React UI hosted on Vercel
├── backend/               # Python API (Flask or FastAPI)
│   ├── summarizer.py
│   ├── question_answering.py
│   ├── quiz_generator.py
├── public/
│   └── screenshot.png     # UI preview
├── README.md
```

---

## 🧪 Demo Scenarios

> **Auto Summary**
>
> * Uploads a PDF, instantly summarizes it within 150 words.

> **Ask Anything**
>
> * User: "What are the technologies used?"
> * Assistant: "Python, LangChain, Streamlit... Source: Features section."

> **Challenge Me Mode**
>
> * App generates: “Which feature helps users test logic-based understanding?”
> * User: “Challenge Me”
> * Assistant: “Correct! Source: Features section.”

---

## 📤 Deployment

### ✅ Vercel (Frontend)

* Connect GitHub to Vercel
* Set output directory to `frontend`
* Auto-deploys on push

### ✅ Render / Railway / Hugging Face (Backend)

* Deploy Python app exposing:

  * `/upload` for summary
  * `/ask` for QA
  * `/quiz` for quiz logic

---

## 🎥 Optional Demo Video

> [![Watch the demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/hqdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

---

## 👨‍💻 Team

* **Vedansh Goyal** — Frontend Development
* **Akshama Chauhan** — Backend & Blockchain Integration

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgments

* EZ AI Team – for the challenge
* OpenAI & LangChain – for model support
* Unstop / Crave the Code – for organizing the hackathon

```

---

Would you like me to generate:
- A minimal Flask or FastAPI backend to go with this?
- A 2-minute pitch script for a Loom or YouTube demo?

Let me know and I’ll build it out!
```
