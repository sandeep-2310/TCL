import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
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
export const useAuth = () => useContext(AuthContext);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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
  const registerWithEmail = async (email, password, fullName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Save display name to the Firebase user profile
    await updateProfile(result.user, { displayName: fullName });
    // Force update local state with the new display name
    setCurrentUser(prev => ({ ...prev, fullName }));
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
