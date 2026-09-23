/**
 * coreApi.js
 * Centralised API client for the Admin panel.
 *
 * All Admin API paths are strictly namespaced under /api/v1/admin/*:
 *   GET    /admin/homepage
 *   PUT    /admin/homepage
 *   GET    /admin/projects
 *   POST   /admin/projects
 *   PUT    /admin/projects/:id
 *   DELETE /admin/projects/:id
 *   ...and so on.
 *
 * Every request automatically carries:
 *   Authorization: Bearer <VITE_ADMIN_TOKEN>
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');
const ADMIN_TOKEN  = import.meta.env.VITE_ADMIN_TOKEN || '';

/**
 * Safely parse JSON from a response or extract text error.
 */
async function safeParseJson(res) {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data;
  } catch {
    return {
      success: false,
      message: text || `HTTP ${res.status}: ${res.statusText}`,
    };
  }
}

/**
 * Authenticated fetch — sends the Bearer token for all admin operations.
 * @param {string} path - path relative to API_BASE_URL, e.g. '/admin/homepage'
 * @param {RequestInit} options - standard fetch options (method, body, etc.)
 * @returns {Promise<any>} parsed JSON response body
 */
async function authFetch(path, options = {}) {
  try {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
      ...(ADMIN_TOKEN ? { Authorization: `Bearer ${ADMIN_TOKEN}` } : {}),
    };

    const res = await fetch(`${API_BASE_URL}${normalizedPath}`, { ...options, headers });
    return await safeParseJson(res);
  } catch (err) {
    console.error(`authFetch failed for ${path}:`, err);
    return {
      success: false,
      message: err.message || 'Network connection failed. Please check backend status.',
    };
  }
}

// ─── Admin Read Helpers (All under /admin/*) ──────────────────────────────────

export const getHomepage = () => authFetch('/admin/homepage');
export const getProjects = () => authFetch('/admin/projects');
export const getExperiences = () => authFetch('/admin/experiences');
export const getEducation = () => authFetch('/admin/education');
export const getSkills = () => authFetch('/admin/skills');
export const getCertificates = () => authFetch('/admin/certificates');

// ─── Admin Write Helpers (All under /admin/*) ─────────────────────────────────

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
