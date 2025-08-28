import axios, { type InternalAxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // const accessToken = useAuthStore.getState().accessToken;
    // if (accessToken) {
    //   config.headers.Authorization = `Bearer ${accessToken}`;
    // }
    return config;
  }
);
