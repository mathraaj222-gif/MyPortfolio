import { Router } from 'express';
import { getProjects } from '../controllers/project.controller';
import { getSkills } from '../controllers/skill.controller';
import { getHomepage } from '../controllers/homepage.controller';
import { getExperiences } from '../controllers/experience.controller';
import { getEducation } from '../controllers/education.controller';
import { getCertificates } from '../controllers/certificate.controller';
    
const router = Router();  

router.get('/projects' , getProjects);
router.get('/skills' , getSkills);
router.get('/homepage', getHomepage);
router.get('/experiences', getExperiences);
router.get('/education', getEducation);
router.get('/certificates', getCertificates);

export default router;