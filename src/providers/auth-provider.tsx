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
  token: string | null;
  setToken: (newToken: string | null) => void;
  refreshToken: string | null;
  setRefreshToken: (newRefreshToken: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [refreshToken, setRefreshToken] = useState<string | null>(sessionStorage.getItem("refreshToken"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      sessionStorage.setItem("refreshToken", refreshToken);
    } else {
      sessionStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
  }, []);

  const contextValue = useMemo(
    () => ({
      token,
      setToken,
      refreshToken,
      setRefreshToken,
      logout,
    }),
    [token, refreshToken, logout]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthProvider;
