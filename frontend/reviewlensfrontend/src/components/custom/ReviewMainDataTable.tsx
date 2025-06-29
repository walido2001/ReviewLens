import React, { useState, useMemo } from "react";
import type { Review, Topic } from "@/dataTypes/reviewTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, ChevronDown, Search, Filter, X } from "lucide-react";

const ReviewMainDataTable = () => {
  // Dummy topic data following the Topic interface
  const dummyTopics: Topic[] = [
    {
      id: 5,
      app_id: "com.openai.chatgpt",
      content: "performance, crashes, bugs, slow, lag",
    },
    {
      id: 8,
      app_id: "com.openai.chatgpt",
      content: "accuracy, wrong, incorrect, unreliable",
    },
    {
      id: 11,
      app_id: "com.openai.chatgpt",
      content: "pricing, cost, subscription, expensive",
    },
    {
      id: 12,
      app_id: "com.openai.chatgpt",
      content: "writing, essays, assignments, homework",
    },
    {
      id: 14,
      app_id: "com.openai.chatgpt",
      content: "tutoring, learning, education, teaching",
    },
    {
      id: 15,
      app_id: "com.openai.chatgpt",
      content: "helpful, useful, assistance, support",
    },
    {
      id: 18,
      app_id: "com.openai.chatgpt",
      content: "generic, vague, specific, detailed",
    },
    {
      id: 22,
      app_id: "com.openai.chatgpt",
      content: "voice, audio, conversation, speech",
    },
    {
      id: 25,
      app_id: "com.openai.chatgpt",
      content: "features, video, images, generation",
    },
    {
      id: 30,
      app_id: "com.openai.chatgpt",
      content: "image, generation, create, visual",
    },
  ];

  // Dummy data following the Review interface
  const dummyData: Review[] = [
    {
      id: 73169,
      app_id: "com.openai.chatgpt",
      name: "King Elijah Cañete",
      rating: 5,
      content:
        "plss this is the most useful app for assignments asking things I don't know and making essays or even generate images PLZZ ADD THIS FEATURE **ALLOW US TO SEND VIDEOS ON AI CHATGPT**",
      date: "2025-05-19 09:16:13",
      topic_id: 25,
      sentiment_score: 0.4,
    },
    {
      id: 73170,
      app_id: "com.openai.chatgpt",
      name: "Sarah Johnson",
      rating: 4,
      content:
        "Great app for learning and getting help with homework. The AI responses are very helpful and accurate.",
      date: "2025-05-18 14:30:22",
      topic_id: 15,
      sentiment_score: 0.8,
    },
    {
      id: 73171,
      app_id: "com.openai.chatgpt",
      name: "Mike Chen",
      rating: 2,
      content:
        "The app crashes frequently and the responses are sometimes inaccurate. Needs improvement.",
      date: "2025-05-17 11:45:33",
      topic_id: 8,
      sentiment_score: -0.3,
    },
    {
      id: 73172,
      app_id: "com.openai.chatgpt",
      name: "Emily Rodriguez",
      rating: 5,
      content:
        "Absolutely love this app! It helps me with everything from writing to coding. Highly recommend!",
      date: "2025-05-16 16:20:15",
      topic_id: 12,
      sentiment_score: 0.9,
    },
    {
      id: 73173,
      app_id: "com.openai.chatgpt",
      name: "David Kim",
      rating: 3,
      content:
        "It's okay, but sometimes the responses are too generic. Could be more specific.",
      date: "2025-05-15 09:10:45",
      topic_id: 18,
      sentiment_score: 0.1,
    },
    {
      id: 73174,
      app_id: "com.openai.chatgpt",
      name: "Lisa Wang",
      rating: 5,
      content:
        "Best AI assistant I've ever used. The voice feature is amazing and the responses are always helpful.",
      date: "2025-05-14 13:25:30",
      topic_id: 22,
      sentiment_score: 0.95,
    },
    {
      id: 73175,
      app_id: "com.openai.chatgpt",
      name: "Alex Thompson",
      rating: 1,
      content:
        "Terrible experience. The app is slow and the AI often gives wrong information.",
      date: "2025-05-13 10:15:20",
      topic_id: 5,
      sentiment_score: -0.8,
    },
    {
      id: 73176,
      app_id: "com.openai.chatgpt",
      name: "Maria Garcia",
      rating: 4,
      content:
        "Very useful for my studies. The image generation feature is particularly impressive.",
      date: "2025-05-12 15:40:12",
      topic_id: 30,
      sentiment_score: 0.7,
    },
    {
      id: 73177,
      app_id: "com.openai.chatgpt",
      name: "James Wilson",
      rating: 5,
      content:
        "Incredible app! It's like having a personal tutor available 24/7. The interface is intuitive.",
      date: "2025-05-11 12:30:45",
      topic_id: 14,
      sentiment_score: 0.85,
    },
    {
      id: 73178,
      app_id: "com.openai.chatgpt",
      name: "Anna Lee",
      rating: 3,
      content:
        "Good app overall, but the subscription price is a bit high for what it offers.",
      date: "2025-05-10 08:55:33",
      topic_id: 11,
      sentiment_score: -0.2,
    },
  ];

  // State for sorting, filtering, search, and pagination
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Review;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredTopicId, setHoveredTopicId] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const rowsPerPage = 50;

  // Helper function to get topic content by ID
  const getTopicContent = (topicId: number): string => {
    const topic = dummyTopics.find((t) => t.id === topicId);
    return topic ? topic.content : "Unknown Topic";
  };

  // Sorting function
  const sortedData = useMemo(() => {
    let sortableData = [...dummyData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [dummyData, sortConfig]);

  // Filtering and search function
  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.app_id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRating = ratingFilter === "" || item.rating === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [sortedData, searchTerm, ratingFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Sort handler
  const requestSort = (key: keyof Review) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key: keyof Review) => {
    if (sortConfig?.key !== key) {
      return <ChevronUp className="h-4 w-4 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Reviews Data</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <Input
                type="number"
                placeholder="Filter by rating"
                value={ratingFilter}
                onChange={(e) =>
                  setRatingFilter(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="w-32"
                min="1"
                max="5"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("id")}
                  >
                    <div className="flex items-center gap-1">
                      ID {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name {getSortIcon("name")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("rating")}
                  >
                    <div className="flex items-center gap-1">
                      Rating {getSortIcon("rating")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date {getSortIcon("date")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("sentiment_score")}
                  >
                    <div className="flex items-center gap-1">
                      Sentiment {getSortIcon("sentiment_score")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => requestSort("topic_id")}
                  >
                    <div className="flex items-center gap-1">
                      Topic ID {getSortIcon("topic_id")}
                    </div>
                  </TableHead>
                  <TableHead>Content</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((review) => (
                  <TableRow
                    key={review.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedReview(review)}
                  >
                    <TableCell className="font-medium">{review.id}</TableCell>
                    <TableCell>{review.name}</TableCell>
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
                      {new Date(review.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
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
                          className={`text-sm ${
                            review.sentiment_score >= 0
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {(review.sentiment_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="relative cursor-help bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                        onMouseEnter={() => setHoveredTopicId(review.topic_id)}
                        onMouseLeave={() => setHoveredTopicId(null)}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {review.topic_id}
                        {hoveredTopicId === review.topic_id && (
                          <div className="absolute z-50 bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg max-w-xs whitespace-normal">
                            <strong>Topic {review.topic_id}:</strong>
                            <br />
                            {getTopicContent(review.topic_id)}
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
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

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
              {filteredData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Detail Overlay */}
      {selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl border w-[600px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Review Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReview(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Review ID
                  </label>
                  <p className="text-base font-semibold">{selectedReview.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    App ID
                  </label>
                  <p className="text-base font-mono">{selectedReview.app_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Reviewer Name
                  </label>
                  <p className="text-base">{selectedReview.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold">
                      {selectedReview.rating}/5
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < selectedReview.rating
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
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Date
                  </label>
                  <p className="text-base">
                    {new Date(selectedReview.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Sentiment Score
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          selectedReview.sentiment_score >= 0
                            ? "bg-blue-600"
                            : "bg-red-600"
                        }`}
                        style={{
                          width: `${Math.abs(selectedReview.sentiment_score) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-sm font-semibold ${
                        selectedReview.sentiment_score >= 0
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {(selectedReview.sentiment_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Topic ID
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedReview.topic_id}
                    </span>
                    <span className="text-xs text-gray-600">
                      {getTopicContent(selectedReview.topic_id)}
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Review Content
                </label>
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedReview.content}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewMainDataTable;
