import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './features/admin/pages/AdminLayout';
import AdminHome from './features/admin/pages/AdminHome';
import AdminExperience from './features/admin/pages/AdminExperience';
import AdminEducation from './features/admin/pages/AdminEducation';
import AdminProjects from './features/admin/pages/AdminProjects';
import AdminSkills from './features/admin/pages/AdminSkills';
import AdminCertificates from './features/admin/pages/AdminCertificates';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin app routes start at / — no /admin prefix needed */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<AdminHome />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="education" element={<AdminEducation />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="certificates" element={<AdminCertificates />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
