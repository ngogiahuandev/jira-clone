import { axiosInstance } from "@/axios";
import type { GetAllUsersResponse } from "@repo/types";
import { AxiosError } from "axios";

export const users = {
  getUsers: async (searchParams: string) => {
    try {
      const response = await axiosInstance.get<GetAllUsersResponse>(
        `/users?${searchParams}`,
      );
      return {
        users: response.data,
        total: Number(response.headers["x-total-count"]),
        limit: Number(response.headers["x-limit"]),
        page: Number(response.headers["x-page"]),
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
      throw error;
    }
  },
};
