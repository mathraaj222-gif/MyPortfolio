import { Router } from 'express';
import { createProject, updateProject, deleteProject } from '../controllers/admin.project.controller';
import { createSkill, deleteSkill } from '../controllers/skill.controller';
import { updateHomepage } from '../controllers/homepage.controller';
import { createExperience, updateExperience, deleteExperience } from '../controllers/experience.controller';
import { createEducation, updateEducation, deleteEducation } from '../controllers/education.controller';
import { createCertificate, updateCertificate, deleteCertificate } from '../controllers/certificate.controller';

const router = Router();  

router.post('/projects' , createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);
router.post('/skills', createSkill);
router.delete('/skills/:id', deleteSkill);
router.put('/homepage', updateHomepage);
router.post('/experiences', createExperience);
router.put('/experiences/:id', updateExperience);
router.delete('/experiences/:id', deleteExperience);
router.post('/education', createEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);
router.post('/certificates', createCertificate);
router.put('/certificates/:id', updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

export default router;