// Firestore helpers for "Our Work" portfolio
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
} from "firebase/firestore";

export const saveWork = (data) =>
  addDoc(collection(db, "works"), { ...data, createdAt: serverTimestamp() });

export const updateWork = (id, data) =>
  updateDoc(doc(db, "works", id), data);

export const deleteWork = (id) =>
  deleteDoc(doc(db, "works", id));

export const getAllWorks = async () => {
  const snap = await getDocs(
    query(collection(db, "works"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
