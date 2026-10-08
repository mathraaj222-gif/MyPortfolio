const AI_API_URL = (import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1/ai').replace(/\/$/, '');

// Session cache to prevent repeated identical requests
const queryCache = new Map();

/**
 * Main query function to fetch AI guide response from Python FastAPI microservice
 */
export async function queryAiGuide(query, fallbackData = null) {
  const cacheKey = query.toLowerCase().trim();
  if (queryCache.has(cacheKey)) {
    return queryCache.get(cacheKey);
  }

  try {
    const res = await fetch(`${AI_API_URL}/guide`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        queryCache.set(cacheKey, json.data);
        return json.data;
      }
    }
    throw new Error(`Server returned status ${res.status}`);
  } catch (err) {
    console.warn(`Network call to ${AI_API_URL}/guide failed, running strict client fallback:`, err);
    if (fallbackData) {
      const synthesized = synthesizeStrictClientFallback(query, fallbackData);
      queryCache.set(cacheKey, synthesized);
      return synthesized;
    }
    throw err;
  }
}

/**
 * Strict Minimalist Client Fallback (Strict relevance - zero padding, zero hallucination)
 */
function synthesizeStrictClientFallback(query, data) {
  const lower = query.toLowerCase().trim();
  const tokens = lower.replace(/[?,.!]/g, '').split(/\s+/).filter((t) => t.length > 2);

  const projects = data.projects || [];
  const experiences = data.experiences || [];
  const certificates = data.certificates || [];
  const skills = data.skills || [];

  const textMatches = (str = '') => {
    if (!str) return false;
    const l = str.toLowerCase();
    return tokens.some((t) => l.includes(t));
  };

  const listMatches = (arr = []) => arr.some(textMatches);

  const matchedProj = projects.filter(
    (p) => textMatches(p.project_title) || textMatches(p.project_description) || listMatches(p.project_tech_stacks)
  );

  const matchedExp = experiences.filter(
    (e) =>
      textMatches(e.company_name) ||
      textMatches(e.job_role) ||
      textMatches(e.description_job) ||
      listMatches(e.technical_stacks) ||
      listMatches(e.project_description)
  );

  const matchedCert = certificates.filter(
    (c) => textMatches(c.certificate_name) || textMatches(c.certificate_bodies) || textMatches(c.credential_id)
  );

  const matchedSkills = skills.filter((s) => textMatches(s.skill_name));

  const totalMatches = matchedProj.length + matchedExp.length + matchedCert.length;

  // CASE 1: ZERO direct matches (e.g. Fintech) - Do NOT pad or show irrelevant items!
  if (totalMatches === 0) {
    const isFintech = lower.includes('fintech') || lower.includes('payment') || lower.includes('finance');
    const topic = isFintech ? 'FinTech / Payment Systems' : `"${query}"`;

    return {
      answer: `Mathanraaj does not currently list any direct projects, work experience, or certifications in ${topic}. His portfolio focuses on AI/NLP Systems (Hate Speech Detection) and Full-Stack Web Development (React, Node.js, PostgreSQL). There are no verified ${topic} credentials on record.`,
      summary: `No direct ${topic} credentials on record`,
      genUi: {
        layout: 'no_direct_match',
        topic,
        title: `No Direct ${topic} Credentials Found`,
        badge: '0 Direct Matches',
        summary: `A strict search across projects, employment history, and certifications returned no records for ${topic}.`,
        transferableSkills: ['PostgreSQL', 'Node.js', 'Docker', 'React'],
        sections: [], // Strictly empty!
      },
      citations: [], // Strictly empty!
      suggestedQuestions: [
        'Show me your AI & Machine Learning project',
        'What verified certifications do you have?',
        'What full-stack web applications have you built?',
      ],
    };
  }

  // CASE 2: Matches found - build strictly matching sections
  const citations = [];
  matchedProj.forEach((p) => {
    citations.push({
      id: `cite-proj-${p.id}`,
      type: 'project',
      title: p.project_title,
      reference: p.project_github_link ? 'GitHub' : 'Live Application',
      link: p.project_live_link || p.project_github_link,
      targetId: p.id,
    });
  });

  matchedCert.forEach((c) => {
    citations.push({
      id: `cite-cert-${c.id}`,
      type: 'certificate',
      title: c.certificate_name,
      reference: c.credential_id ? `ID: ${c.credential_id}` : 'Verified Credential',
      link: c.certificate_img_url,
      targetId: c.id,
    });
  });

  matchedExp.forEach((e) => {
    citations.push({
      id: `cite-exp-${e.id}`,
      type: 'experience',
      title: `${e.job_role} @ ${e.company_name}`,
      reference: 'Verified Work Timeline',
      targetId: e.id,
    });
  });

  const sections = [];
  if (matchedProj.length > 0) {
    sections.push({
      type: 'projects',
      heading: `Directly Matching Projects (${matchedProj.length})`,
      itemIds: matchedProj.map((p) => p.id),
      highlightReason: 'Software implementations directly applying these skills.',
    });
  }
  if (matchedExp.length > 0) {
    sections.push({
      type: 'experience',
      heading: `Relevant Work Experience (${matchedExp.length})`,
      itemIds: matchedExp.map((e) => e.id),
      highlightReason: 'Commercial responsibilities and delivered timeline.',
    });
  }
  if (matchedCert.length > 0) {
    sections.push({
      type: 'certificates',
      heading: `Verified Credentials (${matchedCert.length})`,
      itemIds: matchedCert.map((c) => c.id),
      highlightReason: 'Official credentials verifying these competencies.',
    });
  }
  if (matchedSkills.length > 0) {
    sections.push({
      type: 'skills',
      heading: `Matching Skills (${matchedSkills.length})`,
      itemIds: matchedSkills.map((s) => s.id),
      items: matchedSkills,
    });
  }

  return {
    answer: `Found ${matchedProj.length} project(s), ${matchedExp.length} experience record(s), and ${matchedCert.length} credential(s) directly matching "${query}".`,
    summary: `Showcase for "${query}" with ${citations.length} verified citation(s)`,
    genUi: {
      layout: 'composite_showcase',
      title: `Verified Evidence for "${query}"`,
      badge: `${citations.length} Verified Items`,
      summary: `Strictly filtered to authentic portfolio items matching "${query}".`,
      sections,
    },
    citations,
    suggestedQuestions: [
      'What other projects have you developed?',
      'Show me your complete work history',
      'What programming languages are you strongest in?',
    ],
  };
}
