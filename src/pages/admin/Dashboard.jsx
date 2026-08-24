import { Link } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Camera, Inbox, ChevronRight, Activity, Database, Film, Clapperboard } from "lucide-react";

const MODULES = [
  {
    to: "/admin/equipment",
    icon: Camera,
    iconBg: "rgba(245,158,11,0.12)",
    iconColor: "#f59e0b",
    title: "Equipment Manager",
    desc: "List & delist equipment, manage catalogue inventory, attach photos and demo videos.",
    footerLabel: "Open manager",
    variant: "",
  },
  {
    to: "/admin/rentals",
    icon: Film,
    iconBg: "rgba(239,68,68,0.12)",
    iconColor: "#f87171",
    title: "Special Rental & Pricing",
    desc: "Change special deal rates ($900/day, $3,400/week), package items, and banner highlights.",
    footerLabel: "Edit rates & packages",
    variant: "",
  },
  {
    to: "/admin/works",
    icon: Clapperboard,
    iconBg: "rgba(168,85,247,0.12)",
    iconColor: "#c084fc",
    title: "Our Work & Portfolio",
    desc: "Manage portfolio projects, attach videos/posters, client details, and category tags.",
    footerLabel: "Manage portfolio",
    variant: "",
  },
  {
    to: "/admin/messages",
    icon: Inbox,
    iconBg: "rgba(14,165,233,0.12)",
    iconColor: "#38bdf8",
    title: "Contact Enquiries Inbox",
    desc: "Review and manage enquiries submitted through the website contact form.",
    footerLabel: "Open inbox",
    variant: "admin-module-card--blue",
  },
];

const STATS = [
  { label: "Active Services", value: "4", iconBg: "rgba(245,158,11,0.1)", iconColor: "#f59e0b", Icon: Database },
  { label: "CMS Status", value: "Live", iconBg: "rgba(34,197,94,0.1)", iconColor: "#4ade80", Icon: Activity },
  { label: "Platform", value: "Firebase", iconBg: "rgba(14,165,233,0.1)", iconColor: "#38bdf8", Icon: Film },
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome back. Manage your equipment catalogue and contact messages from here.</p>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid">
        {STATS.map(({ label, value, iconBg, iconColor, Icon }) => (
          <div key={label} className="admin-stat-card">
            <div className="admin-stat-card__icon" style={{ background: iconBg }}>
              <Icon style={{ width: 16, height: 16, color: iconColor }} />
            </div>
            <div>
              <div className="admin-stat-card__label">{label}</div>
              <div className="admin-stat-card__value">{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modules */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          Quick Access
        </p>
        <div className="admin-module-grid">
          {MODULES.map(({ to, icon: Icon, iconBg, iconColor, title, desc, footerLabel, variant }) => (
            <Link key={to} to={to} className={`admin-module-card ${variant}`}>
              <div className="admin-module-card__icon" style={{ background: iconBg }}>
                <Icon style={{ width: 20, height: 20, color: iconColor }} />
              </div>
              <div>
                <div className="admin-module-card__title">{title}</div>
                <div className="admin-module-card__desc">{desc}</div>
              </div>
              <div className="admin-module-card__footer">
                {footerLabel}
                <ChevronRight style={{ width: 13, height: 13 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
