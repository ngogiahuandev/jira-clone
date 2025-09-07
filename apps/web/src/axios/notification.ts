import { axiosInstance } from "@/axios";
import type {
  GetMyNotificationsResponse,
  GetNotificationByIdResponse,
  MarkAsReadResponse,
} from "@repo/types";
import { AxiosError } from "axios";

export const notification = {
  getMyNotifications: async (
    page?: number,
    limit?: number,
    search?: string
  ) => {
    try {
      const response = await axiosInstance.get<GetMyNotificationsResponse>(
        "/notifications",
        {
          params: {
            page,
            limit,
            search: search?.trim(),
          },
        }
      );
      const total = Number(response.headers["x-total-count"]);
      const limitNumber = Number(response.headers["x-limit"]);
      const pageNumber = Number(response.headers["x-page"]);
      return {
        notifications: response.data,
        total,
        limit: limitNumber,
        page: pageNumber,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
      throw error;
    }
  },
  getNotificationById: async (id: string) => {
    try {
      const response = await axiosInstance.get<GetNotificationByIdResponse>(
        `/notifications/${id}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
      throw error;
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await axiosInstance.patch<MarkAsReadResponse>(
        `/notifications/mark-as-read/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
      throw error;
    }
  },
};
