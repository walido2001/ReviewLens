import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalContext } from "@/context/GlobalContext";
import type { Review } from "@/dataTypes/reviewTypes";

const ReviewTable = () => {
  const { state } = useGlobalContext();

  return (
    <div className="overflow-auto max-h-80">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Reviewer</TableHead>
            <TableHead className="text-left">Rating</TableHead>
            <TableHead className="text-left">Sentiment</TableHead>
            <TableHead className="text-left">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.reviews.slice(0, 5).map((review: Review) => (
            <TableRow key={review.id}>
              <TableCell className="font-medium">{review.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {review.rating}/5
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < review.rating
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        review.sentiment_score >= 0
                          ? "bg-blue-600"
                          : "bg-red-600"
                      }`}
                      style={{
                        width: `${Math.abs(review.sentiment_score) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      review.sentiment_score >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {(review.sentiment_score * 100).toFixed(0)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={review.content}>
                  {review.content}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewTable;
