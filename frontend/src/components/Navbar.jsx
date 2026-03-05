import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  TrendingUp,
  FileText,
  Briefcase,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/career-predictor", icon: TrendingUp, label: "Career Predictor" },
    { path: "/resume-validator", icon: FileText, label: "Resume Validator" },
    { path: "/recommendations", icon: Briefcase, label: "Jobs & Learning" },
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  ];

  return (
    <>
      <style>{`
        .nav-root {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
        }
        .nav-root.nav-top {
          background: transparent;
          padding: 26px 0;
        }
        .nav-root.nav-scrolled {
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: saturate(180%) blur(24px);
          -webkit-backdrop-filter: saturate(180%) blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 14px 0;
          box-shadow: 0 1px 0 rgba(255,255,255,0.04), 0 8px 40px rgba(0,0,0,0.4);
        }

        .nav-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 40px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px;
        }

        /* Logo */
        .nav-logo {
          display: flex; align-items: center; gap: 12px;
          text-decoration: none; flex-shrink: 0;
        }
        .nav-logo-mark {
          width: 38px; height: 38px; border-radius: 11px;
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 14px rgba(41,151,255,0.38);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .nav-logo:hover .nav-logo-mark {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(41,151,255,0.48);
        }
        .nav-logo-name {
          font-size: 19px; font-weight: 700; color: #f5f5f7;
          letter-spacing: -0.02em; line-height: 1;
        }
        .nav-logo-name span {
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .nav-logo-tag {
          font-size: 10px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: #6e6e73; display: block; margin-top: 3px;
        }

        /* Desktop Links */
        .nav-links {
          display: flex; align-items: center; gap: 4px;
          flex: 1; justify-content: center;
        }
        .nav-link {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 16px; border-radius: 11px;
          font-size: 15px; font-weight: 500; text-decoration: none;
          color: #a1a1a6; letter-spacing: -0.01em;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: #f5f5f7;
          background: rgba(255,255,255,0.07);
        }
        .nav-link.nav-active {
          color: #2997ff;
          background: rgba(41,151,255,0.1);
        }
        .nav-link svg { flex-shrink: 0; }

        /* Right side */
        .nav-right {
          display: flex; align-items: center; gap: 10px; flex-shrink: 0;
        }
        .nav-user-pill {
          display: flex; align-items: center; gap: 9px;
          padding: 6px 14px 6px 6px; border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          transition: border-color 0.2s ease;
        }
        .nav-user-pill:hover { border-color: rgba(255,255,255,0.18); }
        .nav-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: white; flex-shrink: 0;
        }
        .nav-username { font-size: 14px; color: #a1a1a6; font-weight: 500; }
        .nav-logout {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 17px; border-radius: 11px;
          font-size: 14px; font-weight: 500; cursor: pointer;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #6e6e73;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .nav-logout:hover {
          border-color: rgba(248,113,113,0.35);
          color: #f87171;
          background: rgba(248,113,113,0.06);
        }

        /* Mobile toggle */
        .nav-mobile-btn {
          display: none; background: none;
          border: 1px solid rgba(255,255,255,0.12);
          cursor: pointer; color: #a1a1a6;
          padding: 8px; border-radius: 10px; line-height: 0;
          transition: border-color 0.2s ease, color 0.2s ease;
        }
        .nav-mobile-btn:hover {
          border-color: rgba(255,255,255,0.22); color: #f5f5f7;
        }

        /* Mobile menu */
        .nav-mobile-menu {
          margin: 10px 16px 0;
          border-radius: 20px;
          background: rgba(17,17,17,0.96);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          animation: navMenuIn 0.22s ease;
        }
        @keyframes navMenuIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .nav-mobile-user {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 16px 16px;
        }
        .nav-mobile-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #2997ff, #5ac8fa);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;
        }
        .nav-mobile-name { font-size: 15px; font-weight: 600; color: #f5f5f7; }
        .nav-mobile-role { font-size: 12px; color: #6e6e73; margin-top: 2px; }
        .nav-mobile-divider {
          height: 1px; background: rgba(255,255,255,0.07); margin: 6px 4px;
        }
        .nav-mobile-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 12px;
          font-size: 15px; font-weight: 500; text-decoration: none;
          color: #a1a1a6; font-family: inherit;
          transition: all 0.18s ease;
        }
        .nav-mobile-link:hover {
          color: #f5f5f7; background: rgba(255,255,255,0.06);
        }
        .nav-mobile-link.nav-active {
          color: #2997ff; background: rgba(41,151,255,0.1);
          font-weight: 600;
        }
        .nav-mobile-logout {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-radius: 12px;
          font-size: 15px; font-weight: 500; cursor: pointer;
          background: none; border: none;
          color: #f87171; width: 100%;
          font-family: inherit;
          transition: all 0.18s ease;
        }
        .nav-mobile-logout:hover { background: rgba(248,113,113,0.08); }

        @media (max-width: 960px) { .nav-links { display: none; } }
        @media (max-width: 768px) {
          .nav-links, .nav-right { display: none; }
          .nav-mobile-btn { display: block; }
        }
      `}</style>

      <nav className={`nav-root ${scrolled ? "nav-scrolled" : "nav-top"}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo">
            <div className="nav-logo-mark">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <circle cx="8" cy="8" r="2" fill="white" />
              </svg>
            </div>
            <div>
              <div className="nav-logo-name">
                Career<span>Craft</span>
              </div>
              <span className="nav-logo-tag">AI</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link ${isActive ? "nav-active" : ""}`}
                  data-testid={`nav-${item.label.toLowerCase().replace(/ /g, "-")}`}
                >
                  <Icon size={15} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop Right */}
          <div className="nav-right">
            <div className="nav-user-pill">
              <div className="nav-avatar">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="nav-username">{user?.name}</span>
            </div>
            <button
              className="nav-logout"
              onClick={onLogout}
              data-testid="logout-btn"
            >
              <LogOut size={15} /> Sign out
            </button>
          </div>

          {/* Mobile Toggle */}
          <button
            className="nav-mobile-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <svg
                width="19"
                height="19"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                width="19"
                height="19"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="nav-mobile-menu">
            <div className="nav-mobile-user">
              <div className="nav-mobile-avatar">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <div className="nav-mobile-name">{user?.name}</div>
                <div className="nav-mobile-role">Member</div>
              </div>
            </div>
            <div className="nav-mobile-divider" />
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`nav-mobile-link ${isActive ? "nav-active" : ""}`}
                >
                  <Icon size={16} /> {item.label}
                </Link>
              );
            })}
            <div className="nav-mobile-divider" />
            <button className="nav-mobile-logout" onClick={onLogout}>
              <LogOut size={16} /> Sign out
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
