import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const hasValidConfig = Object.values(firebaseConfig).every(Boolean);

const app =
  hasValidConfig && getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

export const firestore = hasValidConfig ? getFirestore(app) : null;
export const auth = hasValidConfig ? getAuth(app) : null;
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (Client-side only)
import { getAnalytics, isSupported } from "firebase/analytics";

export let analytics: any = null;

if (typeof window !== "undefined" && hasValidConfig) {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export const isFirebaseReady = Boolean(firestore);

// Helper function to detect mobile devices
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const signInWithGoogle = async () => {
  if (!auth) return null;
  try {
    if (isMobileDevice()) {
      // Use redirect for mobile devices (popup doesn't work on mobile)
      await signInWithRedirect(auth, googleProvider);
      return null; // Result will be handled by getRedirectResult
    } else {
      // Use popup for desktop (better UX)
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    }
  } catch (error) {
    console.error("Google auth failed", error);
    throw error;
  }
};

// Handle redirect result for mobile Google sign-in
export const handleRedirectResult = async () => {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error("Redirect result failed", error);
    throw error;
  }
};

export const signOut = async () => {
  if (!auth) return;
  await firebaseSignOut(auth);
};

export const signUpWithEmail = async (email: string, pass: string) => {
  if (!auth) return null;
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Sign up failed", error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, pass: string) => {
  if (!auth) return null;
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Sign in failed", error);
    throw error;
  }
};
