// API Configuration
const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  baseURL: isDevelopment
    ? "http://127.0.0.1:5000"
    : "https://your-production-domain.com", // Update this with your actual production URL
  timeout: 10000,
  retryAttempts: 2,
  retryDelay: 1000, // 1 second delay between retries
  supportsCredentials: true,
};

export const ENDPOINTS = {
  // Customer endpoints
  apps: "/customer/apps",
  app: "/customer/app",
  reviews: "/customer/reviews",
  topics: "/customer/topics",
  reviewsByTopic: "/customer/reviews/topic",
  reviewsByRating: "/customer/reviews/rating",
  sentimentAvg: "/customer/sentiment/avg",
  ratingAvg: "/customer/rating/avg",
  ratingBreakdown: "/customer/reviews/rating-breakdown",
  ratingTrend: "/customer/reviews/rating-trend",

  // Processing endpoints
  processApp: "/processing/process",
  testReviewExtraction: "/processing/test/reviewExtraction",
  testSentimentAnalysis: "/processing/test/sentimentAnalysis",
  testTopicExtraction: "/processing/test/topicExtraction",
  testReviewTopicLinkage: "/processing/test/reviewTopicLinkage",
};
