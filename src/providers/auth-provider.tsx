import { Auth } from "@/types/Auth";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface AuthContextType {
  auth: Auth | null;
  setAuth: (auth: Auth | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [auth, setAuth] = useState<Auth | null>({
    access_token: localStorage.getItem("token") || "",
    refresh_token: sessionStorage.getItem("refreshToken") || "",
  });

  useEffect(() => {
    if (auth?.access_token) {
      localStorage.setItem("token", auth.access_token);
    } else {
      localStorage.removeItem("token");
    }
  }, [auth]);

  useEffect(() => {
    if (auth?.refresh_token) {
      sessionStorage.setItem("refreshToken", auth.refresh_token);
    } else {
      sessionStorage.removeItem("refreshToken");
    }
  }, [auth]);

  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
  }, []);

  const contextValue = useMemo(
    () => ({
      auth,
      setAuth,
      logout,
    }),
    [auth, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthProvider;
