interface Review {
  id: number;
  app_id: string;
  name: string;
  rating: number;
  content: string;
  date: string;
  topic_id: number;
  sentiment_score: number;
}

interface App {
  id: string;
  name: string;
  description: string;
}

interface Topic {
  id: number;
  app_id: string;
  content: string;
}

export type { Review, App, Topic };
