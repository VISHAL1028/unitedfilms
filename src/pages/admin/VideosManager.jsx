import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getVideoConfig, saveVideoConfig, resetVideoConfig } from "@/lib/db";
import { clips as defaultClips } from "@/lib/site-media";
import { uploadFile } from "@/lib/upload";
import {
  Video,
  Save,
  Loader2,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Film,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

// Preview Player inside the admin panel
function VideoPlayerPreview({ src, poster, label, portrait = false }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  if (!src) {
    return (
      <div
        style={{
          width: "100%",
          aspectRatio: portrait ? "9/16" : "16/9",
          maxHeight: 280,
          background: "rgba(0,0,0,0.5)",
          border: "1px dashed var(--color-border)",
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-muted-foreground)",
          gap: 8,
        }}
      >
        <Film size={32} opacity={0.4} />
        <span style={{ fontSize: 13 }}>No video source provided</span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        border: "1px solid var(--color-border)",
        background: "#000",
        maxHeight: 320,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop
        playsInline
        style={{
          width: "100%",
          aspectRatio: portrait ? "9/16" : "16/9",
          maxHeight: 320,
          objectFit: "contain",
          background: "#000",
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Play/Pause Overlay */}
      <div
        onClick={togglePlay}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isPlaying ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.45)",
          cursor: "pointer",
          transition: "background 0.2s ease",
        }}
      >
        <button
          type="button"
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: 2 }} />}
        </button>
      </div>

      {/* Mute toggle button */}
      <button
        type="button"
        onClick={toggleMute}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.75)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
      </button>

      {/* Caption badge */}
      {label && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            background: "rgba(0,0,0,0.75)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "3px 8px",
            borderRadius: 4,
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

// Single Video Editor Card Component
function SingleVideoEditor({
  title,
  subtitle,
  clipData,
  onChange,
  onResetDefault,
  defaultClip,
}) {
  const [uploadingVid, setUploadingVid] = useState(false);
  const [vidProgress, setVidProgress] = useState(0);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [posterProgress, setPosterProgress] = useState(0);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingVid(true);
    setVidProgress(0);
    try {
      const url = await uploadFile(file, "site-videos", (p) => setVidProgress(p));
      onChange("src", url);
      toast.success("Video file uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Video upload failed. Check file size.");
    } finally {
      setUploadingVid(false);
    }
  };

  const handlePosterUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPoster(true);
    setPosterProgress(0);
    try {
      const url = await uploadFile(file, "site-videos-posters", (p) => setPosterProgress(p));
      onChange("poster", url);
      toast.success("Poster thumbnail uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Poster upload failed.");
    } finally {
      setUploadingPoster(false);
    }
  };

  return (
    <div className="admin-card" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h3 className="admin-card__title" style={{ fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Film size={18} className="text-primary" /> {title}
          </h3>
          {subtitle && <p style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginTop: 2 }}>{subtitle}</p>}
        </div>
        {onResetDefault && (
          <button
            type="button"
            onClick={onResetDefault}
            className="admin-btn admin-btn--secondary"
            style={{ fontSize: 11, padding: "5px 10px", display: "flex", alignItems: "center", gap: 5 }}
            title="Reset this clip back to original archive media"
          >
            <RefreshCw size={12} /> Reset to Default
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        {/* Left Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Label / Caption */}
          <div>
            <label className="admin-label">Title / Caption Label</label>
            <input
              type="text"
              className="admin-input"
              value={clipData.label || ""}
              onChange={(e) => onChange("label", e.target.value)}
              placeholder="e.g. Phantom Flex 4K reel"
            />
          </div>

          {/* Video URL & File Upload */}
          <div>
            <label className="admin-label">Video Source URL (.mp4, .webm, or CDN link)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                className="admin-input"
                value={clipData.src || ""}
                onChange={(e) => onChange("src", e.target.value)}
                placeholder="/archive/vid-264269.mp4 or https://..."
                style={{ flex: 1 }}
              />
              <label
                className="admin-btn admin-btn--secondary"
                style={{
                  cursor: uploadingVid ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                {uploadingVid ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> {vidProgress}%
                  </>
                ) : (
                  <>
                    <Upload size={14} /> Upload Video
                  </>
                )}
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={handleVideoUpload}
                  disabled={uploadingVid}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            {defaultClip?.src && clipData.src !== defaultClip.src && (
              <p style={{ fontSize: 11, color: "#f59e0b", marginTop: 4 }}>
                Default archive source: <code>{defaultClip.src}</code>
              </p>
            )}
          </div>

          {/* Poster Image URL & File Upload */}
          <div>
            <label className="admin-label">Poster Thumbnail Image URL</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="text"
                className="admin-input"
                value={clipData.poster || ""}
                onChange={(e) => onChange("poster", e.target.value)}
                placeholder="/archive/vid-264269-poster.jpg or https://..."
                style={{ flex: 1 }}
              />
              <label
                className="admin-btn admin-btn--secondary"
                style={{
                  cursor: uploadingPoster ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                {uploadingPoster ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> {posterProgress}%
                  </>
                ) : (
                  <>
                    <ImageIcon size={14} /> Upload Poster
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePosterUpload}
                  disabled={uploadingPoster}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          {/* Orientation */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
            <label className="admin-label" style={{ margin: 0 }}>Format:</label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "var(--color-foreground)" }}>
              <input
                type="radio"
                name={`orientation-${title}`}
                checked={!clipData.portrait}
                onChange={() => onChange("portrait", false)}
              />
              Landscape (16:9)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", color: "var(--color-foreground)" }}>
              <input
                type="radio"
                name={`orientation-${title}`}
                checked={!!clipData.portrait}
                onChange={() => onChange("portrait", true)}
              />
              Portrait (9:16)
            </label>
          </div>
        </div>

        {/* Right Preview */}
        <div>
          <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Eye size={13} /> Live Preview
          </label>
          <VideoPlayerPreview
            src={clipData.src}
            poster={clipData.poster}
            label={clipData.label}
            portrait={clipData.portrait}
          />
        </div>
      </div>
    </div>
  );
}

export default function VideosManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  const [form, setForm] = useState({
    hero: { ...defaultClips.hero },
    showcase: defaultClips.showcase.map((c) => ({ ...c })),
    relighting: { ...defaultClips.relighting },
    restoration: { ...defaultClips.restoration },
  });

  useEffect(() => {
    getVideoConfig()
      .then((data) => {
        if (data) {
          setForm({
            hero: { ...defaultClips.hero, ...(data.hero || {}) },
            showcase: (data.showcase && data.showcase.length > 0)
              ? data.showcase
              : defaultClips.showcase.map((c) => ({ ...c })),
            relighting: { ...defaultClips.relighting, ...(data.relighting || {}) },
            restoration: { ...defaultClips.restoration, ...(data.restoration || {}) },
          });
        }
      })
      .catch((err) => console.error("Error loading video settings:", err))
      .finally(() => setLoading(false));
  }, []);

  const updateHero = (field, value) => {
    setForm((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  const updateRelighting = (field, value) => {
    setForm((prev) => ({
      ...prev,
      relighting: { ...prev.relighting, [field]: value },
    }));
  };

  const updateRestoration = (field, value) => {
    setForm((prev) => ({
      ...prev,
      restoration: { ...prev.restoration, [field]: value },
    }));
  };

  const updateShowcaseItem = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.showcase];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, showcase: updated };
    });
  };

  const addShowcaseItem = () => {
    setForm((prev) => ({
      ...prev,
      showcase: [
        ...prev.showcase,
        { src: "", poster: "", label: `Showcase Video #${prev.showcase.length + 1}`, portrait: false },
      ],
    }));
  };

  const removeShowcaseItem = (index) => {
    setForm((prev) => ({
      ...prev,
      showcase: prev.showcase.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      await saveVideoConfig(form);
      toast.success("Site videos configuration saved! Changes are now live.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save site video settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm("Are you sure you want to reset all site videos to original defaults?")) return;
    setSaving(true);
    try {
      await resetVideoConfig();
      setForm({
        hero: { ...defaultClips.hero },
        showcase: defaultClips.showcase.map((c) => ({ ...c })),
        relighting: { ...defaultClips.relighting },
        restoration: { ...defaultClips.restoration },
      });
      toast.success("All videos reset to default archive clips.");
    } catch (err) {
      console.error(err);
      toast.error("Reset failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1>Site Videos & Hero Reel CMS</h1>
          <p>Change, upload, and manage background videos, showreels, and demonstration clips across the website.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={handleResetAll}
            disabled={saving}
            className="admin-btn admin-btn--secondary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <RefreshCw size={14} /> Reset All Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="admin-btn admin-btn--primary"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 8,
          borderBottom: "1px solid var(--color-border)",
          paddingBottom: 12,
          marginBottom: 24,
          overflowX: "auto",
        }}
      >
        {[
          { id: "hero", label: "Homepage Hero Reel" },
          { id: "showcase", label: `Showcase Grid (${form.showcase.length})` },
          { id: "relighting", label: "Autodesk Flame Relighting" },
          { id: "restoration", label: "Film Restoration" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
              background: activeTab === tab.id ? "var(--color-primary)" : "rgba(255,255,255,0.04)",
              color: activeTab === tab.id ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
              border: "1px solid",
              borderColor: activeTab === tab.id ? "var(--color-primary)" : "var(--color-border)",
              whiteSpace: "nowrap",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 60, color: "var(--color-muted-foreground)" }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: "0 auto 12px" }} />
          Loading video configuration...
        </div>
      ) : (
        <div>
          {/* TAB 1: HERO REEL */}
          {activeTab === "hero" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <SingleVideoEditor
                  title="Homepage & Production Hero Video"
                  subtitle="Prominently featured at the top of the Home page and Production page."
                  clipData={form.hero}
                  defaultClip={defaultClips.hero}
                  onChange={updateHero}
                  onResetDefault={() => setForm((prev) => ({ ...prev, hero: { ...defaultClips.hero } }))}
                />
              </div>
            </div>
          )}

          {/* TAB 2: SHOWCASE GRID */}
          {activeTab === "showcase" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--color-foreground)" }}>Phantom Flex 4K Showcase Grid</h2>
                  <p style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>
                    Videos displayed in the 2-column showcase section on Home and Production pages.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addShowcaseItem}
                  className="admin-btn admin-btn--secondary"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <Plus size={15} /> Add Showcase Video
                </button>
              </div>

              {form.showcase.map((clip, idx) => (
                <div key={idx} style={{ position: "relative" }}>
                  <SingleVideoEditor
                    title={`Showcase Video #${idx + 1}`}
                    subtitle={clip.label || "Showcase clip"}
                    clipData={clip}
                    defaultClip={defaultClips.showcase[idx]}
                    onChange={(field, val) => updateShowcaseItem(idx, field, val)}
                    onResetDefault={
                      defaultClips.showcase[idx]
                        ? () => updateShowcaseItem(idx, "src", defaultClips.showcase[idx].src)
                        : null
                    }
                  />
                  {form.showcase.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeShowcaseItem(idx)}
                      className="admin-btn admin-btn--danger"
                      style={{
                        position: "absolute",
                        top: 14,
                        right: 140,
                        fontSize: 11,
                        padding: "5px 10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                      title="Remove this video slot"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RELIGHTING */}
          {activeTab === "relighting" && (
            <div>
              <SingleVideoEditor
                title="Autodesk Flame Relighting Clip"
                subtitle="Featured on Home, Special Rental, and Post Production pages."
                clipData={form.relighting}
                defaultClip={defaultClips.relighting}
                onChange={updateRelighting}
                onResetDefault={() => setForm((prev) => ({ ...prev, relighting: { ...defaultClips.relighting } }))}
              />
            </div>
          )}

          {/* TAB 4: FILM RESTORATION */}
          {activeTab === "restoration" && (
            <div>
              <SingleVideoEditor
                title="Film Restoration 16/35mm Scanning Clip"
                subtitle="Featured on the Film Restoration page."
                clipData={form.restoration}
                defaultClip={defaultClips.restoration}
                onChange={updateRestoration}
                onResetDefault={() => setForm((prev) => ({ ...prev, restoration: { ...defaultClips.restoration } }))}
              />
            </div>
          )}

          {/* Bottom Save Bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 28, marginBottom: 40 }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="admin-btn admin-btn--primary"
              style={{ minWidth: 200, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Saving Changes...
                </>
              ) : (
                <>
                  <Save size={16} /> Save Video Settings
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
