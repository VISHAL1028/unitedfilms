import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
  getDocs,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";

// ─── EQUIPMENT ───

export const saveEquipment = (data) =>
  addDoc(collection(db, "equipment"), {
    ...data,
    listed: data.listed !== undefined ? data.listed : true,
    createdAt: serverTimestamp(),
  });

export const updateEquipment = (id, data) =>
  updateDoc(doc(db, "equipment", id), data);

export const toggleEquipmentListing = (id, listed) =>
  updateDoc(doc(db, "equipment", id), { listed });

export const deleteEquipment = (id) =>
  deleteDoc(doc(db, "equipment", id));

export const setEquipmentFeatured = (id, featured) =>
  updateDoc(doc(db, "equipment", id), { featured });

export const getAllEquipment = async (includeDelisted = false) => {
  const snap = await getDocs(
    query(collection(db, "equipment"), orderBy("createdAt", "desc"))
  );
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (includeDelisted) return list;
  return list.filter((i) => i.listed !== false);
};

export const getFeaturedEquipment = async () => {
  const snap = await getDocs(
    query(collection(db, "equipment"), where("featured", "==", true), limit(1))
  );
  const featured = snap.docs[0];
  return featured ? { id: featured.id, ...featured.data() } : null;
};

// ─── SPECIAL RENTAL & PRICING CMS ───

export const getSpecialRentalConfig = async () => {
  try {
    const snap = await getDoc(doc(db, "settings", "specialRental"));
    if (snap.exists()) return snap.data();
  } catch (err) {
    console.error("Error fetching special rental settings:", err);
  }
  return null;
};

export const saveSpecialRentalConfig = async (data) => {
  return setDoc(
    doc(db, "settings", "specialRental"),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

export const getPricingConfig = async () => {
  try {
    const snap = await getDoc(doc(db, "settings", "pricingRates"));
    if (snap.exists()) return snap.data();
  } catch (err) {
    console.error("Error fetching pricing settings:", err);
  }
  return null;
};

export const savePricingConfig = async (data) => {
  return setDoc(
    doc(db, "settings", "pricingRates"),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
};

// ─── CONTACT MESSAGES ───

export const saveMessage = (data) =>
  addDoc(collection(db, "messages"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });

export const getAllMessages = async () => {
  const snap = await getDocs(
    query(collection(db, "messages"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const markMessageRead = (id, read = true) =>
  updateDoc(doc(db, "messages", id), { read });

export const deleteMessage = (id) =>
  deleteDoc(doc(db, "messages", id));
