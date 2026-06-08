import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Code, 
  Award,
  LogOut,
  Bell
} from 'lucide-react';

const menuItems = [
  { path: 'home', label: 'Home', icon: LayoutDashboard },
  { path: 'experience', label: 'Experience', icon: Briefcase },
  { path: 'education', label: 'Education', icon: GraduationCap },
  { path: 'projects', label: 'Projects', icon: FolderGit2 },
  { path: 'skills', label: 'Skills', icon: Code },
  { path: 'certificates', label: 'Certificates', icon: Award },
];

export default function AdminLayout() {
  return (
    <div className="admin-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">A</div>
          <span className="sidebar-title">Portfolio Admin</span>
        </div>
        
        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={`/admin/${item.path}`}
                className={({ isActive }) => 
                  `menu-item-link ${isActive ? 'active' : ''}`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">AD</div>
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Super Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        {/* Shared Top bar */}
        <header className="content-header">
          <div className="search-bar">
            {/* Can add global search here if needed */}
          </div>
          <div className="header-actions">
            <button className="btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
              <Bell size={18} />
            </button>
            <button className="btn-secondary" style={{ gap: '0.4rem' }}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic sub-page view injection */}
        <div className="animate-fade-in" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
