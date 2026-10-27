import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAllEquipmentRequests } from "@/lib/db";
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
  Video,
  ClipboardList,
  ExternalLink,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingRequestCount, setPendingRequestCount] = useState(0);

  // Fetch pending requests count for badge
  useEffect(() => {
    getAllEquipmentRequests()
      .then((reqs) => {
        setPendingRequestCount(reqs.filter((r) => r.status === "pending").length);
      })
      .catch(() => {});
  }, [location.pathname]); // refresh on nav

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully.");
      navigate("/login");
    } catch {
      toast.error("Logout failed.");
    }
  };

  const isActive = (to, exact = false) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  const navGroups = [
    {
      label: "Overview",
      items: [
        { to: "/admin", icon: LayoutDashboard, label: "Home", exact: true },
      ],
    },
    {
      label: "Change the website",
      items: [
        { to: "/admin/videos", icon: Video, label: "Change Videos" },
        { to: "/admin/equipment", icon: Camera, label: "Manage Equipment" },
        { to: "/admin/rentals", icon: Film, label: "Edit Rental Offer" },
        { to: "/admin/works", icon: Clapperboard, label: "Manage Portfolio" },
      ],
    },
    {
      label: "Customer activity",
      items: [
        { to: "/admin/equipment-requests", icon: ClipboardList, label: "Review Submissions", badge: pendingRequestCount },
        { to: "/admin/messages", icon: Inbox, label: "Read Enquiries" },
      ],
    },
  ];

  const allItems = navGroups.flatMap((g) => g.items);
  const currentLabel = allItems.find((i) => isActive(i.to, i.exact))?.label || "Admin";

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
            <p className="admin-sidebar__logo-sub">Website Manager</p>
          </div>
        </div>

        {/* Nav Groups */}
        <nav className="admin-sidebar__nav">
          {navGroups.map((group) => (
            <div key={group.label} className="admin-sidebar__group">
              <p className="admin-sidebar__section-label">{group.label}</p>
              {group.items.map((item) => {
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`admin-nav-item ${active ? "admin-nav-item--active" : ""}`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="admin-nav-badge">{item.badge}</span>
                    )}
                    {active && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-60" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="admin-sidebar__footer">
          <a className="admin-view-site-btn" href="/" target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4" />
            View public website
          </a>
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
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
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
            <span className="admin-topbar__breadcrumb-root">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span>{currentLabel}</span>
          </div>

          <div className="admin-topbar__right">
            {pendingRequestCount > 0 && (
              <Link to="/admin/equipment-requests" className="admin-topbar__alert">
                <ClipboardList size={13} />
                {pendingRequestCount} pending
              </Link>
            )}
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
