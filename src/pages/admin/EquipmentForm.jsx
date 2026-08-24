import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { uploadFile } from "@/lib/upload";
import {
  saveEquipment,
  getAllEquipment,
  deleteEquipment,
  updateEquipment,
  setEquipmentFeatured,
  toggleEquipmentListing,
} from "@/lib/db";
import {
  Trash2,
  Pencil,
  ImagePlus,
  Loader2,
  CheckCircle2,
  XCircle,
  Star,
  Camera,
  Video,
  Eye,
  EyeOff,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Cameras",
  "Lenses",
  "Color Grading & VFX",
  "Film Scanners & Restoration",
  "Film Processing & Lab",
  "Projectors",
  "Support Equipment",
  "Storage & Systems",
];

const emptyForm = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  file: null,
  imageUrl: "",
  featured: false,
  featuredLabel: "",
  rentalPrice: "",
  oldPrice: "",
  rentalUnit: "day",
  featureBulletsText: "",
  status: "Available for Rent",
  listed: true,
  // Video fields
  videoFile: null,
  videoUrl: "",
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
  const [filterCategory, setFilterCategory] = useState("All");

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      setItems(await getAllEquipment(true)); // Include delisted in admin
    } catch {
      toast.error("Failed to load equipment.");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateForm = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, file }));
    setPreview(URL.createObjectURL(file));
  };

  const handleVideoFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((f) => ({ ...f, videoFile: file }));
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
      items
        .filter((i) => i.featured && i.id !== currentId)
        .map((i) => setEquipmentFeatured(i.id, false))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) {
      toast.error("Name and category are required.");
      return;
    }
    setLoading(true);
    setProgress(0);
    setVideoProgress(0);
    try {
      // Upload image
      let imageUrl = form.imageUrl || "";
      if (form.file) imageUrl = await uploadFile(form.file, "equipment", setProgress);

      // Upload video
      let videoUrl = form.videoUrl || "";
      if (form.videoFile) {
        videoUrl = await uploadFile(form.videoFile, "equipment/videos", setVideoProgress);
      }

      const featureBullets = form.featureBulletsText
        ? form.featureBulletsText.split("\n").map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        imageUrl,
        videoUrl,
        featured: form.featured,
        featuredLabel: form.featuredLabel.trim(),
        rentalPrice: form.rentalPrice.trim(),
        oldPrice: form.oldPrice.trim(),
        rentalUnit: form.rentalUnit,
        featureBullets,
        status: form.status || "Available for Rent",
        listed: form.listed !== false,
      };

      if (editId) {
        if (form.featured) await clearOtherFeatured(editId);
        await updateEquipment(editId, payload);
        toast.success("Equipment updated successfully.");
      } else {
        const docRef = await saveEquipment(payload);
        if (form.featured) await clearOtherFeatured(docRef.id);
        toast.success("Equipment added successfully.");
      }

      clearForm();
      fetchItems();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      category: item.category || CATEGORIES[0],
      description: item.description || "",
      imageUrl: item.imageUrl || item.image || "",
      featured: item.featured || false,
      featuredLabel: item.featuredLabel || "",
      rentalPrice: item.rentalPrice || "",
      oldPrice: item.oldPrice || "",
      rentalUnit: item.rentalUnit || "day",
      featureBulletsText: (item.featureBullets || []).join("\n"),
      status: item.status || "Available for Rent",
      listed: item.listed !== false,
      videoUrl: item.videoUrl || "",
      file: null,
      videoFile: null,
    });
    setPreview(item.imageUrl || item.image || null);
    setVideoPreview(item.videoUrl || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}" permanently?`)) return;
    try {
      await deleteEquipment(id);
      toast.success("Equipment deleted.");
      fetchItems();
    } catch {
      toast.error("Failed to delete equipment.");
    }
  };

  const handleToggleList = async (item) => {
    const nextState = item.listed === false ? true : false;
    try {
      await toggleEquipmentListing(item.id, nextState);
      toast.success(nextState ? `"${item.name}" is now LISTED on website.` : `"${item.name}" is now DELISTED (hidden).`);
      fetchItems();
    } catch {
      toast.error("Failed to update listing status.");
    }
  };

  const filteredItems =
    filterCategory === "All"
      ? items
      : items.filter((i) => i.category === filterCategory);

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Equipment Management</h1>
        <p>List, delist, add, edit, and attach photos/videos to equipment catalogue items.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, marginBottom: 32 }}>
        {/* Form Panel */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h2 className="admin-card__title">
              {editId ? "Edit Equipment Item" : "Add New Equipment"}
            </h2>
            {editId && (
              <button onClick={clearForm} className="admin-btn admin-btn--ghost" style={{ fontSize: 12 }}>
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
              <div>
                <label className="admin-label">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phantom Flex 4K (1000 fps)"
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className="admin-input"
                />
              </div>

              <div>
                <label className="admin-label">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className="admin-select"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-label">Availability / Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className="admin-select"
                >
                  <option value="Available for Rent">Available for Rent</option>
                  <option value="Available for Sale">Available for Sale</option>
                  <option value="In Facility">In Facility</option>
                  <option value="Available on Set">Available on Set</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Rental / Purchase Price (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. $900 / day or $14,990"
                  value={form.rentalPrice}
                  onChange={(e) => updateForm("rentalPrice", e.target.value)}
                  className="admin-input"
                />
              </div>
            </div>

            <div>
              <label className="admin-label">Description</label>
              <textarea
                rows={3}
                placeholder="Technical specifications, capabilities, included kit, or sensor details..."
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                className="admin-textarea"
              />
            </div>

            {/* Media: Photo & Video Upload */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {/* Photo */}
              <div style={{ border: "1px solid var(--color-border)", padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.2)" }}>
                <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ImagePlus size={14} className="text-primary" /> Equipment Photo
                </label>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                  {preview ? (
                    <img src={preview} alt="Preview" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, border: "1px solid var(--color-border)" }} />
                  ) : (
                    <div style={{ width: 80, height: 60, background: "rgba(255,255,255,0.05)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Camera size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={handleFile} style={{ fontSize: 11, color: "#9ca3af" }} />
                    <input
                      type="text"
                      placeholder="Or paste image URL"
                      value={form.imageUrl}
                      onChange={(e) => {
                        updateForm("imageUrl", e.target.value);
                        setPreview(e.target.value);
                      }}
                      className="admin-input"
                      style={{ marginTop: 6, fontSize: 11, padding: "4px 8px" }}
                    />
                  </div>
                </div>
                {progress > 0 && progress < 100 && (
                  <div style={{ marginTop: 6, fontSize: 10, color: "var(--color-primary)" }}>Uploading image: {progress}%</div>
                )}
              </div>

              {/* Video */}
              <div style={{ border: "1px solid var(--color-border)", padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.2)" }}>
                <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Video size={14} className="text-accent" /> Demo / Showcase Video (Optional)
                </label>
                <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                  {videoPreview ? (
                    <video src={videoPreview} muted style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6, background: "#000" }} />
                  ) : (
                    <div style={{ width: 80, height: 60, background: "rgba(255,255,255,0.05)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Video size={20} className="text-muted-foreground" />
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="video/*" onChange={handleVideoFile} style={{ fontSize: 11, color: "#9ca3af" }} />
                    <input
                      type="text"
                      placeholder="Or paste video URL (.mp4 / .mov)"
                      value={form.videoUrl}
                      onChange={(e) => {
                        updateForm("videoUrl", e.target.value);
                        setVideoPreview(e.target.value);
                      }}
                      className="admin-input"
                      style={{ marginTop: 6, fontSize: 11, padding: "4px 8px" }}
                    />
                  </div>
                </div>
                {videoProgress > 0 && videoProgress < 100 && (
                  <div style={{ marginTop: 6, fontSize: 10, color: "var(--color-accent)" }}>Uploading video: {videoProgress}%</div>
                )}
              </div>
            </div>

            {/* Listing State Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--color-foreground)" }}>
                <input
                  type="checkbox"
                  checked={form.listed !== false}
                  onChange={(e) => updateForm("listed", e.target.checked)}
                />
                <span>Publicly Listed (Visible on website catalogue)</span>
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
              <button
                type="submit"
                disabled={loading}
                className="admin-btn admin-btn--primary"
                style={{ minWidth: 160, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : editId ? (
                  "Update Equipment"
                ) : (
                  <>
                    <Plus size={16} /> Add Equipment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* List & Delist Inventory Table */}
        <div className="admin-card">
          <div className="admin-card__header" style={{ flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 className="admin-card__title">Inventory & Listing Status</h2>
              <p style={{ fontSize: 12, color: "var(--color-muted-foreground)", marginTop: 2 }}>
                Click List/Delist to instantly publish or hide items from the public website.
              </p>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="admin-select"
                style={{ padding: "4px 8px", fontSize: 12 }}
              >
                <option value="All">All Categories ({items.length})</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {loadingItems ? (
            <div style={{ textAlign: "center", padding: 32, color: "var(--color-muted-foreground)" }}>
              <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 8px" }} />
              Loading equipment...
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: "var(--color-muted-foreground)", fontSize: 13 }}>
              No equipment found. Add your first item above.
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)", textAlign: "left", color: "var(--color-muted-foreground)" }}>
                    <th style={{ padding: "10px 12px" }}>Item</th>
                    <th style={{ padding: "10px 12px" }}>Category</th>
                    <th style={{ padding: "10px 12px" }}>Status</th>
                    <th style={{ padding: "10px 12px" }}>Listing</th>
                    <th style={{ padding: "10px 12px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const isListed = item.listed !== false;
                    return (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                          opacity: isListed ? 1 : 0.6,
                          background: isListed ? "transparent" : "rgba(255,255,255,0.02)",
                        }}
                      >
                        <td style={{ padding: "10px 12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <img
                              src={item.imageUrl || item.image || "/archive/img-bd65e40b-73f6-4edf-b025-6c32b11b1186.jpg"}
                              alt={item.name}
                              style={{ width: 44, height: 34, objectFit: "cover", borderRadius: 4, background: "#111" }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, color: "var(--color-foreground)" }}>{item.name}</div>
                              {item.rentalPrice && (
                                <div style={{ fontSize: 11, color: "var(--color-primary)" }}>{item.rentalPrice}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "10px 12px", color: "var(--color-muted-foreground)" }}>
                          {item.category}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 11, color: "var(--color-accent)", border: "1px solid var(--color-border)", padding: "2px 6px", borderRadius: 4 }}>
                            {item.status || "Available"}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          <button
                            onClick={() => handleToggleList(item)}
                            title={isListed ? "Click to delist (hide from website)" : "Click to list (show on website)"}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 5,
                              padding: "3px 8px",
                              borderRadius: 12,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              border: isListed ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(239,68,68,0.3)",
                              background: isListed ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                              color: isListed ? "#4ade80" : "#f87171",
                            }}
                          >
                            {isListed ? <Eye size={12} /> : <EyeOff size={12} />}
                            {isListed ? "Listed" : "Delisted"}
                          </button>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <div style={{ display: "inline-flex", gap: 6 }}>
                            <button
                              onClick={() => handleEdit(item)}
                              className="admin-btn admin-btn--ghost"
                              style={{ padding: "4px 8px" }}
                              title="Edit"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="admin-btn admin-btn--danger"
                              style={{ padding: "4px 8px" }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EquipmentForm;
