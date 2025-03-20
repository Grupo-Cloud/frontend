import axios from "axios";
import {jwtDecode} from "jwt-decode"; 

interface JwtPayload {
  exp?: number; 
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL,
});

const getTokenExpiration = (token: string | null): number | null => {
  if (!token) return null;
  try {
    const decoded: JwtPayload = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null; 
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");
    const { data } = await api.post<{ accessToken: string }>("/auth/refresh", {
      refreshToken,
    });
    const newToken = data.accessToken;
    localStorage.setItem("token", newToken);
    return newToken;
  } catch (error) {
    console.error("Failed to refresh token", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");
    const expirationTime = getTokenExpiration(token);

    if (token && expirationTime) {
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      if (timeUntilExpiration < 60000) {
        console.log("Token is about to expire, refreshing...");
        token = await refreshAccessToken();
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);
