import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { uploadFile } from "@/lib/upload";
import { saveEquipment, getAllEquipment, deleteEquipment, updateEquipment, setEquipmentFeatured } from "@/lib/db";
import { Trash2, Pencil, ImagePlus, Loader2, CheckCircle2, XCircle, Star, Camera, Video, Play } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Cameras", "Lenses", "Color Grading & VFX",
  "Film Scanners & Restoration", "Film Processing & Lab",
  "Projectors", "Support Equipment", "Storage & Systems",
];

const emptyForm = {
  name: "", category: CATEGORIES[0], description: "",
  file: null, imageUrl: "", featured: false,
  featuredLabel: "", rentalPrice: "", oldPrice: "",
  rentalUnit: "day", featureBulletsText: "",
  // Video fields
  videoFile: null, videoUrl: "",
};

const EquipmentForm = () => {
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loadingItems, setLoadingItems] = useState(true);

  const fetchItems = async () => {
    setLoadingItems(true);
    try { setItems(await getAllEquipment()); }
    catch { toast.error("Failed to load equipment."); }
    finally { setLoadingItems(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const updateForm = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleVideoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, videoFile: file }));
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearForm = () => {
    setForm(emptyForm);
    setPreview(null);
    setVideoPreview(null);
    setEditId(null);
  };

  const clearOtherFeatured = async (currentId) => {
    await Promise.all(
      items.filter(i => i.featured && i.id !== currentId).map(i => setEquipmentFeatured(i.id, false))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) { toast.error("Name and category are required."); return; }
    setLoading(true); setProgress(0); setVideoProgress(0);
    try {
      // Upload image
      let imageUrl = form.imageUrl || "";
      if (form.file) imageUrl = await uploadFile(form.file, "equipment", setProgress);

      // Upload video (if provided)
      let videoUrl = form.videoUrl || "";
      if (form.videoFile) videoUrl = await uploadFile(form.videoFile, "equipment-videos", setVideoProgress);

      const payload = {
        name: form.name.trim(), category: form.category,
        description: form.description.trim(), imageUrl,
        videoUrl,
        featured: form.featured, featuredLabel: form.featuredLabel.trim(),
        rentalPrice: form.rentalPrice.trim(), oldPrice: form.oldPrice.trim(),
        rentalUnit: form.rentalUnit.trim() || "day",
        featureBullets: form.featureBulletsText.split("\n").map(l => l.trim()).filter(Boolean),
      };
      let savedId = editId;
      if (editId) { await updateEquipment(editId, payload); toast.success("Equipment updated"); }
      else { const ref = await saveEquipment(payload); savedId = ref.id; toast.success("Equipment added"); }
      if (payload.featured) await clearOtherFeatured(savedId);
      clearForm(); await fetchItems();
    } catch (err) { toast.error("Save failed: " + err.message); }
    finally { setLoading(false); setProgress(0); setVideoProgress(0); }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "", category: item.category || CATEGORIES[0],
      description: item.description || "", file: null,
      imageUrl: item.imageUrl || "", featured: Boolean(item.featured),
      featuredLabel: item.featuredLabel || "", rentalPrice: item.rentalPrice || "",
      oldPrice: item.oldPrice || "", rentalUnit: item.rentalUnit || "day",
      featureBulletsText: Array.isArray(item.featureBullets) ? item.featureBullets.join("\n") : "",
      videoFile: null, videoUrl: item.videoUrl || "",
    });
    setPreview(item.imageUrl || null);
    setVideoPreview(item.videoUrl || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await deleteEquipment(id); toast.success(`"${name}" deleted.`); await fetchItems(); }
    catch { toast.error("Delete failed."); }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Equipment Manager</h1>
        <p>{editId ? "Editing an existing item — update fields and save." : "Add new equipment to the catalogue."}</p>
      </div>

      {/* ── Form ── */}
      <div className="admin-form-card">
        <h2>{editId ? "✏️  Edit Equipment" : "➕  Add New Equipment"}</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Name + Category */}
          <div className="admin-form-grid-2">
            <div className="admin-form-group">
              <label className="admin-label">Name *</label>
              <input
                required className="admin-input"
                value={form.name}
                onChange={e => updateForm("name", e.target.value)}
                placeholder="e.g. ARRI 435 Film Camera"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Category *</label>
              <select className="admin-select" value={form.category} onChange={e => updateForm("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="admin-form-group">
            <label className="admin-label">Description</label>
            <textarea
              className="admin-textarea" rows={3}
              value={form.description}
              onChange={e => updateForm("description", e.target.value)}
              placeholder="Short product description…"
            />
          </div>

          {/* Prices */}
          <div className="admin-form-grid-3">
            <div className="admin-form-group">
              <label className="admin-label">Rental Price</label>
              <input className="admin-input" value={form.rentalPrice} onChange={e => updateForm("rentalPrice", e.target.value)} placeholder="1500" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Old Price</label>
              <input className="admin-input" value={form.oldPrice} onChange={e => updateForm("oldPrice", e.target.value)} placeholder="3000" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Unit</label>
              <input className="admin-input" value={form.rentalUnit} onChange={e => updateForm("rentalUnit", e.target.value)} placeholder="day" />
            </div>
          </div>

          {/* Feature bullets */}
          <div className="admin-form-group">
            <label className="admin-label">Feature Bullets <span style={{ color: "#6b7280", textTransform: "none", fontSize: 10 }}>(one per line)</span></label>
            <textarea
              className="admin-textarea" rows={4}
              value={form.featureBulletsText}
              onChange={e => updateForm("featureBulletsText", e.target.value)}
              placeholder={"Camera package included\nOn-set support available\n4K RAW output"}
            />
          </div>

          {/* ── Media uploads: Image + Video side by side ── */}
          <div className="admin-form-grid-2">
            {/* Thumbnail Image */}
            <div className="admin-form-group">
              <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <ImagePlus style={{ width: 13, height: 13 }} /> Thumbnail Image
              </label>
              <label className="admin-dropzone">
                {preview
                  ? <img src={preview} alt="preview" />
                  : <ImagePlus style={{ width: 28, height: 28, color: "#4b5563" }} />}
                <span>{form.file ? form.file.name : (form.imageUrl ? "Click to change image" : "Click to select image")}</span>
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
              </label>
              {loading && progress > 0 && (
                <div className="admin-progress-track" style={{ marginTop: 8 }}>
                  <div className="admin-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>

            {/* Demo Video */}
            <div className="admin-form-group">
              <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Video style={{ width: 13, height: 13 }} /> Demo Video <span style={{ color: "#6b7280", textTransform: "none", fontSize: 10 }}>(optional)</span>
              </label>
              <label className="admin-dropzone">
                {videoPreview ? (
                  <video src={videoPreview} muted playsInline style={{ height: 120, borderRadius: 8, background: "#000" }} />
                ) : (
                  <Video style={{ width: 28, height: 28, color: "#4b5563" }} />
                )}
                <span>{form.videoFile ? form.videoFile.name : (form.videoUrl ? "Click to change video" : "Click to select video")}</span>
                <input type="file" accept="video/*" style={{ display: "none" }} onChange={handleVideoFile} />
              </label>
              {loading && videoProgress > 0 && (
                <div className="admin-progress-track" style={{ marginTop: 8 }}>
                  <div className="admin-progress-fill" style={{ width: `${videoProgress}%`, background: "linear-gradient(90deg, #a855f7, #c084fc)" }} />
                </div>
              )}
              {/* Clear existing video */}
              {form.videoUrl && !form.videoFile && (
                <button
                  type="button"
                  style={{ marginTop: 6, fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  onClick={() => { updateForm("videoUrl", ""); setVideoPreview(null); }}
                >
                  ✕ Remove existing video
                </button>
              )}
            </div>
          </div>

          {/* Featured toggle */}
          <div className="admin-featured-row">
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={e => updateForm("featured", e.target.checked)}
              />
              <Star style={{ width: 14, height: 14 }} />
              Show as homepage featured equipment
            </label>
            <input
              className="admin-input"
              style={{ flex: 1, minWidth: 200, maxWidth: 280 }}
              value={form.featuredLabel}
              onChange={e => updateForm("featuredLabel", e.target.value)}
              placeholder="Optional badge — e.g. 50% OFF"
            />
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
              {loading ? <Loader2 style={{ width: 15, height: 15, animation: "spin 1s linear infinite" }} /> : <CheckCircle2 style={{ width: 15, height: 15 }} />}
              {loading ? "Saving…" : editId ? "Update Equipment" : "Add Equipment"}
            </button>
            {editId && (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={clearForm}>
                <XCircle style={{ width: 15, height: 15 }} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Equipment list ── */}
      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2>All Equipment</h2>
          <span>{items.length} item{items.length !== 1 ? "s" : ""}</span>
        </div>

        {loadingItems ? (
          <div className="admin-empty">
            <Loader2 style={{ width: 24, height: 24, animation: "spin 1s linear infinite" }} />
            <p>Loading equipment…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <Camera style={{ width: 36, height: 36 }} />
            <p>No equipment yet. Use the form above to add your first item.</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="admin-equip-item">
              {item.imageUrl
                ? <img src={item.imageUrl} alt={item.name} className="admin-equip-item__img" />
                : <div className="admin-equip-item__img-placeholder"><Camera style={{ width: 18, height: 18 }} /></div>
              }
              <div className="admin-equip-item__info">
                <div className="admin-equip-item__name">{item.name}</div>
                <div className="admin-equip-item__cat">{item.category}</div>
                <div className="admin-equip-item__badges">
                  {item.featured && (
                    <span className="admin-badge admin-badge--amber">
                      <Star style={{ width: 9, height: 9 }} /> Featured
                    </span>
                  )}
                  {item.videoUrl && (
                    <span className="admin-badge admin-badge--video">
                      <Play style={{ width: 9, height: 9 }} /> Video
                    </span>
                  )}
                  {item.rentalPrice && (
                    <span className="admin-badge admin-badge--green">
                      ₹{item.rentalPrice}/{item.rentalUnit || "day"}
                    </span>
                  )}
                </div>
              </div>
              <div className="admin-equip-item__actions">
                <button onClick={() => handleEdit(item)} className="admin-icon-btn admin-icon-btn--edit" title="Edit">
                  <Pencil style={{ width: 14, height: 14 }} />
                </button>
                <button onClick={() => handleDelete(item.id, item.name)} className="admin-icon-btn admin-icon-btn--delete" title="Delete">
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

export default EquipmentForm;
