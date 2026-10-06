import { createContext, useContext, useState, useCallback, useMemo } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "registeredUsers";
const SESSION_KEY = "authUser";

const DEMO_USER = { name: "Uzair", email: "uzair@example.com", password: "admin123" };

const readJSON = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const hashPassword = async (text) => {
  const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJSON(SESSION_KEY, null));

  const startSession = (profile) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(profile));
    setUser(profile);
  };

  const register = useCallback(async ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = readJSON(USERS_KEY, []);

    if (cleanEmail === DEMO_USER.email || users.some((u) => u.email === cleanEmail)) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    } catch {
      return { ok: false, error: "Could not save your account. Storage is full." };
    }

    return { ok: true };
  }, []);

  const login = useCallback(async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === DEMO_USER.email && password === DEMO_USER.password) {
      startSession({ name: DEMO_USER.name, email: DEMO_USER.email });
      return true;
    }

    const found = readJSON(USERS_KEY, []).find((u) => u.email === cleanEmail);
    if (!found) return false;

    if ((await hashPassword(password)) !== found.passwordHash) return false;

    startSession({ id: found.id, name: found.name, email: found.email });
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout, register }),
    [user, login, logout, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);