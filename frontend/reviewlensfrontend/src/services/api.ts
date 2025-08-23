import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { API_CONFIG, ENDPOINTS } from "@/config/api";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: API_CONFIG.supportsCredentials, // Include credentials for CORS
});

// Retry logic function
const retryRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>,
  retryCount: number = 0
): Promise<AxiosResponse<T>> => {
  try {
    return await requestFn();
  } catch (error) {
    if (retryCount < API_CONFIG.retryAttempts) {
      // Wait before retrying
      await new Promise((resolve) =>
        setTimeout(resolve, API_CONFIG.retryDelay)
      );
      return retryRequest(requestFn, retryCount + 1);
    }
    throw error;
  }
};

// API service functions
export const apiService = {
  // Apps
  async fetchApps() {
    const response = await retryRequest(() => apiClient.get(ENDPOINTS.apps));
    return response.data;
  },

  async fetchApp(appId?: string, appName?: string) {
    const params = appId ? { appID: appId } : { appName };
    const response = await retryRequest(() =>
      apiClient.get(ENDPOINTS.app, { params })
    );
    return response.data;
  },

  // Reviews
  async fetchReviews(appId: string, page: number = 1, perPage: number = 30) {
    const response = await retryRequest(() =>
      apiClient.get(ENDPOINTS.reviews, {
        params: { appID: appId, page, per_page: perPage },
      })
    );
    return response.data;
  },

  async fetchReviewsByTopic(
    appId: string,
    topic: string,
    page: number = 1,
    perPage: number = 30
  ) {
    const response = await retryRequest(() =>
      apiClient.get(ENDPOINTS.reviewsByTopic, {
        params: { appID: appId, topic, page, per_page: perPage },
      })
    );
    return response.data;
  },

  async fetchReviewsByRating(
    appId: string,
    rating: number,
    page: number = 1,
    perPage: number = 30
  ) {
    const response = await retryRequest(() =>
      apiClient.get(ENDPOINTS.reviewsByRating, {
        params: { appID: appId, rating, page, per_page: perPage },
      })
    );
    return response.data;
  },

  // Topics
  async fetchTopics(appId: string) {
    const response = await retryRequest(() =>
      apiClient.get(ENDPOINTS.topics, {
        params: { appID: appId },
      })
    );
    return response.data;
  },

  // Averages
  async fetchSentimentAvg(appId: string) {
    const response = await retryRequest(() =>
      apiClient.get(ENDPOINTS.sentimentAvg, {
        params: { appID: appId },
      })
    );
    return response.data;
  },

  async fetchRatingAvg(appId: string) {
    const response = await retryRequest(() =>
      apiClient.get(ENDPOINTS.ratingAvg, {
        params: { appID: appId },
      })
    );
    return response.data;
  },

  async fetchRatingBreakdown(appId: string) {
    const response = await retryRequest(() =>
      apiClient.get(ENDPOINTS.ratingBreakdown, {
        params: { appID: appId },
      })
    );
    return response.data;
  },

  // Processing
  async processApp(appId: string) {
    const response = await retryRequest(() =>
      apiClient.post(ENDPOINTS.processApp, { appID: appId })
    );
    return response.data;
  },
};

export default apiService;
