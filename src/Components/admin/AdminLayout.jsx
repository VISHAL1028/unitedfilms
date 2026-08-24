import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Camera,
  Inbox,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Film,
  Shield,
  Clapperboard,
} from "lucide-react";

const NAV_ITEMS = [
  {
    to: "/admin",
    icon: LayoutDashboard,
    label: "Dashboard",
    exact: true,
  },
  {
    to: "/admin/equipment",
    icon: Camera,
    label: "Equipment",
  },
  {
    to: "/admin/rentals",
    icon: Film,
    label: "Special Rentals",
  },
  {
    to: "/admin/works",
    icon: Clapperboard,
    label: "Our Work",
  },
  {
    to: "/admin/messages",
    icon: Inbox,
    label: "Messages",
  },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully.");
      navigate("/login");
    } catch {
      toast.error("Logout failed.");
    }
  };

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to;
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="admin-shell">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "admin-sidebar--open" : ""}`}>
        {/* Logo */}
        <div className="admin-sidebar__logo">
          <div className="admin-sidebar__logo-icon">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <p className="admin-sidebar__logo-title">United Films</p>
            <p className="admin-sidebar__logo-sub">CMS Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar__nav">
          <p className="admin-sidebar__section-label">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item ${isActive(item) ? "admin-nav-item--active" : ""}`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {isActive(item) && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar">
              <Shield className="w-4 h-4" />
            </div>
            <div className="admin-sidebar__user-info">
              <p className="admin-sidebar__user-name">Administrator</p>
              <p className="admin-sidebar__user-role">Full Access</p>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn" title="Sign Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ── Overlay for mobile ───────────────────────── */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Area ────────────────────────────────── */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <button
            className="admin-topbar__menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="admin-topbar__breadcrumb">
            {NAV_ITEMS.find((i) => isActive(i))?.label || "Admin"}
          </div>

          <div className="admin-topbar__right">
            <span className="admin-topbar__badge">Live</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
