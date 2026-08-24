import { storage } from "./firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

/**
 * Converts an image file to a compressed base64 data URL as a reliable fallback.
 */
const fileToBase64 = (file, maxWidth = 1200, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a File to Firebase Storage with a 5-second timeout and Base64 fallback.
 * Guaranteed to NEVER hang or block form submissions.
 * @param {File} file - The file to upload
 * @param {string} folder - Storage folder, e.g. "equipment" or "works"
 * @param {(progress: number) => void} [onProgress] - Progress callback
 * @returns {Promise<string>} Public URL or optimized data URL
 */
export const uploadFile = async (file, folder = "uploads", onProgress) => {
  if (!file) return "";

  // Try Firebase Storage first with a timeout
  const uploadToStorage = () =>
    new Promise((resolve, reject) => {
      try {
        const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const storageRef = ref(storage, `${folder}/${safeName}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        const timeout = setTimeout(() => {
          uploadTask.cancel();
          reject(new Error("Storage upload timed out"));
        }, 5000);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            onProgress?.(progress);
          },
          (error) => {
            clearTimeout(timeout);
            reject(error);
          },
          async () => {
            clearTimeout(timeout);
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (err) {
              reject(err);
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });

  try {
    return await uploadToStorage();
  } catch (storageError) {
    console.warn("Firebase Storage unavailable or blocked, falling back to direct local data encoding:", storageError.message);
    // Fallback: convert file to optimized data URL so it stores directly in Firestore and displays 100% reliably
    return await fileToBase64(file);
  }
};
