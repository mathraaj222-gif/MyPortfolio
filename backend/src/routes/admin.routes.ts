import { Router } from 'express';
import { getProjects } from '../controllers/project.controller';
import { createProject, updateProject, deleteProject } from '../controllers/admin.project.controller';
import { getSkills, createSkill, deleteSkill } from '../controllers/skill.controller';
import { getHomepage, updateHomepage } from '../controllers/homepage.controller';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../controllers/experience.controller';
import { getEducation, createEducation, updateEducation, deleteEducation } from '../controllers/education.controller';
import { getCertificates, createCertificate, updateCertificate, deleteCertificate } from '../controllers/certificate.controller';
import { verifyToken } from '../middleware/auth.middleware';

const router = Router();

// Protect ALL admin routes — every request (read and write) carries the Bearer JWT
router.use(verifyToken);

// Homepage
router.get('/homepage', getHomepage);
router.put('/homepage', updateHomepage);

// Projects
router.get('/projects', getProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Experiences
router.get('/experiences', getExperiences);
router.post('/experiences', createExperience);
router.put('/experiences/:id', updateExperience);
router.delete('/experiences/:id', deleteExperience);

// Education
router.get('/education', getEducation);
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Skills
router.get('/skills', getSkills);
router.post('/skills', createSkill);
router.delete('/skills/:id', deleteSkill);

// Certificates
router.get('/certificates', getCertificates);
router.post('/certificates', createCertificate);
router.put('/certificates/:id', updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

export default router;