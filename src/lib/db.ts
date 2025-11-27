import { collection, getDocs, query, where, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "./firebase";
import { PhotoEntry } from "@/types/photos";
import { photoCollection, categories } from "@/data/photos";

const PHOTOS_COLLECTION = "photos";

export async function getPhotos(): Promise<PhotoEntry[]> {
  if (!firestore) return photoCollection;

  try {
    const photosRef = collection(firestore, PHOTOS_COLLECTION);
    const snapshot = await getDocs(photosRef);

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

  const photosRef = collection(db, PHOTOS_COLLECTION);
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

