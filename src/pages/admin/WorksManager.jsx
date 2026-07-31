import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { uploadFile } from "@/lib/upload";
import { saveWork, getAllWorks, deleteWork, updateWork } from "@/lib/works";
import {
  Trash2, Pencil, ImagePlus, Loader2, CheckCircle2,
  XCircle, Video, Play, Film, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Commercial", "Music Video", "Documentary",
  "Film Restoration", "3D & VFX", "Wedding", "Short Film", "Other",
];

const emptyForm = {
  title: "",
  category: CATEGORIES[0],
  description: "",
  client: "",
  year: new Date().getFullYear().toString(),
  tagsText: "",
  // Thumbnail
  thumbnailFile: null,
  thumbnailUrl: "",
  // Video
  videoFile: null,
  videoUrl: "",
};

const WorksManager = () => {
  const [form, setForm] = useState(emptyForm);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loadingItems, setLoadingItems] = useState(true);

  const fetchItems = async () => {
    setLoadingItems(true);
    try { setItems(await getAllWorks()); }
    catch { toast.error("Failed to load works."); }
    finally { setLoadingItems(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const updateForm = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleThumb = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateForm("thumbnailFile", file);
    setThumbPreview(URL.createObjectURL(file));
  };

  const handleVideo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    updateForm("videoFile", file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearForm = () => {
    setForm(emptyForm);
    setThumbPreview(null);
    setVideoPreview(null);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error("Title is required."); return; }
    setLoading(true); setThumbProgress(0); setVideoProgress(0);
    try {
      let thumbnailUrl = form.thumbnailUrl || "";
      if (form.thumbnailFile)
        thumbnailUrl = await uploadFile(form.thumbnailFile, "works-thumbnails", setThumbProgress);

      let videoUrl = form.videoUrl || "";
      if (form.videoFile)
        videoUrl = await uploadFile(form.videoFile, "works-videos", setVideoProgress);

      const payload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        client: form.client.trim(),
        year: form.year.trim(),
        tags: form.tagsText.split(",").map(t => t.trim()).filter(Boolean),
        thumbnailUrl,
        videoUrl,
      };

      if (editId) {
        await updateWork(editId, payload);
        toast.success("Work updated successfully.");
      } else {
        await saveWork(payload);
        toast.success("Work added successfully.");
      }

      clearForm();
      await fetchItems();
    } catch (err) {
      toast.error("Save failed: " + err.message);
    } finally {
      setLoading(false);
      setThumbProgress(0);
      setVideoProgress(0);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      title: item.title || "",
      category: item.category || CATEGORIES[0],
      description: item.description || "",
      client: item.client || "",
      year: item.year || new Date().getFullYear().toString(),
      tagsText: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      thumbnailFile: null,
      thumbnailUrl: item.thumbnailUrl || "",
      videoFile: null,
      videoUrl: item.videoUrl || "",
    });
    setThumbPreview(item.thumbnailUrl || null);
    setVideoPreview(item.videoUrl || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await deleteWork(id);
      toast.success(`"${title}" deleted.`);
      await fetchItems();
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Our Work Manager</h1>
        <p>
          {editId
            ? "Editing an existing project — update fields and save."
            : "Add portfolio projects shown on the 'Our Work' page."}
        </p>
      </div>

      {/* ── Form ── */}
      <div className="admin-form-card">
        <h2>{editId ? "✏️  Edit Project" : "➕  Add New Project"}</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Title + Category */}
          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Project Title *</label>
              <input
                required
                className="admin-input"
                value={form.title}
                onChange={e => updateForm("title", e.target.value)}
                placeholder="e.g. Monsoon Reel"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Category *</label>
              <select
                className="admin-select"
                value={form.category}
                onChange={e => updateForm("category", e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Client + Year */}
          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Client / Production</label>
              <input
                className="admin-input"
                value={form.client}
                onChange={e => updateForm("client", e.target.value)}
                placeholder="e.g. Sony Music India"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Year</label>
              <input
                className="admin-input"
                value={form.year}
                onChange={e => updateForm("year", e.target.value)}
                placeholder="2024"
              />
            </div>
          </div>

          {/* Description */}
          <div className="admin-form-group">
            <label className="admin-label">Description</label>
            <textarea
              className="admin-textarea"
              rows={3}
              value={form.description}
              onChange={e => updateForm("description", e.target.value)}
              placeholder="Describe the project, style, and creative decisions…"
            />
          </div>

          {/* Tags */}
          <div className="admin-form-group">
            <label className="admin-label">
              Tags{" "}
              <span style={{ color: "#6b7280", textTransform: "none", fontSize: 10 }}>
                (comma-separated)
              </span>
            </label>
            <input
              className="admin-input"
              value={form.tagsText}
              onChange={e => updateForm("tagsText", e.target.value)}
              placeholder="High-Speed, 4K, Commercial"
            />
          </div>

          {/* ── Media: Thumbnail + Video ── */}
          <div className="admin-form-grid-2">
            {/* Thumbnail */}
            <div className="admin-form-group">
              <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ImagePlus style={{ width: 13, height: 13 }} /> Thumbnail Image *
              </label>
              <label className="admin-dropzone">
                {thumbPreview
                  ? <img src={thumbPreview} alt="thumbnail preview" />
                  : <ImagePlus style={{ width: 28, height: 28, color: "#4b5563" }} />}
                <span>
                  {form.thumbnailFile
                    ? form.thumbnailFile.name
                    : form.thumbnailUrl
                    ? "Click to change image"
                    : "Click to select thumbnail"}
                </span>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleThumb} />
              </label>
              {loading && thumbProgress > 0 && (
                <div className="admin-progress-track" style={{ marginTop: 8 }}>
                  <div className="admin-progress-fill" style={{ width: `${thumbProgress}%` }} />
                </div>
              )}
            </div>

            {/* Video */}
            <div className="admin-form-group">
              <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Video style={{ width: 13, height: 13 }} /> Project Video{" "}
                <span style={{ color: "#6b7280", textTransform: "none", fontSize: 10 }}>(optional)</span>
              </label>
              <label className="admin-dropzone">
                {videoPreview
                  ? <video src={videoPreview} muted playsInline style={{ height: 120, borderRadius: 8, background: "#000" }} />
                  : <Video style={{ width: 28, height: 28, color: "#4b5563" }} />}
                <span>
                  {form.videoFile
                    ? form.videoFile.name
                    : form.videoUrl
                    ? "Click to change video"
                    : "Click to select video"}
                </span>
                <input type="file" accept="video/*" style={{ display: "none" }} onChange={handleVideo} />
              </label>
              {loading && videoProgress > 0 && (
                <div className="admin-progress-track" style={{ marginTop: 8 }}>
                  <div
                    className="admin-progress-fill"
                    style={{ width: `${videoProgress}%`, background: "linear-gradient(90deg, #a855f7, #c084fc)" }}
                  />
                </div>
              )}
              {form.videoUrl && !form.videoFile && (
                <button
                  type="button"
                  style={{ marginTop: 6, fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer" }}
                  onClick={() => { updateForm("videoUrl", ""); setVideoPreview(null); }}
                >
                  ✕ Remove existing video
                </button>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
              {loading
                ? <Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} />
                : <CheckCircle2 style={{ width: 15, height: 15 }} />}
              {loading ? "Saving…" : editId ? "Update Project" : "Add Project"}
            </button>
            {editId && (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={clearForm}>
                <XCircle style={{ width: 15, height: 15 }} /> Cancel
              </button>
            )}
            <a
              href="/our-work"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-btn admin-btn--ghost"
              style={{ marginLeft: "auto", textDecoration: "none" }}
            >
              <ExternalLink style={{ width: 14, height: 14 }} /> Preview Page
            </a>
          </div>
        </form>
      </div>

      {/* ── Works list ── */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2>All Projects</h2>
          <span>{items.length} project{items.length !== 1 ? "s" : ""}</span>
        </div>

        {loadingItems ? (
          <div className="admin-empty">
            <Loader2 style={{ width: 24, height: 24, animation: "spin 1s linear infinite" }} />
            <p>Loading projects…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <Film style={{ width: 36, height: 36 }} />
            <p>No projects yet. Use the form above to add your first portfolio item.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="admin-equip-item">
              {item.thumbnailUrl ? (
                <img src={item.thumbnailUrl} alt={item.title} className="admin-equip-item__img" style={{ objectFit: "cover" }} />
              ) : (
                <div className="admin-equip-item__img-placeholder">
                  <Film style={{ width: 18, height: 18 }} />
                </div>
              )}
              <div className="admin-equip-item__info">
                <div className="admin-equip-item__name">{item.title}</div>
                <div className="admin-equip-item__cat">{item.category} · {item.year}</div>
                <div className="admin-equip-item__badges">
                  <span className="admin-badge admin-badge--amber">{item.category}</span>
                  {item.videoUrl && (
                    <span className="admin-badge admin-badge--video">
                      <Play style={{ width: 9, height: 9 }} /> Video
                    </span>
                  )}
                  {item.client && (
                    <span className="admin-badge admin-badge--blue">{item.client}</span>
                  )}
                </div>
              </div>
              <div className="admin-equip-item__actions">
                <button onClick={() => handleEdit(item)} className="admin-icon-btn admin-icon-btn--edit" title="Edit">
                  <Pencil style={{ width: 14, height: 14 }} />
                </button>
                <button onClick={() => handleDelete(item.id, item.title)} className="admin-icon-btn admin-icon-btn--delete" title="Delete">
                  <Trash2 style={{ width: 14, height: 14 }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
};

export default WorksManager;
