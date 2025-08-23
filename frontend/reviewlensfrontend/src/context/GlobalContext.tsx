import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { GlobalState, GlobalContextType } from "@/types/globalState";
import { apiService } from "@/services/api";
import type { App, Review, Topic } from "@/dataTypes/reviewTypes";

// Initial state
const initialState: GlobalState = {
  // Apps
  appsList: [],
  currentApp: null,

  // Reviews
  reviews: [],
  reviewsPage: 1,
  reviewsPerPage: 30,
  reviewsTotal: 0,
  reviewsTotalPages: 0,

  // Topics
  topics: [],

  // Averages
  sentimentAvg: null,
  ratingAvg: null,

  // Rating Breakdown
  ratingBreakdown: null,

  // Loading states
  isLoadingApps: false,
  isLoadingReviews: false,
  isLoadingTopics: false,
  isLoadingSentimentAvg: false,
  isLoadingRatingAvg: false,
  isLoadingRatingBreakdown: false,

  // Processing state
  isProcessing: false,
  processingAppId: null,

  // Error states
  error: null,
};

// Action types
type Action =
  | { type: "SET_LOADING_APPS"; payload: boolean }
  | { type: "SET_LOADING_REVIEWS"; payload: boolean }
  | { type: "SET_LOADING_TOPICS"; payload: boolean }
  | { type: "SET_LOADING_SENTIMENT_AVG"; payload: boolean }
  | { type: "SET_LOADING_RATING_AVG"; payload: boolean }
  | { type: "SET_LOADING_RATING_BREAKDOWN"; payload: boolean }
  | { type: "SET_APPS_LIST"; payload: App[] }
  | { type: "SET_CURRENT_APP"; payload: App | null }
  | {
      type: "SET_REVIEWS";
      payload: {
        reviews: Review[];
        total: number;
        pages: number;
        currentPage: number;
      };
    }
  | { type: "SET_TOPICS"; payload: Topic[] }
  | { type: "SET_SENTIMENT_AVG"; payload: number }
  | { type: "SET_RATING_AVG"; payload: number }
  | {
      type: "SET_RATING_BREAKDOWN";
      payload: Array<{ rating: string; count: string }>;
    }
  | {
      type: "SET_PROCESSING";
      payload: { isProcessing: boolean; appId: string | null };
    }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

// Reducer function
const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  console.log(
    `🔄 [GlobalContext] Dispatching action: ${action.type}`,
    action.type === "CLEAR_ERROR" ? undefined : action.payload
  );

  const newState = (() => {
    switch (action.type) {
      case "SET_LOADING_APPS":
        return { ...state, isLoadingApps: action.payload };
      case "SET_LOADING_REVIEWS":
        return { ...state, isLoadingReviews: action.payload };
      case "SET_LOADING_TOPICS":
        return { ...state, isLoadingTopics: action.payload };
      case "SET_LOADING_SENTIMENT_AVG":
        return { ...state, isLoadingSentimentAvg: action.payload };
      case "SET_LOADING_RATING_AVG":
        return { ...state, isLoadingRatingAvg: action.payload };
      case "SET_LOADING_RATING_BREAKDOWN":
        return { ...state, isLoadingRatingBreakdown: action.payload };
      case "SET_APPS_LIST":
        return { ...state, appsList: action.payload };
      case "SET_CURRENT_APP":
        return { ...state, currentApp: action.payload };
      case "SET_REVIEWS":
        return {
          ...state,
          reviews: action.payload.reviews,
          reviewsTotal: action.payload.total,
          reviewsTotalPages: action.payload.pages,
          reviewsPage: action.payload.currentPage,
        };
      case "SET_TOPICS":
        return { ...state, topics: action.payload };
      case "SET_SENTIMENT_AVG":
        return { ...state, sentimentAvg: action.payload };
      case "SET_RATING_AVG":
        return { ...state, ratingAvg: action.payload };
      case "SET_RATING_BREAKDOWN":
        return { ...state, ratingBreakdown: action.payload };
      case "SET_PROCESSING":
        return {
          ...state,
          isProcessing: action.payload.isProcessing,
          processingAppId: action.payload.appId,
        };
      case "SET_ERROR":
        return { ...state, error: action.payload };
      case "CLEAR_ERROR":
        return { ...state, error: null };
      default:
        return state;
    }
  })();

  console.log(`✅ [GlobalContext] State updated for action: ${action.type}`, {
    previousState: state,
    newState: newState,
  });

  return newState;
};

// Create context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Provider component
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  // Action creators
  const actions = {
    fetchApps: async () => {
      console.log("🔄 [GlobalContext] Starting to fetch apps...");
      try {
        dispatch({ type: "SET_LOADING_APPS", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchApps();
        console.log(
          "✅ [GlobalContext] Apps fetched successfully:",
          response.apps
        );
        dispatch({ type: "SET_APPS_LIST", payload: response.apps });
      } catch (error) {
        const errorMessage = "Failed to fetch apps list. Please try again.";
        console.error("❌ [GlobalContext] Error fetching apps:", error);
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_APPS", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching apps");
      }
    },

    setCurrentApp: async (app: App) => {
      console.log("🔄 [GlobalContext] Setting current app:", app.name);
      try {
        dispatch({ type: "SET_CURRENT_APP", payload: app });
        dispatch({ type: "SET_ERROR", payload: null });

        console.log("🔄 [GlobalContext] Fetching all data for app:", app.name);
        // Fetch all related data for the new app using the app ID directly
        await Promise.all([
          actions.fetchReviewsForApp(app.id),
          actions.fetchTopicsForApp(app.id),
          actions.fetchSentimentAvgForApp(app.id),
          actions.fetchRatingAvgForApp(app.id),
          actions.fetchRatingBreakdownForApp(app.id),
        ]);
        console.log(
          "✅ [GlobalContext] All data fetched successfully for app:",
          app.name
        );
      } catch (error) {
        const errorMessage = `Failed to fetch data for ${app.name}. Please try again.`;
        console.error("❌ [GlobalContext] Error setting current app:", error);
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      }
    },

    fetchReviews: async (page: number = 1, perPage: number = 30) => {
      if (!state.currentApp) {
        console.log(
          "⚠️ [GlobalContext] No current app selected, skipping reviews fetch"
        );
        return;
      }

      console.log(
        `🔄 [GlobalContext] Fetching reviews for ${state.currentApp.name} (page ${page}, perPage ${perPage})`
      );
      try {
        dispatch({ type: "SET_LOADING_REVIEWS", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchReviews(
          state.currentApp.id,
          page,
          perPage
        );
        console.log(`✅ [GlobalContext] Reviews fetched successfully:`, {
          count: response.reviews.length,
          total: response.total,
          pages: response.pages,
          currentPage: response.current_page,
        });
        dispatch({
          type: "SET_REVIEWS",
          payload: {
            reviews: response.reviews,
            total: response.total,
            pages: response.pages,
            currentPage: response.current_page,
          },
        });
      } catch (error) {
        const errorMessage = "Failed to fetch reviews. Please try again.";
        console.error("❌ [GlobalContext] Error fetching reviews:", error);
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_REVIEWS", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching reviews");
      }
    },

    fetchReviewsForApp: async (
      appId: string,
      page: number = 1,
      perPage: number = 30
    ) => {
      console.log(
        `🔄 [GlobalContext] Fetching reviews for app ID ${appId} (page ${page}, perPage ${perPage})`
      );
      try {
        dispatch({ type: "SET_LOADING_REVIEWS", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchReviews(appId, page, perPage);
        console.log(`✅ [GlobalContext] Reviews fetched successfully:`, {
          count: response.reviews.length,
          total: response.total,
          pages: response.pages,
          currentPage: response.current_page,
        });
        dispatch({
          type: "SET_REVIEWS",
          payload: {
            reviews: response.reviews,
            total: response.total,
            pages: response.pages,
            currentPage: response.current_page,
          },
        });
      } catch (error) {
        const errorMessage = "Failed to fetch reviews. Please try again.";
        console.error("❌ [GlobalContext] Error fetching reviews:", error);
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_REVIEWS", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching reviews");
      }
    },

    fetchReviewsByTopic: async (
      topic: string,
      page: number = 1,
      perPage: number = 30
    ) => {
      if (!state.currentApp) return;

      try {
        dispatch({ type: "SET_LOADING_REVIEWS", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchReviewsByTopic(
          state.currentApp.id,
          topic,
          page,
          perPage
        );
        dispatch({
          type: "SET_REVIEWS",
          payload: {
            reviews: response.reviews,
            total: response.total,
            pages: response.pages,
            currentPage: response.current_page,
          },
        });
      } catch (error) {
        const errorMessage =
          "Failed to fetch reviews by topic. Please try again.";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        console.error("Error fetching reviews by topic:", error);
      } finally {
        dispatch({ type: "SET_LOADING_REVIEWS", payload: false });
      }
    },

    fetchReviewsByRating: async (
      rating: number,
      page: number = 1,
      perPage: number = 30
    ) => {
      if (!state.currentApp) return;

      try {
        dispatch({ type: "SET_LOADING_REVIEWS", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchReviewsByRating(
          state.currentApp.id,
          rating,
          page,
          perPage
        );
        dispatch({
          type: "SET_REVIEWS",
          payload: {
            reviews: response.reviews,
            total: response.total,
            pages: response.pages,
            currentPage: response.current_page,
          },
        });
      } catch (error) {
        const errorMessage =
          "Failed to fetch reviews by rating. Please try again.";
        dispatch({ type: "SET_ERROR", payload: errorMessage });
        console.error("Error fetching reviews by rating:", error);
      } finally {
        dispatch({ type: "SET_LOADING_REVIEWS", payload: false });
      }
    },

    fetchTopics: async () => {
      if (!state.currentApp) {
        console.log(
          "⚠️ [GlobalContext] No current app selected, skipping topics fetch"
        );
        return;
      }

      console.log(
        `🔄 [GlobalContext] Fetching topics for ${state.currentApp.name}`
      );
      try {
        dispatch({ type: "SET_LOADING_TOPICS", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchTopics(state.currentApp.id);
        console.log(`✅ [GlobalContext] Topics fetched successfully:`, {
          count: response.topics.length,
          topics: response.topics.map((t: Topic) => t.content),
        });
        dispatch({ type: "SET_TOPICS", payload: response.topics });
      } catch (error) {
        const errorMessage = "Failed to fetch topics. Please try again.";
        console.error("❌ [GlobalContext] Error fetching topics:", error);
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_TOPICS", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching topics");
      }
    },

    fetchTopicsForApp: async (appId: string) => {
      console.log(`🔄 [GlobalContext] Fetching topics for app ID ${appId}`);
      try {
        dispatch({ type: "SET_LOADING_TOPICS", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchTopics(appId);
        console.log(`✅ [GlobalContext] Topics fetched successfully:`, {
          count: response.topics.length,
          topics: response.topics.map((t: Topic) => t.content),
        });
        dispatch({ type: "SET_TOPICS", payload: response.topics });
      } catch (error) {
        const errorMessage = "Failed to fetch topics. Please try again.";
        console.error("❌ [GlobalContext] Error fetching topics:", error);
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_TOPICS", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching topics");
      }
    },

    fetchSentimentAvg: async () => {
      if (!state.currentApp) {
        console.log(
          "⚠️ [GlobalContext] No current app selected, skipping sentiment avg fetch"
        );
        return;
      }

      console.log(
        `🔄 [GlobalContext] Fetching sentiment average for ${state.currentApp.name}`
      );
      try {
        dispatch({ type: "SET_LOADING_SENTIMENT_AVG", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchSentimentAvg(
          state.currentApp.id
        );
        console.log(
          `✅ [GlobalContext] Sentiment average fetched successfully:`,
          response.avg_sentiment_score
        );
        dispatch({
          type: "SET_SENTIMENT_AVG",
          payload: response.avg_sentiment_score,
        });
      } catch (error) {
        const errorMessage =
          "Failed to fetch sentiment average. Please try again.";
        console.error(
          "❌ [GlobalContext] Error fetching sentiment average:",
          error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_SENTIMENT_AVG", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching sentiment average");
      }
    },

    fetchSentimentAvgForApp: async (appId: string) => {
      console.log(
        `🔄 [GlobalContext] Fetching sentiment average for app ID ${appId}`
      );
      try {
        dispatch({ type: "SET_LOADING_SENTIMENT_AVG", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchSentimentAvg(appId);
        console.log(
          `✅ [GlobalContext] Sentiment average fetched successfully:`,
          response.avg_sentiment_score
        );
        dispatch({
          type: "SET_SENTIMENT_AVG",
          payload: response.avg_sentiment_score,
        });
      } catch (error) {
        const errorMessage =
          "Failed to fetch sentiment average. Please try again.";
        console.error(
          "❌ [GlobalContext] Error fetching sentiment average:",
          error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_SENTIMENT_AVG", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching sentiment average");
      }
    },

    fetchRatingAvg: async () => {
      if (!state.currentApp) {
        console.log(
          "⚠️ [GlobalContext] No current app selected, skipping rating avg fetch"
        );
        return;
      }

      console.log(
        `🔄 [GlobalContext] Fetching rating average for ${state.currentApp.name}`
      );
      try {
        dispatch({ type: "SET_LOADING_RATING_AVG", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchRatingAvg(state.currentApp.id);
        console.log(
          `✅ [GlobalContext] Rating average fetched successfully:`,
          response.avg_rating
        );
        dispatch({ type: "SET_RATING_AVG", payload: response.avg_rating });
      } catch (error) {
        const errorMessage =
          "Failed to fetch rating average. Please try again.";
        console.error(
          "❌ [GlobalContext] Error fetching rating average:",
          error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_RATING_AVG", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching rating average");
      }
    },

    fetchRatingAvgForApp: async (appId: string) => {
      console.log(
        `🔄 [GlobalContext] Fetching rating average for app ID ${appId}`
      );
      try {
        dispatch({ type: "SET_LOADING_RATING_AVG", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchRatingAvg(appId);
        console.log(
          `✅ [GlobalContext] Rating average fetched successfully:`,
          response.avg_rating
        );
        dispatch({ type: "SET_RATING_AVG", payload: response.avg_rating });
      } catch (error) {
        const errorMessage =
          "Failed to fetch rating average. Please try again.";
        console.error(
          "❌ [GlobalContext] Error fetching rating average:",
          error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_RATING_AVG", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching rating average");
      }
    },

    fetchRatingBreakdown: async () => {
      if (!state.currentApp) {
        console.log(
          "⚠️ [GlobalContext] No current app selected, skipping rating breakdown fetch"
        );
        return;
      }

      console.log(
        `🔄 [GlobalContext] Fetching rating breakdown for ${state.currentApp.name}`
      );
      try {
        dispatch({ type: "SET_LOADING_RATING_BREAKDOWN", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchRatingBreakdown(
          state.currentApp.id
        );
        console.log(
          `✅ [GlobalContext] Rating breakdown fetched successfully:`,
          response.rating_breakdown
        );
        dispatch({
          type: "SET_RATING_BREAKDOWN",
          payload: response.rating_breakdown,
        });
      } catch (error) {
        const errorMessage =
          "Failed to fetch rating breakdown. Please try again.";
        console.error(
          "❌ [GlobalContext] Error fetching rating breakdown:",
          error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_RATING_BREAKDOWN", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching rating breakdown");
      }
    },

    fetchRatingBreakdownForApp: async (appId: string) => {
      console.log(
        `🔄 [GlobalContext] Fetching rating breakdown for app ID ${appId}`
      );
      try {
        dispatch({ type: "SET_LOADING_RATING_BREAKDOWN", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });

        const response = await apiService.fetchRatingBreakdown(appId);
        console.log(
          `✅ [GlobalContext] Rating breakdown fetched successfully:`,
          response.rating_breakdown
        );
        dispatch({
          type: "SET_RATING_BREAKDOWN",
          payload: response.rating_breakdown,
        });
      } catch (error) {
        const errorMessage =
          "Failed to fetch rating breakdown. Please try again.";
        console.error(
          "❌ [GlobalContext] Error fetching rating breakdown:",
          error
        );
        dispatch({ type: "SET_ERROR", payload: errorMessage });
      } finally {
        dispatch({ type: "SET_LOADING_RATING_BREAKDOWN", payload: false });
        console.log("🏁 [GlobalContext] Finished fetching rating breakdown");
      }
    },

    clearError: () => {
      dispatch({ type: "CLEAR_ERROR" });
    },

    startProcessing: async (appId: string) => {
      console.log("🔄 [GlobalContext] Starting processing for app:", appId);
      dispatch({
        type: "SET_PROCESSING",
        payload: { isProcessing: true, appId },
      });
      dispatch({ type: "SET_ERROR", payload: null });
    },

    stopProcessing: () => {
      console.log("🏁 [GlobalContext] Stopping processing");
      dispatch({
        type: "SET_PROCESSING",
        payload: { isProcessing: false, appId: null },
      });
    },

    setError: (error: string) => {
      dispatch({ type: "SET_ERROR", payload: error });
    },

    retryFailedRequest: async () => {
      // Retry the last failed request based on current state
      if (state.error) {
        dispatch({ type: "CLEAR_ERROR" });
        await actions.fetchApps();
      }
    },
  };

  // Initialize apps list on mount
  useEffect(() => {
    actions.fetchApps();
  }, []);

  const contextValue: GlobalContextType = {
    state,
    actions,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
