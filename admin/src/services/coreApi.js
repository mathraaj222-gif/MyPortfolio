/**
 * coreApi.js
 * Centralised API client for the Admin panel.
 *
 * Every call to an /api/v1/admin/* endpoint MUST carry
 *   Authorization: Bearer <VITE_ADMIN_TOKEN>
 * This module injects that header automatically so individual
 * pages never have to think about auth.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const ADMIN_TOKEN  = import.meta.env.VITE_ADMIN_TOKEN || '';

/**
 * Authenticated fetch — always sends the Bearer token.
 * @param {string} path   - path relative to API_BASE_URL, e.g. '/admin/homepage'
 * @param {RequestInit} options - standard fetch options (method, body, etc.)
 * @returns {Promise<any>} parsed JSON response body
 */
async function authFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    Authorization: `Bearer ${ADMIN_TOKEN}`,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  return data;
}

// ─── Public read helpers (no auth needed) ────────────────────────────────────

export async function getHomepage() {
  const res = await fetch(`${API_BASE_URL}/homepage`);
  return res.json();
}

export async function getProjects() {
  const res = await fetch(`${API_BASE_URL}/projects`);
  return res.json();
}

export async function getExperiences() {
  const res = await fetch(`${API_BASE_URL}/experiences`);
  return res.json();
}

export async function getEducation() {
  const res = await fetch(`${API_BASE_URL}/education`);
  return res.json();
}

export async function getSkills() {
  const res = await fetch(`${API_BASE_URL}/skills`);
  return res.json();
}

export async function getCertificates() {
  const res = await fetch(`${API_BASE_URL}/certificates`);
  return res.json();
}

// ─── Admin write helpers (JWT injected automatically) ─────────────────────────

// Homepage
export const updateHomepage = (body) =>
  authFetch('/admin/homepage', { method: 'PUT', body: JSON.stringify(body) });

// Projects
export const createProject = (body) =>
  authFetch('/admin/projects', { method: 'POST', body: JSON.stringify(body) });

export const updateProject = (id, body) =>
  authFetch(`/admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteProject = (id) =>
  authFetch(`/admin/projects/${id}`, { method: 'DELETE' });

// Experiences
export const createExperience = (body) =>
  authFetch('/admin/experiences', { method: 'POST', body: JSON.stringify(body) });

export const updateExperience = (id, body) =>
  authFetch(`/admin/experiences/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteExperience = (id) =>
  authFetch(`/admin/experiences/${id}`, { method: 'DELETE' });

// Education
export const createEducation = (body) =>
  authFetch('/admin/education', { method: 'POST', body: JSON.stringify(body) });

export const updateEducation = (id, body) =>
  authFetch(`/admin/education/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteEducation = (id) =>
  authFetch(`/admin/education/${id}`, { method: 'DELETE' });

// Skills
export const createSkill = (body) =>
  authFetch('/admin/skills', { method: 'POST', body: JSON.stringify(body) });

export const deleteSkill = (id) =>
  authFetch(`/admin/skills/${id}`, { method: 'DELETE' });

// Certificates
export const createCertificate = (body) =>
  authFetch('/admin/certificates', { method: 'POST', body: JSON.stringify(body) });

export const updateCertificate = (id, body) =>
  authFetch(`/admin/certificates/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteCertificate = (id) =>
  authFetch(`/admin/certificates/${id}`, { method: 'DELETE' });
