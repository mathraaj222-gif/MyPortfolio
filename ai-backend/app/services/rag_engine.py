import json
import os
import time
from typing import Dict, List, Any, Optional
from supabase import create_client, Client
from app.core.config import settings

# Global cache for database content
_cache: Optional[Dict[str, Any]] = None
_cache_time: float = 0.0
CACHE_TTL_SECONDS = 180.0  # 3 minutes

def get_supabase_client() -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)

def fetch_portfolio_data() -> Dict[str, Any]:
    global _cache, _cache_time
    now = time.time()
    if _cache is not None and (now - _cache_time < CACHE_TTL_SECONDS):
        return _cache

    client = get_supabase_client()
    homepage_res = client.table("Homepage").select("*").limit(1).execute()
    exp_res = client.table("Experiance").select("*").order("start_date", desc=True).execute()
    edu_res = client.table("Education").select("*").order("start_date", desc=True).execute()
    proj_res = client.table("Projects").select("*").order("id", desc=True).execute()
    skills_res = client.table("Skills").select("*").order("id").execute()
    certs_res = client.table("Certificates").select("*").order("date_received", desc=True).execute()

    _cache = {
        "homepage": homepage_res.data[0] if homepage_res.data else None,
        "experiences": exp_res.data or [],
        "education": edu_res.data or [],
        "projects": proj_res.data or [],
        "skills": skills_res.data or [],
        "certificates": certs_res.data or [],
    }
    _cache_time = now
    return _cache

SYSTEM_PROMPT = """
You are the intelligent AI Portfolio Guide for Mathanraaj.
Your job is to understand questions asked by portfolio visitors, analyze Mathanraaj's authentic portfolio data, and return a dynamic, structured JSON response with a tailored layout.

CRITICAL ARCHITECTURE RULES:
1. DEEP SEMANTIC UNDERSTANDING:
   - Truly understand what the user is asking (intent, context, technology, role, experience).
   - Never do dumb keyword matching. Evaluate meaning and relevance against Mathanraaj's real projects, work experiences, certifications, and skills.

2. CHOOSE EXACTLY ONE LAYOUT PER QUESTION:
   - You must select ONLY ONE layout archetype based on the number and type of evidence components:
     * "gap_analysis": Selected when there are ZERO direct matching components in Mathanraaj's portfolio (e.g. asking about FinTech, Blockchain, or a domain he has never worked in). Be completely honest and transparent about the gap, and highlight what his actual core specializations are instead.
     * "project_showcase": Selected when the primary evidence is 1 specific Project. Focus entirely on that project: high-resolution architecture explanation answering the question, tech stack, and links.
     * "experience_highlight": Selected when the primary evidence is 1 specific work role / commercial Experience. Focus on commercial impact, real responsibilities, timeline, and leadership quotes.
     * "credential_card": Selected when the question is specifically about 1 Certification / academic credential. Focus on the official accreditation, credential ID, and verified skills.
     * "modular_systems": Selected when multiple components (2 or more projects, experiences, or full-stack domains) provide the evidence (e.g. asking about full-stack skills, general background, or overarching systems architecture). Present 2 to 4 clean modular system boxes explaining each pillar.

3. ZERO PLACEHOLDER OR GRAPHIC DESIGN JARGON:
   - NEVER include graphic-design dummy text like "Font Choice", "Line Height", "Whitespace", "Gothic Neue Bold", "Column A", "Issue #14", "Vol. 03", "H1/H2", "Typographic Rules", etc.
   - All titles, subtitles, quotes, descriptions, and bullets MUST be genuine sentences about Mathanraaj's engineering work and answers to the visitor's question.

OUTPUT SCHEMA (MUST BE STRICT JSON):
{
  "answer": "Direct conversational answer to the visitor's question in 2-3 clear, insightful sentences.",
  "summary": "Brief 1-line summary badge.",
  "genUi": {
    "layoutType": "gap_analysis" | "project_showcase" | "experience_highlight" | "credential_card" | "modular_systems",
    "title": "Contextual title answering the user's topic",
    "subtitle": "Informative subtitle describing the focus",
    "badge": "Tag such as 'VERIFIED PROJECT' or 'HONEST EVALUATION' or 'COMMERCIAL IMPACT'",
    "card": {
      "topic": "The asked domain/topic",
      "headline": "No Direct Commercial Records in [Topic]",
      "bullets": ["Detail 1 on checked records", "Detail 2 on primary focus areas"],
      "transferableSkills": ["PostgreSQL", "React", "Node.js", "Docker"],
      "clarification": "Clear statement of Mathanraaj's actual engineering focus.",
      "projectTitle": "Project Name",
      "imageUrl": "Project pic url from database if available",
      "narrative": "Detailed 3-4 sentence explanation answering how Mathanraaj solved the problem in this project",
      "stacks": ["Tech 1", "Tech 2", "Tech 3"],
      "githubUrl": "github link if available",
      "liveUrl": "live link if available",
      "company": "Company Name",
      "role": "Role Title",
      "tenure": "Start to End date",
      "insightTitle": "Key Commercial Impact",
      "quote": "Direct quote summarizing engineering contribution in this role.",
      "certificateName": "Certification Name",
      "issuer": "Issuing Body",
      "credentialId": "Credential ID",
      "issueDate": "Date received",
      "verificationSummary": "What this credential certifies Mathanraaj in.",
      "systemsTitle": "Architecture & Engineering Pillars",
      "description": "High-level summary of how these components connect.",
      "boxes": [
        {"code": "SYS-01", "label": "Pillar 1 Name", "desc": "Concrete implementation details and tech."},
        {"code": "SYS-02", "label": "Pillar 2 Name", "desc": "Concrete implementation details and tech."},
        {"code": "SYS-03", "label": "Pillar 3 Name", "desc": "Concrete implementation details and tech."}
      ]
    }
  },
  "citations": [
    {
      "id": "cite-1",
      "type": "project" | "experience" | "certificate",
      "title": "Item name",
      "reference": "Source reference",
      "link": "url or null"
    }
  ],
  "suggestedQuestions": ["Follow up question 1", "Follow up question 2", "Follow up question 3"]
}
"""

def analyze_portfolio_strictly(query: str, data: Dict[str, Any]) -> Dict[str, Any]:
    groq_api_key = settings.GROQ_API_KEY or os.environ.get("GROQ_API_KEY")

    if not groq_api_key or groq_api_key.strip() == "":
        return _build_api_key_missing_response(query)

    try:
        from groq import Groq
        client = Groq(api_key=groq_api_key.strip())

        portfolio_context = {
            "developer": data.get("homepage", {}),
            "projects": [
                {
                    "id": p.get("id"),
                    "title": p.get("project_title"),
                    "description": p.get("project_description"),
                    "tech_stacks": p.get("project_tech_stacks"),
                    "github": p.get("project_github_link"),
                    "live": p.get("project_live_link"),
                    "images": p.get("project_pic_url"),
                }
                for p in data.get("projects", [])
            ],
            "experiences": [
                {
                    "id": e.get("id"),
                    "company": e.get("company_name"),
                    "role": e.get("job_role"),
                    "description": e.get("description_job"),
                    "project_bullets": e.get("project_description"),
                    "tech_stacks": e.get("technical_stacks"),
                    "start": e.get("start_date"),
                    "end": e.get("end_date"),
                    "currently_working": e.get("currently_working"),
                }
                for e in data.get("experiences", [])
            ],
            "certificates": [
                {
                    "id": c.get("id"),
                    "name": c.get("certificate_name"),
                    "issuer": c.get("certificate_bodies"),
                    "credential_id": c.get("credential_id"),
                    "date": c.get("date_received"),
                }
                for c in data.get("certificates", [])
            ],
            "skills": [s.get("skill_name") for s in data.get("skills", []) if s.get("skill_name")],
        }

        user_content = (
            f"USER QUERY: {query}\n\n"
            f"AUTHENTIC DATABASE CONTEXT:\n{json.dumps(portfolio_context, indent=2)}\n\n"
            f"Respond with the requested JSON object selecting EXACTLY ONE layout. Include accurate citations."
        )

        candidate_models = [settings.GROQ_MODEL, "openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"]
        unique_models = []
        for m in candidate_models:
            if m and m not in unique_models:
                unique_models.append(m)

        chat_completion = None
        last_error = None
        for model_name in unique_models:
            try:
                chat_completion = client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": user_content}
                    ],
                    model=model_name,
                    temperature=0.2,
                    response_format={"type": "json_object"}
                )
                break
            except Exception as err:
                last_error = err
                print(f"[RAG Engine] Model {model_name} failed: {err}")

        if not chat_completion:
            raise last_error or Exception("No candidate models succeeded")

        response_text = chat_completion.choices[0].message.content
        parsed = json.loads(response_text)

        # Standardize structure for frontend
        gen_ui = parsed.get("genUi", {})
        if "card" in gen_ui and "cards" not in gen_ui:
            gen_ui["cards"] = [gen_ui["card"]]
        parsed["genUi"] = gen_ui

        return parsed

    except Exception as e:
        print(f"[RAG Engine] Error: {e}")
        return _build_fallback_response(query, str(e), data)

def _build_api_key_missing_response(query: str) -> Dict[str, Any]:
    return {
        "answer": f"I received your query: '{query}'. However, my Groq API key is not configured.",
        "summary": "SYSTEM CONFIGURATION ERROR",
        "genUi": {
            "layoutType": "gap_analysis",
            "title": "API Key Missing",
            "subtitle": "Cannot process AI request",
            "badge": "SYSTEM ERROR",
            "cards": [{
                "topic": "AI Configuration",
                "headline": "Groq API Key Required",
                "bullets": ["Set GROQ_API_KEY in the environment."],
                "transferableSkills": [],
                "clarification": "Once configured, I can generate dynamic responses."
            }]
        },
        "citations": [],
        "suggestedQuestions": []
    }

def _build_fallback_response(query: str, error_msg: str, data: Dict[str, Any]) -> Dict[str, Any]:
    projects = data.get("projects", [])
    project_count = len(projects)
    fallback_answer = f"I encountered an error processing your query. Mathanraaj has {project_count} projects."
    return {
        "answer": fallback_answer,
        "summary": "FALLBACK RESPONSE",
        "genUi": {
            "layoutType": "modular_systems",
            "title": "Fallback Overview",
            "subtitle": "System encountered an error",
            "badge": "ERROR",
            "cards": [{
                "systemsTitle": "Error Details",
                "description": f"An error occurred: {error_msg}",
                "boxes": [{"code": "ERR", "label": "System Notice", "desc": "Falling back to basic response."}]
            }]
        },
        "citations": [],
        "suggestedQuestions": ["Can you try again?"]
    }
