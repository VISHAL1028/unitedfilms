import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Inbox, Loader2, Mail, Trash2, CheckCircle2, Circle } from "lucide-react";
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

  const fetchMessages = async () => {
    setLoading(true);
    try { setMessages(await getAllMessages()); }
    catch { toast.error("Failed to load messages."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleReadToggle = async (message) => {
    try { await markMessageRead(message.id, !message.read); await fetchMessages(); }
    catch { toast.error("Could not update message status."); }
  };

  const handleDelete = async (message) => {
    if (!confirm(`Delete message from "${message.name}"?`)) return;
    try { await deleteMessage(message.id); toast.success("Message deleted."); await fetchMessages(); }
    catch { toast.error("Could not delete message."); }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1 style={{ display: "flex", alignItems: "center", gap: 10 }}>
          Contact Inbox
          {unreadCount > 0 && (
            <span className="admin-badge admin-badge--blue">{unreadCount} new</span>
          )}
        </h1>
        <p>Messages submitted from the homepage contact form.</p>
      </div>

      {loading ? (
        <div className="admin-empty">
          <Loader2 style={{ width: 28, height: 28, animation: "spin 1s linear infinite", opacity: 0.5 }} />
          <p>Loading messages…</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="admin-empty">
          <Inbox style={{ width: 40, height: 40 }} />
          <p>No messages yet. They'll appear here when someone submits the contact form.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((message) => (
            <article
              key={message.id}
              className={`admin-message-card ${!message.read ? "admin-message-card--unread" : ""}`}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Header row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={{ fontSize: 14, fontWeight: 600, color: "#f1f1f1", margin: 0 }}>
                      {message.subject || "New project inquiry"}
                    </h2>
                    {!message.read && <span className="admin-badge admin-badge--blue">New</span>}
                  </div>
                  <span style={{ fontSize: 11, color: "#6b7280", flexShrink: 0 }}>{formatDate(message.createdAt)}</span>
                </div>

                {/* Meta */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 12, color: "#9ca3af" }}>
                  <span style={{ fontWeight: 500, color: "#d1d5db" }}>{message.name}</span>
                  <a
                    href={`mailto:${message.email}`}
                    style={{ display: "flex", alignItems: "center", gap: 4, color: "#9ca3af", textDecoration: "none" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#38bdf8"}
                    onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}
                  >
                    <Mail style={{ width: 11, height: 11 }} />
                    {message.email}
                  </a>
                </div>

                {/* Body */}
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "#9ca3af", whiteSpace: "pre-wrap", margin: 0 }}>
                  {message.message}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                  <button
                    onClick={() => handleReadToggle(message)}
                    className="admin-btn admin-btn--ghost"
                    style={{ padding: "6px 12px", fontSize: 12 }}
                  >
                    {message.read
                      ? <><Circle style={{ width: 13, height: 13 }} /> Mark Unread</>
                      : <><CheckCircle2 style={{ width: 13, height: 13 }} /> Mark Read</>}
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
