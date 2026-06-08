import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, AlertTriangle, BarChart2, UserCheck, Bell, Shield, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const links = [
    { name: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Neural Vision',      path: '/monitoring', icon: Camera },
    { name: 'Incident Logs',      path: '/alerts',     icon: AlertTriangle },
    { name: 'Deep Analytics',     path: '/analytics',  icon: BarChart2 },
    { name: 'Personnel Portal',    path: '/worker',     icon: UserCheck },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <NavLink to="/" className="navbar-logo">
          <div className="logo-icon">
            <Shield size={18} color="white" />
          </div>
          <div>
            <div className="logo-name" style={{ letterSpacing: '-0.02em', fontWeight: 800 }}>SafeSphere</div>
            <span className="logo-sub" style={{ color: 'var(--t-lo)' }}>Industrial Intelligence</span>
          </div>
        </NavLink>

        {/* Desktop Links */}
        <nav className="navbar-links">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Icon size={13} />
              {name}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <div className="live-indicator">
            <div className="live-dot" />
            System Live
          </div>
          <button className="nav-icon-btn">
            <Bell size={16} />
            <div className="nav-dot" />
          </button>
          <NavLink to="/login" className="btn btn-primary" style={{ fontSize: '.7rem', padding: '8px 16px' }}>
            Auth Portal
          </NavLink>
          <button onClick={() => setOpen(!open)} style={{ display: 'none', width: 36, height: 36, borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', alignItems: 'center', justifyContent: 'center', color: 'var(--t-md)', cursor: 'pointer' }} className="mobile-btn">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, background: 'var(--bg-1)', zIndex: 999, padding: '24px', display: 'flex', flexDirection: 'column', gap: 8, borderTop: '1px solid var(--border)' }}>
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink key={path} to={path} onClick={() => setOpen(false)} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} style={{ fontSize: '.9rem', padding: '14px 16px' }}>
              <Icon size={18} /> {name}
            </NavLink>
          ))}
        </div>
      )}

      <style>{` @media (max-width: 900px) { .navbar-links { display: none !important; } .mobile-btn { display: flex !important; } } `}</style>
    </header>
  );
};

export default Navbar;
