import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSpecialRentalConfig, saveSpecialRentalConfig } from "@/lib/db";
import { DollarSign, Save, Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_INCLUDED = [
  "Phantom Flex 4K camera + recorder + preview monitor",
  "Flame relighting workstation on set",
  "Miller fluid head camera tripod",
  "PL lens set — Canon 50mm and 300mm zoom",
  "3 tons grip, electric and set lighting: lights, cables, gels, green screen, board and more",
  "Camera technician / operator",
  "Underwater remote control housing and drone also available",
];

const RentalsManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    kicker: "!!! Special special special !!!",
    title: "Special rental",
    lead: "Give your production edge. Phantom Flex 4K universal camera: two formats, high speed up to 1000 fps and regular speed 24/30 fps at the same time. More than 60% off super deal.",
    dailyRate: "$900",
    dailyLabel: "Daily rate",
    weeklyRate: "$3,400",
    weeklyLabel: "Weekly rate",
    packageRate: "$4,200 / week",
    packageLabel: "Phantom + recorder + Flame relighting",
    monthlyNote: "Ask for the best monthly rate for an entire production — rent the Phantom for the price of an Arri.",
    includedItems: DEFAULT_INCLUDED,
  });
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    getSpecialRentalConfig()
      .then((data) => {
        if (data) setForm((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    setForm((prev) => ({
      ...prev,
      includedItems: [...prev.includedItems, newItem.trim()],
    }));
    setNewItem("");
  };

  const handleRemoveItem = (index) => {
    setForm((prev) => ({
      ...prev,
      includedItems: prev.includedItems.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSpecialRentalConfig(form);
      toast.success("Special Rental rates and configuration saved successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save special rental settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page-header">
        <h1>Special Rental & Pricing CMS</h1>
        <p>Edit the special deal rates, included equipment packages, and discount highlights across the website.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 48, color: "var(--color-muted-foreground)" }}>
          <Loader2 size={28} className="animate-spin" style={{ margin: "0 auto 12px" }} />
          Loading settings...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Rate Cards Editor */}
          <div className="admin-card">
            <h2 className="admin-card__title" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <DollarSign size={18} className="text-primary" /> Special Rental Rate Cards
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              <div style={{ border: "1px solid var(--color-border)", padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.2)" }}>
                <label className="admin-label">Card 1 Label</label>
                <input
                  type="text"
                  value={form.dailyLabel}
                  onChange={(e) => updateField("dailyLabel", e.target.value)}
                  className="admin-input"
                  style={{ marginBottom: 8 }}
                />
                <label className="admin-label">Card 1 Price</label>
                <input
                  type="text"
                  value={form.dailyRate}
                  onChange={(e) => updateField("dailyRate", e.target.value)}
                  className="admin-input"
                  placeholder="e.g. $900"
                />
              </div>

              <div style={{ border: "1px solid var(--color-border)", padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.2)" }}>
                <label className="admin-label">Card 2 Label</label>
                <input
                  type="text"
                  value={form.weeklyLabel}
                  onChange={(e) => updateField("weeklyLabel", e.target.value)}
                  className="admin-input"
                  style={{ marginBottom: 8 }}
                />
                <label className="admin-label">Card 2 Price</label>
                <input
                  type="text"
                  value={form.weeklyRate}
                  onChange={(e) => updateField("weeklyRate", e.target.value)}
                  className="admin-input"
                  placeholder="e.g. $3,400"
                />
              </div>

              <div style={{ border: "1px solid var(--color-border)", padding: 14, borderRadius: 8, background: "rgba(0,0,0,0.2)" }}>
                <label className="admin-label">Card 3 Label</label>
                <input
                  type="text"
                  value={form.packageLabel}
                  onChange={(e) => updateField("packageLabel", e.target.value)}
                  className="admin-input"
                  style={{ marginBottom: 8 }}
                />
                <label className="admin-label">Card 3 Price</label>
                <input
                  type="text"
                  value={form.packageRate}
                  onChange={(e) => updateField("packageRate", e.target.value)}
                  className="admin-input"
                  placeholder="e.g. $4,200 / week"
                />
              </div>
            </div>
          </div>

          {/* Banner & Text Content */}
          <div className="admin-card">
            <h2 className="admin-card__title" style={{ marginBottom: 16 }}>Headline & Description</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div>
                <label className="admin-label">Kicker / Banner Accent</label>
                <input
                  type="text"
                  value={form.kicker}
                  onChange={(e) => updateField("kicker", e.target.value)}
                  className="admin-input"
                  placeholder="e.g. !!! Special special special !!!"
                />
              </div>

              <div>
                <label className="admin-label">Page Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="admin-input"
                  placeholder="e.g. Special rental"
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label className="admin-label">Lead Paragraph</label>
              <textarea
                rows={3}
                value={form.lead}
                onChange={(e) => updateField("lead", e.target.value)}
                className="admin-textarea"
              />
            </div>

            <div>
              <label className="admin-label">Monthly Rate Note</label>
              <input
                type="text"
                value={form.monthlyNote}
                onChange={(e) => updateField("monthlyNote", e.target.value)}
                className="admin-input"
                placeholder="e.g. Ask for the best monthly rate for an entire production..."
              />
            </div>
          </div>

          {/* Included Package Spec List */}
          <div className="admin-card">
            <h2 className="admin-card__title" style={{ marginBottom: 16 }}>Included Free of Charge Package Items</h2>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Add package item (e.g. Phantom Flex 4K camera, Flame relighting, lens set...)"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="admin-input"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={handleAddItem}
                className="admin-btn admin-btn--secondary"
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={16} /> Add Item
              </button>
            </div>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {form.includedItems.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    border: "1px solid var(--color-border)",
                    borderRadius: 6,
                    background: "rgba(255,255,255,0.02)",
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "var(--color-foreground)" }}>— {item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="admin-btn admin-btn--danger"
                    style={{ padding: "3px 6px" }}
                    title="Remove item"
                  >
                    <Trash2 size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Save Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
            <button
              type="submit"
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
                  <Save size={16} /> Save Rental Settings
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};

export default RentalsManager;
