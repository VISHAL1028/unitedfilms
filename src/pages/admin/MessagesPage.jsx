import { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Inbox, Loader2, Mail, Phone, Trash2, CheckCircle2, Circle, Search, X, Tag } from "lucide-react";
import { toast } from "sonner";
import { deleteMessage, getAllMessages, markMessageRead } from "@/lib/db";

const formatDate = (value) => {
  const date = value?.toDate ? value.toDate() : null;
  if (!date) return "Just now";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterService, setFilterService] = useState("All");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      setMessages(await getAllMessages());
    } catch {
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReadToggle = async (message) => {
    try {
      await markMessageRead(message.id, !message.read);
      await fetchMessages();
    } catch {
      toast.error("Could not update message status.");
    }
  };

  const handleDelete = async (message) => {
    if (!confirm(`Delete message from "${message.name}"?`)) return;
    try {
      await deleteMessage(message.id);
      toast.success("Message deleted.");
      await fetchMessages();
    } catch {
      toast.error("Could not delete message.");
    }
  };

  const unreadCount = messages.filter((m) => !m.read).length;

  const services = useMemo(() => {
    const s = new Set(messages.map((m) => m.service).filter(Boolean));
    return ["All", ...Array.from(s)];
  }, [messages]);

  const filtered = useMemo(() => {
    return messages.filter((m) => {
      const matchService = filterService === "All" || m.service === filterService;
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.phone?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q) ||
        m.service?.toLowerCase().includes(q);
      return matchService && matchSearch;
    });
  }, [messages, filterService, search]);

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          Contact Enquiries Inbox
          {unreadCount > 0 && (
            <span className="admin-badge admin-badge--blue">{unreadCount} new</span>
          )}
        </h1>
        <p>Enquiries and rental requests submitted through the website contact form.</p>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1, minWidth: 260, maxWidth: 400 }}>
          <div style={{ position: "relative", width: "100%" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input
              type="text"
              placeholder="Search by name, email, phone, message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: 30, fontSize: 12 }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>Service:</span>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="admin-select"
            style={{ padding: "4px 8px", fontSize: 12 }}
          >
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty">
          <Loader2 style={{ width: 28, height: 28, animation: "spin 1s linear infinite", opacity: 0.5 }} />
          <p>Loading messages…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <Inbox style={{ width: 40, height: 40 }} />
          <p>{search || filterService !== "All" ? "No messages matching your search." : "No messages yet. They'll appear here when someone submits the contact form."}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((message) => (
            <article
              key={message.id}
              className={`admin-message-card ${!message.read ? "admin-message-card--unread" : ""}`}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600, color: "#f1f1f1", margin: 0 }}>
                      {message.subject || "Project Enquiry"}
                    </h2>
                    {message.service && (
                      <span style={{ fontSize: 11, background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.3)", padding: "2px 8px", borderRadius: 4, display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Tag size={10} /> {message.service}
                      </span>
                    )}
                    {!message.read && <span className="admin-badge admin-badge--blue">New</span>}
                  </div>
                  <span style={{ fontSize: 11, color: "#6b7280", flexShrink: 0 }}>{formatDate(message.createdAt)}</span>
                </div>

                {/* Meta */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", fontSize: 12, color: "#9ca3af" }}>
                  <span style={{ fontWeight: 600, color: "#d1d5db" }}>{message.name}</span>
                  <a
                    href={`mailto:${message.email}`}
                    style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#38bdf8")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                  >
                    <Mail style={{ width: 11, height: 11 }} />
                    {message.email}
                  </a>
                  {message.phone && (
                    <a
                      href={`tel:${message.phone}`}
                      style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#4ade80")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                    >
                      <Phone style={{ width: 11, height: 11 }} />
                      {message.phone}
                    </a>
                  )}
                </div>

                {/* Body */}
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "#9ca3af", whiteSpace: "pre-wrap", margin: 0, background: "rgba(0,0,0,0.2)", padding: 12, borderRadius: 6, border: "1px solid rgba(255,255,255,0.05)" }}>
                  {message.message}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                  <button
                    onClick={() => handleReadToggle(message)}
                    className="admin-btn admin-btn--ghost"
                    style={{ padding: "6px 12px", fontSize: 12 }}
                  >
                    {message.read ? (
                      <>
                        <Circle style={{ width: 13, height: 13 }} /> Mark Unread
                      </>
                    ) : (
                      <>
                        <CheckCircle2 style={{ width: 13, height: 13 }} /> Mark Read
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(message)}
                    className="admin-btn admin-btn--danger"
                    style={{ padding: "6px 12px", fontSize: 12 }}
                  >
                    <Trash2 style={{ width: 13, height: 13 }} /> Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default MessagesPage;

