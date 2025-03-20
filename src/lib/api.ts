import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACK_URL,
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const clearTokensAndRedirect = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

const refreshAccessToken = async (): Promise<string | null> => {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshSubscribers.push(resolve);
    });
  }
  
  isRefreshing = true;
  try {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const { data } = await api.post<{ accessToken: string; refreshToken?: string }>("/auth/refresh", {
      refreshToken,
    });

    const newToken = data.accessToken;
    localStorage.setItem("token", newToken);

    if (data.refreshToken) {
      sessionStorage.setItem("refreshToken", data.refreshToken);
    }

    onRefreshed(newToken);
    return newToken;
  } catch {
    clearTokensAndRedirect();
    return null;
  } finally {
    isRefreshing = false;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

    if (!error.response) {
      clearTokensAndRedirect();
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    if (error.response.status >= 500) {
      return Promise.reject(new Error("Server error, please try again later."));
    }

    return Promise.reject(error);
  }
);
