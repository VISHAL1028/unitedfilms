/**
 * bulk-upload.mjs
 * ─────────────────────────────────────────────────────────────────
 * One-time script: uploads ALL local assets to Firebase Storage
 * and writes Firestore documents for each equipment item.
 *
 * Run from the Frontend folder:
 *   node scripts/bulk-upload.mjs
 *
 * Requirements (already in package.json):
 *   firebase  ^10+
 * ─────────────────────────────────────────────────────────────────
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, basename, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { lookup } from "mime-types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ── Firebase config (same as firebase.js) ────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAwP2RhO8oPeqwDD-Xo3_QeI9YOhZ13x0k",
  authDomain: "unitedfilms-525dc.firebaseapp.com",
  projectId: "unitedfilms-525dc",
  storageBucket: "unitedfilms-525dc.firebasestorage.app",
  messagingSenderId: "610504729167",
  appId: "1:610504729167:web:d8027611e380d1d7eec03a",
  measurementId: "G-M0QEZQGLS9",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const storage = getStorage(app);

const ASSETS = join(__dirname, "..", "src", "assets");

// ── Helpers ───────────────────────────────────────────────────────
function getMime(filePath) {
  return lookup(filePath) || "application/octet-stream";
}

async function uploadToStorage(localPath, storagePath) {
  const buf  = readFileSync(localPath);
  const mime = getMime(localPath);
  const storRef = ref(storage, storagePath);
  await uploadBytes(storRef, buf, { contentType: mime });
  return getDownloadURL(storRef);
}

function walkDir(dir) {
  const results = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      results.push(...walkDir(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

// ── Check existing Firestore docs to avoid duplicates ────────────
async function getExistingEquipment() {
  const snap = await getDocs(collection(db, "equipment"));
  return new Set(snap.docs.map((d) => d.data().localPath));
}

async function getExistingMedia() {
  const snap = await getDocs(collection(db, "workshops"));
  return new Set(snap.docs.map((d) => d.data().localPath));
}

// Map folder names → Firestore category names
const CATEGORY_MAP = {
  "CAMERAS":                       "Cameras",
  "Color Grading & VFX":           "Color Grading & VFX",
  "FILM PROCESSING & LAB EQUIPMENT": "Film Processing & Lab",
  "Film Scanners & Restoration":   "Film Scanners & Restoration",
  "LENSES":                        "Lenses",
  "PROJECTORS":                    "Projectors",
  "STORAGE & SYSTEMS":             "Storage & Systems",
  "SUPPORT EQUIPMENT":             "Support Equipment",
};

// Equipment descriptions (same as equipmentData.js)
const DESCRIPTIONS = {
  "ARRI 435 Film Camera.webp": "Industry-standard 35mm film camera known for exceptional image quality and reliability on high-end productions.",
  "Autodesk Flame Premium 2015.jpg": "Professional visual effects, finishing, and color grading workstation used in high-end post-production.",
  "Autodesk Inferno.jpg": "High-performance compositing and effects system for feature film and broadcast post-production.",
  "Autodesk Smoke.webp": "Integrated editorial and finishing system combining NLE with professional VFX tools.",
  "Color Master Analyzer.jpg": "Precision color analysis tool for consistent grading across long-form productions.",
  "Digital Vision Nucoda HD.webp": "Advanced color grading and restoration platform with real-time HDR monitoring.",
  "Nucoda Colorgrading System.jpg": "Full-featured color grading suite supporting multiple formats from SD to 4K.",
  "Truelight Baselight 1, 2, HD.jpg": "Baselight grading system with Truelight color science for accurate on-set to post pipeline.",
  "16mm Model C Schmitzer Liquid Gate.webp": "Wet-gate 16mm film printer that eliminates surface scratches during optical printing.",
  "35mm Cinevator.webp": "Continuous 35mm film processing machine for developing negative, positive and reversal stocks.",
  "35mm Model C Printer.webp": "Classic step-contact 35mm optical printer for duplication and effects work.",
  "Arri Film Recorder.webp": "High-precision laser film recorder for recording digital files back to 35mm film.",
  "Bell and Howell Printer.webp": "Continuous contact printer for 16mm and 35mm film duplication.",
  "Densitometers.webp": "Precision instruments for measuring optical density of film to ensure consistent exposure.",
  "E-6 Processing Machine.jpg": "Automated E-6 chemistry processor for color reversal (slide) film development.",
  "Split Reels 16mm & 35mm.webp": "Professional split reels for winding, inspecting, and splicing 16mm and 35mm film.",
  "2x Imagica Scanner.jpg": "High-resolution film scanner supporting 16mm and 35mm for 2K/4K digitization.",
  "Arri Scanner XT.jpg": "Ultra-high resolution scanner for 16mm, 35mm and 65mm film up to 6.5K.",
  "ArriscannerGates.jpg": "Precision film gates for ARRI scanners ensuring stable and accurate film transport.",
  "DFTScanity.jpg": "High-speed film scanner capable of 4K scanning at real-time speeds for archival and restoration.",
  "Lasergraphics Director Film Scanner.jpg": "Precision scanner optimized for frame-by-frame archival scanning of 8mm to 35mm film.",
  "Lipsner Smith Film Cleaner.webp": "Ultrasonic film cleaning system that removes contaminants before scanning or printing.",
  "Northlight Scanner.webp": "High-end pin-registered scanner delivering 4K resolution with exceptional colour accuracy.",
  "Phoenix Film Restoration System.webp": "Automated AI-assisted film restoration platform for scratch, dirt and flicker removal.",
  "Spirit 4K Telecine.jpg": "Thomson Spirit 4K telecine system for real-time film-to-digital transfer at 4K resolution.",
  "ARRI Master Primes (Set of 6).webp": "Premium prime lens set with T1.3 aperture, renowned for sharpness and minimal breathing.",
  "ARRI Ultra Primes (Set of 6).webp": "Compact PL-mount primes delivering consistent coverage and colour across the set.",
  "Angenieux Optimo 15-40.webp": "Wide-range zoom lens ideal for handheld documentary and fast-moving narrative work.",
  "Angenieux Optimo 17-120.webp": "7:1 zoom ratio covering wide to medium telephoto — the workhorse of cinema zooms.",
  "Angenieux Optimo 24-290mm.webp": "Long-range zoom for sports, wildlife, and action cinematography.",
  "Canon Broadcast Lenses.webp": "High-performance broadcast zoom lenses for ENG, studio, and live event production.",
  "Canon CN-E Serie.webp": "Cinema prime lenses with electronic iris control and remarkable resolving power.",
  "Cooke 18-100 T3.webp": "Classic Cooke zoom lens with the iconic warm \"Cooke Look\" loved by cinematographers.",
  "Fujinon Broadcast Lenses.webp": "Professional broadcast zoom lenses with superb optical performance and servo control.",
  "Barco 2K DP90 Projector.webp": "DCI-compliant 2K digital cinema projector for professional screening rooms.",
  "Christie CP 2220.jpg": "2K DLP cinema projector with 20,000 lumens output for large-format screening.",
  "Christie Laser DCP Projector.webp": "RGB laser DCI projector delivering exceptional brightness and colour volume.",
  "NEC DCI Projector.webp": "Compact yet powerful DCI-certified projector suitable for preview theatres.",
  "Sony 4K DCI Projector.webp": "Native 4K SXRD laser projector with wide colour gamut and HDR capability.",
  "ARRI.jpg": "ARRI on-set media management and storage solution for digital negative workflows.",
  "Avid Unity 5.1.4 Media Engine.webp": "Shared storage server enabling collaborative real-time Avid editing across multiple workstations.",
  "O'Connor 2065.webp": "Professional fluid head offering silky-smooth pan and tilt for cinematic camera movement.",
  "O'Connor 2575B Tripod.webp": "Heavy-duty carbon fibre tripod system designed for large cinema cameras.",
  "Ronford Tripod.webp": "Studio-grade tripod system providing rock-solid stability for heavy lens configurations.",
  "Vinten Vector 70 Pedestal.webp": "Motorised studio pedestal with smooth height adjustment for live and studio productions.",
};

// ── 1. Upload Equipment Images ────────────────────────────────────
async function uploadEquipment() {
  console.log("\n📸 Uploading equipment images…");
  const existing = await getExistingEquipment();
  const equipDir = join(ASSETS, "equipments");
  const files = walkDir(equipDir);

  let added = 0, skipped = 0;

  for (const filePath of files) {
    const relPath = relative(equipDir, filePath); // e.g. "CAMERAS\ARRI 435 Film Camera.webp"
    const parts = relPath.split(/[\\/]/);
    const folderName = parts[0];
    const fileName = parts[parts.length - 1];
    const category = CATEGORY_MAP[folderName] || folderName;
    const name = basename(fileName, extname(fileName));
    const localKey = relPath;

    if (existing.has(localKey)) {
      console.log(`  ⏩ Skipping (already in Firestore): ${fileName}`);
      skipped++;
      continue;
    }

    try {
      const storagePath = `equipment/${folderName}/${fileName}`;
      console.log(`  ⬆  Uploading: ${storagePath}`);
      const url = await uploadToStorage(filePath, storagePath);

      await addDoc(collection(db, "equipment"), {
        name,
        category,
        description: DESCRIPTIONS[fileName] || "",
        imageUrl: url,
        localPath: localKey,
        createdAt: serverTimestamp(),
      });

      console.log(`  ✅ Done: ${name}`);
      added++;
    } catch (err) {
      console.error(`  ❌ Error uploading ${fileName}:`, err.message);
    }
  }

  console.log(`\n  Equipment: ${added} added, ${skipped} skipped.\n`);
}

// ── 2. Upload Service Videos / Images ────────────────────────────
const SERVICE_FOLDERS = [
  "360° 3D PRODUCTION",
  "Film Production Page",
  "Film Restoration Page",
  "Post Production Page",
  "RELIGHTING WITH FLAME",
];

async function uploadServiceMedia() {
  console.log("🎬 Uploading service page media…");
  const existing = await getExistingMedia();

  let added = 0, skipped = 0;

  for (const folder of SERVICE_FOLDERS) {
    const dir = join(ASSETS, folder);
    let files;
    try {
      files = walkDir(dir);
    } catch {
      console.log(`  ⚠️  Folder not found: ${folder}`);
      continue;
    }

    for (const filePath of files) {
      const fileName = basename(filePath);
      const localKey = `${folder}/${fileName}`;

      if (existing.has(localKey)) {
        console.log(`  ⏩ Skipping: ${fileName}`);
        skipped++;
        continue;
      }

      const mime = getMime(filePath);
      const mediaType = mime.startsWith("video/") ? "video" : "image";
      const storagePath = `serviceMedia/${folder}/${fileName}`;

      try {
        console.log(`  ⬆  Uploading [${mediaType}]: ${fileName} (${(statSync(filePath).size / 1024 / 1024).toFixed(1)} MB)`);
        const url = await uploadToStorage(filePath, storagePath);

        // Upload to 'workshops' collection (matching WorkshopForm.jsx)
        await addDoc(collection(db, "workshops"), {
          title: fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " "), // Clean title from filename
          description: `Asset from ${folder} catalogue`,
          mediaUrl: url,
          mediaType,
          folder,
          localPath: localKey,
          createdAt: serverTimestamp(),
        });

        console.log(`  ✅ Done: ${fileName}`);
        added++;
      } catch (err) {
        console.error(`  ❌ Error: ${fileName} — ${err.message}`);
      }
    }
  }

  console.log(`\n  Service media: ${added} added, ${skipped} skipped.\n`);
}

// ── 3. Upload root-level assets ───────────────────────────────────
const ROOT_FILES = [
  "hero-bg.jpg",
  "phantom-camera.jpg",
  "search.png",
  "workshop-bg.jpg",
  "workshop1.avif",
];

async function uploadRootAssets() {
  console.log("🖼  Uploading root assets…");
  const existing = await getExistingMedia();

  for (const fileName of ROOT_FILES) {
    const filePath = join(ASSETS, fileName);
    const localKey = `root/${fileName}`;

    if (existing.has(localKey)) {
      console.log(`  ⏩ Skipping: ${fileName}`);
      continue;
    }

    try {
      console.log(`  ⬆  Uploading: ${fileName}`);
      const url = await uploadToStorage(filePath, `rootAssets/${fileName}`);

      await addDoc(collection(db, "serviceMedia"), {
        fileName,
        folder: "root",
        mediaType: "image",
        url,
        localPath: localKey,
        createdAt: serverTimestamp(),
      });

      console.log(`  ✅ Done: ${fileName} → ${url}`);
    } catch (err) {
      console.error(`  ❌ Error: ${fileName} — ${err.message}`);
    }
  }
}

// ── Run ───────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 United Films — Bulk Firebase Upload");
  console.log("═".repeat(50));

  await uploadEquipment();
  await uploadServiceMedia();
  await uploadRootAssets();

  console.log("\n✅ All done! Check Firebase Console to verify.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
