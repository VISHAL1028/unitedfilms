import { db } from "./firebase";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";

// EQUIPMENT

export const saveEquipment = (data) =>
  addDoc(collection(db, "equipment"), { ...data, createdAt: serverTimestamp() });

export const updateEquipment = (id, data) =>
  updateDoc(doc(db, "equipment", id), data);

export const deleteEquipment = (id) =>
  deleteDoc(doc(db, "equipment", id));

export const setEquipmentFeatured = (id, featured) =>
  updateDoc(doc(db, "equipment", id), { featured });

export const getAllEquipment = async () => {
  const snap = await getDocs(
    query(collection(db, "equipment"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getFeaturedEquipment = async () => {
  const snap = await getDocs(
    query(collection(db, "equipment"), where("featured", "==", true), limit(1))
  );
  const featured = snap.docs[0];
  return featured ? { id: featured.id, ...featured.data() } : null;
};

// CONTACT MESSAGES

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
