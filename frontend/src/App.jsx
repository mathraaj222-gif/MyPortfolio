import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PortfolioPage from './features/portfolio/pages/PortfolioPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public portfolio — the only page in this app */}
        <Route path="/" element={<PortfolioPage />} />
      </Routes>
    </Router>
  );
}

export default App;
