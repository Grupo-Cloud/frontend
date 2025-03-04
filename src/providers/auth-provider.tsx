import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { api } from "@/lib/api";

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
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("token", token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      if (!refreshToken) throw new Error("No refresh token available");
      const response = await api.post("/auth/refresh", {
        refreshToken,
      });
      const newToken = response.data.accessToken;
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token", error);
      logout();
      return null;
    }
  }, [refreshToken, logout]);

  
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshAccessToken();
          if (newToken) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(new Error(error.message));
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
    
  }, [refreshAccessToken]);

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

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext) as AuthContextType;
};

export default AuthProvider;
