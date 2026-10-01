import { createContext, useContext } from "react";
import {useLocalStorage} from "../hooks/useLocalStorage";

const AuthContext = createContext(null);
const DEMO = { email: "uzair@example.com", password: "admin123" };

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage("auth", null);

  const login = (email, password) => {
    if (email === DEMO.email && password === DEMO.password) {
      setUser({ name: "Admin", email, role: "Administrator" });
      return true;
    }
    return false;
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
