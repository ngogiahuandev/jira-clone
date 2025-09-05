import { axiosInstance } from ".";
import type { SignInSchema, SignUpSchema } from "@repo/validation";
import type {
  ErrorResponse,
  MeResponse,
  RotateTokensResponse,
  SignInResponse,
  SignOutResponse,
  SignUpResponse,
} from "@repo/types";
import { AxiosError } from "axios";

export const auth = {
  signIn: async (data: SignInSchema) => {
    try {
      const response = await axiosInstance.post<SignInResponse>(
        "/auth/sign-in",
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.message;
      }
      throw error;
    }
  },

  signUp: async (data: SignUpSchema) => {
    try {
      const response = await axiosInstance.post<SignUpResponse>(
        "/auth/sign-up",
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
      throw error;
    }
  },

  signOut: async () => {
    try {
      const response =
        await axiosInstance.post<SignOutResponse>("/auth/sign-out");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
      throw error;
    }
  },

  me: async () => {
    try {
      const response = await axiosInstance.get<MeResponse>("/auth/me");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
      throw error;
    }
  },

  rotateTokens: async () => {
    try {
      const response = await axiosInstance.post<RotateTokensResponse>(
        "/auth/rotate-tokens"
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
      throw error;
    }
  },
};
