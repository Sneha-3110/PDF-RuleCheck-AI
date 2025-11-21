# 📄 LLM PDF Checker: AI Document Compliance Tool

This project implements a simple full-stack web application designed to check a PDF document against a set of user-defined rules using a Large Language Model (LLM). It provides structured feedback, including a PASS/FAIL status, supporting evidence, reasoning, and a confidence score for each rule check.

## ✨ Features

* **PDF Upload:** Allows the user to upload any PDF file (2-10 pages).
* **Rule Input:** Accepts 3 custom, plain-language rules (e.g., "The document must list any requirements.").
* **LLM Analysis (Gemini API):** Extracts text from the PDF and uses the Gemini model to analyze the text against the rules.
* **Structured Output:** Returns results in a clear table format, including:
    * **Status:** PASS or FAIL
    * **Evidence:** A supporting sentence from the PDF.
    * **Reasoning:** A concise explanation.
    * **Confidence:** A score from 0-100 indicating the LLM's certainty in its finding.
* **Modern UI:** Built with React and styled using Tailwind CSS for a modern, responsive interface.

## 🚀 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS | Fast development environment and modern, utility-first styling. |
| **Backend** | Node.js (Express) | Simple, lightweight server for handling API routes and middleware. |
| **LLM Engine** | Gemini API (`@google/genai`) | Used for natural language reasoning and structured JSON output generation. |
| **PDF Processing**| `pdf-text-extract` | Used to reliably extract text content from the uploaded PDF file. |

## ⚙️ Setup and Installation

Follow these steps to get the project running locally.

### Prerequisites

1.  **Node.js:** (v18+) and npm installed.
2.  **Gemini API Key:** Obtain a key from Google AI Studio.

### 1. Project Structure

This project uses a monorepo structure with separate folders for the client and server:

```bash
pdf-checker/ 
    ├── frontend/ (React client) 
    ├── backend/ (Node/Express server) 
    └── README.md
```

### 2. Backend Setup (Server)

1.  **Navigate** to the backend directory:
    ```bash
    cd backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure Environment Variables:**
    Create a file named **`.env`** in the `backend/` directory and add your Gemini API key:
    ```dotenv
    # Replace YOUR_API_KEY with your actual Gemini API Key
    GEMINI_API_KEY="YOUR_API_KEY_HERE"
    ```
4.  **Start the Server:**
    ```bash
    npm start
    ```
    The server will run on `http://localhost:3000`.

### 3. Frontend Setup (Client)

1.  **Navigate** to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the Client:**
    ```bash
    npm run dev
    ```
    The application will typically open in your browser at `http://localhost:5173`.

## 💻 Usage

1.  Ensure both the **Backend** and **Frontend** are running.
2.  Open the application in your browser.
3.  **Upload a PDF** document (for best results, use a text-based PDF, not a scanned image).
4.  **Enter up to 3 rules** in the text boxes provided. Examples:
    * "The document must define at least one term."
    * "The document must mention a date of publication."
    * "The document must clearly state who is the document owner."
5.  Click **"Check Document with LLM"**.
6.  The results will appear in a structured table below the form.

## 🖼️ UI Screenshot

<img width="1899" height="908" alt="Screenshot 2025-11-21 184658" src="https://github.com/user-attachments/assets/99ebc7ee-fa17-4572-ba17-6bb0052eb65b" />
<img width="1902" height="905" alt="Screenshot 2025-11-21 184718" src="https://github.com/user-attachments/assets/6fd19bde-4dd0-4850-98fd-dfb02820b8e3" />