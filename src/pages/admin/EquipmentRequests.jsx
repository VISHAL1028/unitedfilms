import { useEffect, useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getAllEquipmentRequests,
  updateEquipmentRequestStatus,
  deleteEquipmentRequest,
  saveEquipment,
} from "@/lib/db";
import {
  ClipboardList,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Mail,
  Phone,
  Tag,
  DollarSign,
  Star,
  Clock,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const formatDate = (value) => {
  const date = value?.toDate ? value.toDate() : null;
  if (!date) return "Just now";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"];

const statusStyle = {
  pending: { color: "#fbbf24", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
  approved: { color: "#4ade80", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.25)" },
  rejected: { color: "#f87171", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.25)" },
};

const EquipmentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [actioning, setActioning] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      setRequests(await getAllEquipmentRequests());
    } catch {
      toast.error("Failed to load equipment requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const counts = useMemo(() => ({
    All: requests.length,
    Pending: requests.filter((r) => r.status === "pending").length,
    Approved: requests.filter((r) => r.status === "approved").length,
    Rejected: requests.filter((r) => r.status === "rejected").length,
  }), [requests]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return requests;
    return requests.filter((r) => r.status === activeTab.toLowerCase());
  }, [requests, activeTab]);

  const handleApprove = async (req) => {
    setActioning(req.id);
    try {
      // Auto-create the equipment in the catalogue
      await saveEquipment({
        name: req.equipmentName,
        category: req.category || "Other",
        description: req.description || "",
        imageUrl: req.photoUrl || "",
        rentalPrice: req.askingPrice || "",
        status: "Available for Rent",
        listed: true,
        featured: false,
        featuredLabel: "",
        featureBullets: [],
        videoUrl: "",
        submittedBy: req.submitterName || "",
        submitterEmail: req.submitterEmail || "",
      });
      await updateEquipmentRequestStatus(req.id, "approved");
      toast.success(`"${req.equipmentName}" approved and added to equipment catalogue!`);
      fetchRequests();
    } catch {
      toast.error("Failed to approve request.");
    } finally {
      setActioning(null);
    }
  };

  const handleReject = async (req) => {
    setActioning(req.id);
    try {
      await updateEquipmentRequestStatus(req.id, "rejected");
      toast.success(`Request from "${req.submitterName}" rejected.`);
      fetchRequests();
    } catch {
      toast.error("Failed to reject request.");
    } finally {
      setActioning(null);
    }
  };

  const handleDelete = async (req) => {
    if (!window.confirm(`Permanently delete this request from "${req.submitterName}"?`)) return;
    try {
      await deleteEquipmentRequest(req.id);
      toast.success("Request deleted.");
      fetchRequests();
    } catch {
      toast.error("Failed to delete request.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Equipment Requests</h1>
        <p>Review equipment submissions from visitors. Approve to automatically list them in the catalogue, or reject to decline.</p>
      </div>

      {/* Tab bar */}
      <div className="req-tab-bar">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`req-tab ${activeTab === tab ? "req-tab--active" : ""}`}
          >
            {tab}
            <span className={`req-tab-count ${tab === "Pending" && counts.Pending > 0 ? "req-tab-count--pending" : ""}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--color-muted-foreground)" }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 12px" }} />
          Loading requests...
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty">
          <ClipboardList size={40} />
          <p>No {activeTab.toLowerCase()} requests found.</p>
        </div>
      ) : (
        <div className="req-grid">
          {filtered.map((req) => {
            const st = statusStyle[req.status] || statusStyle.pending;
            const isActioning = actioning === req.id;
            return (
              <div key={req.id} className="req-card">
                {/* Header */}
                <div className="req-card__header">
                  <div className="req-card__name-block">
                    <div className="req-card__avatar">
                      {(req.submitterName || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="req-card__name">{req.submitterName || "Unknown"}</div>
                      <div className="req-card__date">{formatDate(req.createdAt)}</div>
                    </div>
                  </div>
                  <span
                    className="req-card__status"
                    style={{ color: st.color, background: st.bg, border: `1px solid ${st.border}` }}
                  >
                    {req.status === "pending" && <Clock size={10} />}
                    {req.status === "approved" && <CheckCircle2 size={10} />}
                    {req.status === "rejected" && <XCircle size={10} />}
                    {req.status}
                  </span>
                </div>

                {/* Equipment info */}
                <div className="req-card__equip-block">
                  {req.photoUrl && (
                    <img
                      src={req.photoUrl}
                      alt={req.equipmentName}
                      className="req-card__photo"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  )}
                  <div className="req-card__equip-info">
                    <div className="req-card__equip-name">{req.equipmentName}</div>
                    <div className="req-card__equip-meta">
                      <span><Tag size={11} /> {req.category}</span>
                      {req.askingPrice && <span><DollarSign size={11} /> {req.askingPrice}</span>}
                      {req.condition && <span><Star size={11} /> {req.condition}</span>}
                    </div>
                    {req.description && (
                      <p className="req-card__desc">{req.description}</p>
                    )}
                  </div>
                </div>

                {/* Contact */}
                <div className="req-card__contact">
                  {req.submitterEmail && (
                    <a href={`mailto:${req.submitterEmail}`} className="req-card__contact-link">
                      <Mail size={12} /> {req.submitterEmail}
                    </a>
                  )}
                  {req.submitterPhone && (
                    <a href={`tel:${req.submitterPhone}`} className="req-card__contact-link">
                      <Phone size={12} /> {req.submitterPhone}
                    </a>
                  )}
                  {req.photoUrl && (
                    <a href={req.photoUrl} target="_blank" rel="noopener noreferrer" className="req-card__contact-link">
                      <ExternalLink size={12} /> View photo
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="req-card__actions">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(req)}
                        disabled={isActioning}
                        className="req-btn req-btn--approve"
                      >
                        {isActioning ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                        Approve & List
                      </button>
                      <button
                        onClick={() => handleReject(req)}
                        disabled={isActioning}
                        className="req-btn req-btn--reject"
                      >
                        <XCircle size={13} /> Reject
                      </button>
                    </>
                  )}
                  {req.status === "approved" && (
                    <span className="req-card__approved-note">
                      <CheckCircle2 size={13} /> Listed in catalogue
                    </span>
                  )}
                  {req.status === "rejected" && (
                    <span className="req-card__rejected-note">
                      <XCircle size={13} /> Declined
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(req)}
                    className="req-btn req-btn--delete"
                    title="Delete permanently"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default EquipmentRequests;
