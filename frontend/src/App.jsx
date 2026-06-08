import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './features/admin/pages/AdminLayout';
import AdminHome from './features/admin/pages/AdminHome';
import AdminExperience from './features/admin/pages/AdminExperience';
import AdminEducation from './features/admin/pages/AdminEducation';
import AdminProjects from './features/admin/pages/AdminProjects';
import AdminSkills from './features/admin/pages/AdminSkills';
import AdminCertificates from './features/admin/pages/AdminCertificates';
import PortfolioPage from './features/portfolio/pages/PortfolioPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Render public portfolio page at root */}
        <Route path="/" element={<PortfolioPage />} />
        
        {/* Admin Layout and subpages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="certificates" element={<AdminCertificates />} />
        </Route>
        
        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
