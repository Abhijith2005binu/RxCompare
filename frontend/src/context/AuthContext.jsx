import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  quickDemoLogin as apiQuickDemo,
  getCurrentUser,
  toggleSaveMedicine as apiToggleSave,
  getSavedMedicines as apiGetSavedMedicines,
} from "../utils/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "rxcompare_auth_token";
const USER_KEY = "rxcompare_auth_user";
const GUEST_SAVED_KEY = "rxcompare_guest_saved";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [savedMedicines, setSavedMedicines] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login"); // 'login' | 'register'

  // Toast Notification State
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  // Validate session on load
  useEffect(() => {
    async function initAuth() {
      if (!token) {
        // Load guest saved medicines from localStorage
        try {
          const guestSaved = JSON.parse(localStorage.getItem(GUEST_SAVED_KEY) || "[]");
          setSavedMedicines(guestSaved);
        } catch {
          setSavedMedicines([]);
        }
        setLoadingAuth(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        if (data.success && data.user) {
          setUser(data.user);
          setSavedMedicines(data.user.savedMedicines || []);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch (err) {
        console.warn("Session check failed:", err.message);
        // If 401 unauthorized, log out
        if (err.status === 401) {
          logout();
        }
      } finally {
        setLoadingAuth(false);
      }
    }

    initAuth();
  }, [token]);

  const openAuthModal = useCallback((tab = "login") => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const handleAuthSuccess = (newToken, newUser, successMsg) => {
    setToken(newToken);
    setUser(newUser);
    setSavedMedicines(newUser.savedMedicines || []);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setAuthModalOpen(false);
    showToast(successMsg || `Welcome, ${newUser.name}!`, "success");
  };

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    handleAuthSuccess(data.token, data.user, data.message || `Welcome back, ${data.user.name}!`);
    return data;
  };

  const register = async (name, email, password, role = "user") => {
    const data = await apiRegister(name, email, password, role);
    handleAuthSuccess(data.token, data.user, `Account created successfully! Welcome, ${data.user.name}.`);
    return data;
  };

  const quickLogin = async (role = "admin") => {
    const data = await apiQuickDemo(role);
    handleAuthSuccess(
      data.token,
      data.user,
      `Signed in as Demo ${data.user.role === "admin" ? "Admin" : "Patient"}!`
    );
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Keep or restore guest saved items
    try {
      const guestSaved = JSON.parse(localStorage.getItem(GUEST_SAVED_KEY) || "[]");
      setSavedMedicines(guestSaved);
    } catch {
      setSavedMedicines([]);
    }
    showToast("Signed out successfully", "info");
  };

  // Toggle saving a medicine
  const toggleSave = async (medicine) => {
    if (!medicine || !medicine._id) return;
    const medId = medicine._id;

    if (token) {
      try {
        const res = await apiToggleSave(medId, token);
        setSavedMedicines(res.savedMedicines || []);
        showToast(res.message, res.saved ? "success" : "info");
      } catch (err) {
        showToast(err.message || "Failed to update saved medicine", "error");
      }
    } else {
      // Guest mode fallback
      const exists = savedMedicines.some((m) => (m._id || m) === medId);
      let updated;
      if (exists) {
        updated = savedMedicines.filter((m) => (m._id || m) !== medId);
        showToast(`Removed "${medicine.genericName}" from cabinet`, "info");
      } else {
        updated = [...savedMedicines, medicine];
        showToast(`Saved "${medicine.genericName}" to cabinet (Sign in to sync across devices)`, "success");
      }
      setSavedMedicines(updated);
      localStorage.setItem(GUEST_SAVED_KEY, JSON.stringify(updated));
    }
  };

  const isSaved = (medicineId) => {
    if (!medicineId) return false;
    return savedMedicines.some((m) => {
      const id = typeof m === "string" ? m : m._id;
      return id === medicineId;
    });
  };

  const refreshSavedMedicines = async () => {
    if (!token) return;
    try {
      const meds = await apiGetSavedMedicines(token);
      setSavedMedicines(meds || []);
    } catch (err) {
      console.warn("Failed to refresh saved medicines:", err);
    }
  };

  const isAdmin = user?.role === "admin";
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        savedMedicines,
        loadingAuth,
        authModalOpen,
        authModalTab,
        toast,
        showToast,
        clearToast,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        quickLogin,
        logout,
        toggleSave,
        isSaved,
        refreshSavedMedicines,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
