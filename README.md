# MyPortfolio

A professional portfolio application featuring a React-based frontend, a Node.js Express backend for data management, and a FastAPI-based AI backend for smart integrations.

## Repository Structure

The project is structured as a monorepo containing three core components:

*   **`frontend/`**: React + Vite + Lucide Icons web application.
*   **`backend/`**: Node.js + Express + TypeScript service using Prisma and Supabase for data persistence and authentication.
*   **`ai-backend/`**: Python + FastAPI service implementing AI assistants, search, or matching algorithms using OpenAI.

---

## Getting Started

### 1. Prerequisites

Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [npm](https://www.npmjs.com/)
*   [Python 3.10+](https://www.python.org/)
*   [Git](https://git-scm.com/)

---

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Set up environment variables:
    *   Create a `.env` file based on `.env.example` if applicable.
4.  Run the development server:
    ```bash
    npm run dev
    ```

---

### 3. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure database and environment variables:
    *   Copy `.env.example` to `.env` and configure your database URLs and Supabase keys:
        ```bash
        cp .env.example .env
        ```
4.  Run database migrations (Prisma):
    ```bash
    npx prisma migrate dev
    ```
5.  Run the development server:
    ```bash
    npm run dev
    ```

---

### 4. AI Backend Setup

1.  Navigate to the AI backend directory:
    ```bash
    cd ai-backend
    ```
2.  Set up a virtual environment:
    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Set up environment variables:
    *   Copy `.env.example` to `.env` and fill in the OpenAI and Supabase credentials.
5.  Run the FastAPI application:
    ```bash
    uvicorn app.main:app --reload
    ```

---

## License

This project is licensed under the MIT License.
