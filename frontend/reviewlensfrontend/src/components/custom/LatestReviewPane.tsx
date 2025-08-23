import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalContext } from "@/context/GlobalContext";
import type { Review } from "@/dataTypes/reviewTypes";

const LatestReviewPane = () => {
  const { state } = useGlobalContext();

  // Get the latest review (first in the array since they're sorted by date)
  const latestReview: Review | null =
    state.reviews.length > 0 ? state.reviews[0] : null;

  return (
    <Card className="h-64">
      <CardHeader>
        <CardTitle className="text-lg">Latest Review</CardTitle>
      </CardHeader>
      <CardContent>
        {latestReview ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">{latestReview.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-sm">{latestReview.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < latestReview.rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4">
              {latestReview.content}
            </p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(latestReview.date).toLocaleDateString()}</span>
              {latestReview.topic_id && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Topic {latestReview.topic_id}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500 text-sm">No reviews available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LatestReviewPane;
