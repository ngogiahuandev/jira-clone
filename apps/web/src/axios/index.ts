import { auth } from "@/axios/auth";
import { useAuthStore } from "@/stores/auth.store";
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      !error.response ||
      original?._retry ||
      error.config?.url?.includes("/auth/rotate-tokens")
    ) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && useAuthStore.getState().accessToken) {
      original._retry = true;
      try {
        const res = await auth.rotateTokens();
        useAuthStore.setState({ accessToken: res.accessToken, user: res.user });

        original.headers.Authorization = `Bearer ${res.accessToken}`;
        return axiosInstance(original);
      } catch (refreshError) {
        useAuthStore.setState({ accessToken: null, user: null });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
