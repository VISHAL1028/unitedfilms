import { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Inbox, Loader2, Mail, Phone, Trash2, CheckCircle2,
  Circle, Search, X, Tag, MessageSquare,
} from "lucide-react";
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
  const [filterRead, setFilterRead] = useState("All"); // All | Unread | Read

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
      const matchRead =
        filterRead === "All" ||
        (filterRead === "Unread" && !m.read) ||
        (filterRead === "Read" && m.read);
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.phone?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q) ||
        m.service?.toLowerCase().includes(q);
      return matchService && matchRead && matchSearch;
    });
  }, [messages, filterService, filterRead, search]);

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <h1>Contact Enquiries</h1>
          {unreadCount > 0 && (
            <span className="admin-badge admin-badge--blue">{unreadCount} new</span>
          )}
        </div>
        <p>Enquiries submitted through the website contact form.</p>
      </div>

      {/* Toolbar */}
      <div className="msg-toolbar">
        {/* Search */}
        <div className="msg-search-wrap">
          <Search size={14} className="msg-search-icon" />
          <input
            type="text"
            placeholder="Search name, email, message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="msg-search-input"
          />
          {search && (
            <button onClick={() => setSearch("")} className="msg-search-clear">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="msg-filters">
          <div className="msg-filter-group">
            {["All", "Unread", "Read"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterRead(f)}
                className={`msg-filter-btn ${filterRead === f ? "msg-filter-btn--active" : ""}`}
              >
                {f}
                {f === "Unread" && unreadCount > 0 && (
                  <span className="msg-filter-count">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          {services.length > 1 && (
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="admin-select"
              style={{ padding: "6px 10px", fontSize: 12, width: "auto" }}
            >
              {services.map((s) => (
                <option key={s} value={s}>{s === "All" ? "All services" : s}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="admin-empty">
          <Loader2 size={28} className="animate-spin" />
          <p>Loading messages…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <Inbox size={40} />
          <p>
            {search || filterService !== "All" || filterRead !== "All"
              ? "No messages match your filters."
              : "No messages yet. They'll appear here when someone submits the contact form."}
          </p>
          {(search || filterRead !== "All") && (
            <button
              onClick={() => { setSearch(""); setFilterRead("All"); setFilterService("All"); }}
              className="admin-btn admin-btn--ghost"
              style={{ fontSize: 12, marginTop: 8 }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="msg-list">
          {filtered.map((message) => (
            <article
              key={message.id}
              className={`msg-card ${!message.read ? "msg-card--unread" : ""}`}
            >
              {/* Unread indicator bar */}
              {!message.read && <div className="msg-card__unread-bar" />}

              <div className="msg-card__inner">
                {/* Top row */}
                <div className="msg-card__top">
                  <div className="msg-card__avatar">
                    {(message.name || "?")[0].toUpperCase()}
                  </div>
                  <div className="msg-card__top-info">
                    <div className="msg-card__name-row">
                      <span className="msg-card__name">{message.name}</span>
                      {!message.read && <span className="msg-card__new-pill">New</span>}
                      {message.service && (
                        <span className="msg-card__service-tag">
                          <Tag size={10} /> {message.service}
                        </span>
                      )}
                    </div>
                    <div className="msg-card__contact-row">
                      {message.email && (
                        <a href={`mailto:${message.email}`} className="msg-card__link msg-card__link--email">
                          <Mail size={11} /> {message.email}
                        </a>
                      )}
                      {message.phone && (
                        <a href={`tel:${message.phone}`} className="msg-card__link msg-card__link--phone">
                          <Phone size={11} /> {message.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  <span className="msg-card__date">{formatDate(message.createdAt)}</span>
                </div>

                {/* Subject */}
                {message.subject && (
                  <div className="msg-card__subject">
                    <MessageSquare size={12} />
                    {message.subject}
                  </div>
                )}

                {/* Body */}
                <div className="msg-card__body">{message.message}</div>

                {/* Actions */}
                <div className="msg-card__actions">
                  <button
                    onClick={() => handleReadToggle(message)}
                    className="admin-btn admin-btn--ghost"
                    style={{ padding: "5px 12px", fontSize: 12 }}
                  >
                    {message.read ? (
                      <><Circle size={12} /> Mark Unread</>
                    ) : (
                      <><CheckCircle2 size={12} /> Mark Read</>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(message)}
                    className="admin-btn admin-btn--danger"
                    style={{ padding: "5px 12px", fontSize: 12 }}
                  >
                    <Trash2 size={12} /> Delete
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
