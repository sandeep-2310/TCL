import { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebase';
import { 
  doc, 
  setDoc, 
  onSnapshot 
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut
} from 'firebase/auth';

const AuthContext = createContext();
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Listen for real-time changes to the user document in Firestore
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCurrentUser({
              uid: user.uid,
              fullName: userData.name || user.displayName || 'Guest Believer',
              email: user.email || 'guest@teluguchristian.app',
              phone: userData.phone || '',
              joined: userData.created_at ? new Date(userData.created_at).getFullYear().toString() : new Date().getFullYear().toString(),
              isAnonymous: user.isAnonymous,
              photoURL: user.photoURL || null,
              addresses: userData.addresses || []
            });
          } else {
            // Document doesn't exist yet (e.g. first time login via Google)
            setCurrentUser({
              uid: user.uid,
              fullName: user.displayName || 'Guest Believer',
              email: user.email || 'guest@teluguchristian.app',
              phone: user.phoneNumber || '',
              joined: new Date(user.metadata.creationTime).getFullYear().toString(),
              isAnonymous: user.isAnonymous,
              photoURL: user.photoURL || null,
              addresses: []
            });
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        // No user — sign in anonymously (guest mode)
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Anonymous auth failed:", error);
          // Fallback offline user so the app still renders
          setCurrentUser({
            uid: 'offline-guest',
            fullName: 'Guest Believer',
            email: '',
            phone: '',
            joined: new Date().getFullYear().toString(),
            isAnonymous: true,
            addresses: []
          });
          setLoading(false);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email / Password Login
  const loginWithEmail = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Email / Password Registration
  const registerWithEmail = async (email, password, fullName, phone) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // 1. Save display name to the Firebase user profile
    await updateProfile(user, { displayName: fullName });

    // 2. Create the user document in Firestore 'users' collection
    await setDoc(doc(db, 'users', user.uid), {
      user_id: user.uid,
      name: fullName,
      email: email,
      phone: phone || '',
      address: '',
      addresses: [],
      created_at: new Date().toISOString()
    });

    return result;
  };

  // Google Sign-In
  const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    // Firebase will then sign in anonymously again via onAuthStateChanged
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
