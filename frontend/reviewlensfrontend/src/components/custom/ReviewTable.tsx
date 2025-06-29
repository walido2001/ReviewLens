import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReviewData {
  Reviewer: string;
  Review: string;
  Rating: number;
  Sentiment_Score: number;
}

const ReviewTable = () => {
  const dummyData: ReviewData[] = [
    {
      Reviewer: "King Elijah Cañete",
      Review:
        "plss this is the most useful app for assignments asking things I don't know and making essays or even generate images PLZZ ADD THIS FEATURE **ALLOW US TO SEND VIDEOS ON AI CHATGPT**",
      Rating: 5,
      Sentiment_Score: 0.4,
    },
    {
      Reviewer: "Sarah Johnson",
      Review:
        "Great app for learning and getting help with homework. The AI responses are very helpful and accurate.",
      Rating: 4,
      Sentiment_Score: 0.8,
    },
    {
      Reviewer: "Mike Chen",
      Review:
        "The app crashes frequently and the responses are sometimes inaccurate. Needs improvement.",
      Rating: 2,
      Sentiment_Score: -0.3,
    },
    {
      Reviewer: "Emily Rodriguez",
      Review:
        "Absolutely love this app! It helps me with everything from writing to coding. Highly recommend!",
      Rating: 5,
      Sentiment_Score: 0.9,
    },
    {
      Reviewer: "Lisa Wang",
      Review:
        "Best AI assistant I've ever used. The voice feature is amazing and the responses are always helpful.",
      Rating: 5,
      Sentiment_Score: 0.95,
    },
  ];

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
          {dummyData.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.Reviewer}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {item.Rating}/5
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < item.Rating ? "text-yellow-500" : "text-gray-300"
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
                        item.Sentiment_Score >= 0 ? "bg-blue-600" : "bg-red-600"
                      }`}
                      style={{
                        width: `${Math.abs(item.Sentiment_Score) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-xs ${
                      item.Sentiment_Score >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {(item.Sentiment_Score * 100).toFixed(0)}%
                  </span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="truncate" title={item.Review}>
                  {item.Review}
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
