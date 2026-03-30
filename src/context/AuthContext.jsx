import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user login check
    const savedUser = localStorage.getItem('telugu_christian_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Create a default session for the prototype
      const defaultUser = {
        uid: 'user123',
        fullName: 'Samuel Vardhan',
        email: 'samuel.vardhan@email.com',
        phone: '+91 98765 43210',
        joined: '2021',
        addresses: [{
          house: 'Flat 402, Zion Heights',
          street: 'Gospel Lane, Banjara Hills',
          city: 'Hyderabad',
          pincode: '500034'
        }]
      };
      setCurrentUser(defaultUser);
      localStorage.setItem('telugu_christian_user', JSON.stringify(defaultUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('telugu_christian_user', JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('telugu_christian_user');
    // For prototype purposes, recreate the mock after 1s so demo keeps working
    setTimeout(() => {
      const defaultUser = {
        uid: 'user123',
        fullName: 'Samuel Vardhan',
        email: 'samuel.vardhan@email.com',
        phone: '+91 98765 43210',
        joined: '2021'
      };
      login(defaultUser);
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
