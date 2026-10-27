import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getAllEquipmentRequests, getAllEquipment, getAllMessages } from "@/lib/db";
import {
  Camera, Inbox, ChevronRight, Database, Film,
  Clapperboard, Video, ClipboardList, Clock, ExternalLink,
} from "lucide-react";

const MODULES = [
  {
    to: "/admin/videos",
    icon: Video,
    iconBg: "rgba(16,185,129,0.12)",
    iconColor: "#34d399",
    title: "Change website videos",
    desc: "Replace the home video, showcase clips, relighting demo, and restoration video.",
    footerLabel: "Change videos",
  },
  {
    to: "/admin/equipment",
    icon: Camera,
    iconBg: "rgba(245,158,11,0.12)",
    iconColor: "#f59e0b",
    title: "Add or edit equipment",
    desc: "Control the equipment catalogue, prices, photos, videos, and visibility.",
    footerLabel: "Manage equipment",
  },
  {
    to: "/admin/equipment-requests",
    icon: ClipboardList,
    iconBg: "rgba(168,85,247,0.12)",
    iconColor: "#c084fc",
    title: "Review equipment submissions",
    desc: "Approve or reject equipment sent by visitors. Approved items appear in the catalogue.",
    footerLabel: "Review submissions",
    highlight: true,
  },
  {
    to: "/admin/rentals",
    icon: Film,
    iconBg: "rgba(239,68,68,0.12)",
    iconColor: "#f87171",
    title: "Edit the rental offer",
    desc: "Change daily and weekly prices, the offer headline, and included package items.",
    footerLabel: "Edit rental offer",
  },
  {
    to: "/admin/works",
    icon: Clapperboard,
    iconBg: "rgba(14,165,233,0.12)",
    iconColor: "#38bdf8",
    title: "Update the portfolio",
    desc: "Add or edit public work samples, videos, poster images, clients, and categories.",
    footerLabel: "Update portfolio",
  },
  {
    to: "/admin/messages",
    icon: Inbox,
    iconBg: "rgba(14,165,233,0.12)",
    iconColor: "#38bdf8",
    title: "Read customer enquiries",
    desc: "Read, mark, search, and remove messages sent through the public contact page.",
    footerLabel: "Read enquiries",
    variant: "admin-module-card--blue",
  },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    equipment: "—",
    pendingRequests: "—",
    unreadMessages: "—",
  });

  useEffect(() => {
    Promise.allSettled([
      getAllEquipment(true),
      getAllEquipmentRequests(),
      getAllMessages(),
    ]).then(([equipRes, reqRes, msgRes]) => {
      const equip = equipRes.status === "fulfilled" ? equipRes.value : [];
      const reqs = reqRes.status === "fulfilled" ? reqRes.value : [];
      const msgs = msgRes.status === "fulfilled" ? msgRes.value : [];
      setStats({
        equipment: equip.length,
        pendingRequests: reqs.filter((r) => r.status === "pending").length,
        unreadMessages: msgs.filter((m) => !m.read).length,
      });
    });
  }, []);

  const STATS = [
    {
      label: "Equipment on website",
      value: stats.equipment,
      iconBg: "rgba(245,158,11,0.1)",
      iconColor: "#f59e0b",
      Icon: Database,
      to: "/admin/equipment",
    },
    {
      label: "Submissions to review",
      value: stats.pendingRequests,
      iconBg: "rgba(168,85,247,0.1)",
      iconColor: "#c084fc",
      Icon: Clock,
      to: "/admin/equipment-requests",
      alert: stats.pendingRequests > 0,
    },
    {
      label: "New enquiries",
      value: stats.unreadMessages,
      iconBg: "rgba(14,165,233,0.1)",
      iconColor: "#38bdf8",
      Icon: Inbox,
      to: "/admin/messages",
      alert: stats.unreadMessages > 0,
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div>
          <p className="admin-page-eyebrow">Website manager</p>
          <h1>What would you like to change?</h1>
          <p>Choose a task below. Saved changes are published to the public website automatically.</p>
        </div>
        <a className="admin-primary-link" href="/" target="_blank" rel="noreferrer">
          View public website <ExternalLink size={15} />
        </a>
      </div>

      <div className="admin-simple-steps" aria-label="How website updates work">
        <div><strong>1</strong><span>Choose a section</span></div>
        <div><strong>2</strong><span>Edit and save</span></div>
        <div><strong>3</strong><span>Open the website to check it</span></div>
      </div>

      {/* Stats */}
      <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
        {STATS.map(({ label, value, iconBg, iconColor, Icon, to, alert }) => {
          const card = (
            <div
              key={label}
              className="admin-stat-card"
              style={alert ? { borderColor: "rgba(168,85,247,0.3)", background: "rgba(168,85,247,0.05)" } : {}}
            >
              <div className="admin-stat-card__icon" style={{ background: iconBg }}>
                <Icon style={{ width: 16, height: 16, color: iconColor }} />
              </div>
              <div>
                <div className="admin-stat-card__label">{label}</div>
                <div className="admin-stat-card__value" style={alert && value > 0 ? { color: iconColor } : {}}>
                  {value}
                </div>
              </div>
            </div>
          );
          return to ? <Link key={label} to={to} style={{ textDecoration: "none" }}>{card}</Link> : card;
        })}
      </div>

      {/* Quick Actions */}
      {stats.pendingRequests > 0 && (
        <div className="dashboard-alert-banner">
          <Clock size={16} style={{ color: "#c084fc" }} />
          <span>
            You have <strong style={{ color: "#c084fc" }}>{stats.pendingRequests} pending equipment request{stats.pendingRequests !== 1 ? "s" : ""}</strong> waiting for review.
          </span>
          <Link to="/admin/equipment-requests" className="dashboard-alert-link">
            Review now <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Modules */}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: "#4b5563", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          Website sections
        </p>
        <div className="admin-module-grid">
          {MODULES.map(({ to, icon: Icon, iconBg, iconColor, title, desc, footerLabel, variant, highlight }) => (
            <Link
              key={to}
              to={to}
              className={`admin-module-card ${variant || ""} ${highlight ? "admin-module-card--highlight" : ""}`}
            >
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
