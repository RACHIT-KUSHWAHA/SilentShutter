/* eslint-disable */
import { collection, getDocs, query, where, doc, setDoc, deleteDoc, updateDoc, getDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { PhotoEntry, UserSettings } from "@/types/photos";
import { photoCollection, categories } from "@/data/photos";

const PHOTOS_COLLECTION = "photos";

export async function getPhotos(userId?: string): Promise<PhotoEntry[]> {
  if (!firestore) return photoCollection;

  try {
    let q;
    if (userId) {
      q = query(collection(firestore, PHOTOS_COLLECTION), where("userId", "==", userId));
    } else {
      q = collection(firestore, PHOTOS_COLLECTION);
    }
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return photoCollection;
    }

    return snapshot.docs.map(doc => doc.data() as PhotoEntry);
  } catch (error) {
    console.error("Error fetching photos:", error);
    return photoCollection;
  }
}

export async function getPhotoBySlug(slug: string): Promise<PhotoEntry | undefined> {
  if (!firestore) {
    return photoCollection.find(p => p.slug === slug);
  }

  try {
    const q = query(collection(firestore, PHOTOS_COLLECTION), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return photoCollection.find(p => p.slug === slug);
    }

    return snapshot.docs[0].data() as PhotoEntry;
  } catch (error) {
    console.error("Error fetching photo by slug:", error);
    return photoCollection.find(p => p.slug === slug);
  }
}

export async function seedPhotos() {
  const db = firestore;
  if (!db) {
    console.warn("Firestore not initialized. Cannot seed.");
    return;
  }

  console.log("Seeding photos...");
  const promises = photoCollection.map(photo =>
    setDoc(doc(db, PHOTOS_COLLECTION, photo.id), photo, { merge: true })
  );

  await Promise.all(promises);
  console.log("Photos seeded/updated successfully");
}

// Categories
const CATEGORIES_COLLECTION = "categories";

export interface CategoryEntry {
  id: string;
  name: string;
  slug: string;
}

export async function getCategories(): Promise<CategoryEntry[]> {
  if (!firestore) return categories.map(c => ({ id: c, name: c, slug: c }));

  try {
    const categoriesRef = collection(firestore, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(categoriesRef);

    if (snapshot.empty) {
      // Fallback to default categories if none exist in DB
      return categories.map(c => ({ id: c, name: c, slug: c }));
    }

    return snapshot.docs.map(doc => doc.data() as CategoryEntry);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return categories.map(c => ({ id: c, name: c, slug: c }));
  }
}

export async function addCategoryToDb(name: string) {
  if (!firestore) throw new Error("Database not connected");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const category: CategoryEntry = {
    id: slug,
    name,
    slug
  };

  await setDoc(doc(firestore, CATEGORIES_COLLECTION, slug), category);
  return category;
}

export async function deleteCategoryFromDb(id: string) {
  if (!firestore) throw new Error("Database not connected");
  await deleteDoc(doc(firestore, CATEGORIES_COLLECTION, id));
}


export async function getUserSettings(userId: string): Promise<UserSettings | null> {
  if (!firestore) return null;
  try {
    const docRef = doc(firestore, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserSettings;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
}

export async function getUserByUsername(username: string): Promise<{ uid: string, settings: UserSettings } | null> {
  if (!firestore) return null;
  try {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { uid: doc.id, settings: doc.data() as UserSettings };
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

export async function deletePhotoFromDb(id: string) {
  if (!firestore) throw new Error("Database not connected");
  await deleteDoc(doc(firestore, "photos", id));
}

export async function getOrphanedPhotos() {
  if (!firestore) return [];
  try {
    const photosRef = collection(firestore, "photos");
    const snapshot = await getDocs(photosRef);
    return snapshot.docs
      .map(doc => doc.data() as PhotoEntry)
      .filter(photo => !photo.userId);
  } catch (error) {
    console.error("Error fetching orphaned photos:", error);
    return [];
  }
}

export async function claimOrphanedPhotos(userId: string) {
  const db = firestore;
  if (!db) return 0;
  try {
    const orphans = await getOrphanedPhotos();
    const promises = orphans.map(photo =>
      updateDoc(doc(db, "photos", photo.id), { userId })
    );
    await Promise.all(promises);
    return orphans.length;
  } catch (error) {
    console.error("Error claiming photos:", error);
    return 0;
  }
}
