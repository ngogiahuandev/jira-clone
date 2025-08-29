import { auth } from "@/axios/auth";
import { useAuthStore } from "@/stores/auth.store";
import axios, { type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  }
);

axiosInstance.interceptors.response.use(async (response) => {
  if (response.status === 401 && useAuthStore.getState().accessToken) {
    auth
      .rotateTokens()
      .then((res) => {
        useAuthStore.setState({
          accessToken: res.accessToken,
          user: res.user,
        });
      })
      .catch(() => {
        useAuthStore.setState({
          accessToken: null,
          user: null,
        });
      });
  }
  return response;
});
