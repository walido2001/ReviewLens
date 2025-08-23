import type { Review, App, Topic } from "@/dataTypes/reviewTypes";

export interface GlobalState {
  // Apps
  appsList: App[];
  currentApp: App | null;

  // Reviews
  reviews: Review[];
  reviewsPage: number;
  reviewsPerPage: number;
  reviewsTotal: number;
  reviewsTotalPages: number;

  // Topics
  topics: Topic[];

  // Averages
  sentimentAvg: number | null;
  ratingAvg: number | null;

  // Rating Breakdown
  ratingBreakdown: Array<{ rating: string; count: string }> | null;

  // Loading states
  isLoadingApps: boolean;
  isLoadingReviews: boolean;
  isLoadingTopics: boolean;
  isLoadingSentimentAvg: boolean;
  isLoadingRatingAvg: boolean;
  isLoadingRatingBreakdown: boolean;

  // Processing state
  isProcessing: boolean;
  processingAppId: string | null;

  // Error states
  error: string | null;
}

export interface GlobalContextType {
  state: GlobalState;
  actions: {
    // App actions
    fetchApps: () => Promise<void>;
    setCurrentApp: (app: App) => Promise<void>;

    // Review actions
    fetchReviews: (page?: number, perPage?: number) => Promise<void>;
    fetchReviewsByTopic: (
      topic: string,
      page?: number,
      perPage?: number
    ) => Promise<void>;
    fetchReviewsByRating: (
      rating: number,
      page?: number,
      perPage?: number
    ) => Promise<void>;

    // Topic actions
    fetchTopics: () => Promise<void>;

    // Average actions
    fetchSentimentAvg: () => Promise<void>;
    fetchRatingAvg: () => Promise<void>;

    // Rating Breakdown actions
    fetchRatingBreakdown: () => Promise<void>;

    // Processing actions
    startProcessing: (appId: string) => Promise<void>;
    stopProcessing: () => void;

    // Utility actions
    setError: (error: string) => void;
    clearError: () => void;
    retryFailedRequest: () => Promise<void>;
  };
}
