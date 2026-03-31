import { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback profile details since Anonymous users have no metadata
  const guestProfile = {
    fullName: 'Guest Believer',
    email: 'guest@teluguchristian.app',
    phone: 'Add in checkout',
    joined: new Date().getFullYear().toString(),
    addresses: []
  };

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in (anonymously)
        setCurrentUser({
          ...guestProfile,
          uid: user.uid,
          isAnonymous: user.isAnonymous
        });
        setLoading(false);
      } else {
        // No user is signed in, trigger anonymous login
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Firebase Anonymous Auth Failed. Ensure Authentication is enabled in the Firebase Console.", error);
          // Fallback to local offline mock so app doesn't break
          setCurrentUser({
            ...guestProfile,
            uid: 'offline-guest-123'
          });
          setLoading(false);
        }
      }
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const login = async (userData) => {
    // Later used for actual Email/Password login
    setCurrentUser(userData);
  };

  const logout = async () => {
    // Since it's anonymous auth, signing out just resets their cart/id logic
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
