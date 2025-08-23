import React, { useState, useMemo, useEffect, useRef } from "react";
import type { Review } from "@/dataTypes/reviewTypes";
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
import { Search, Filter, X, Loader2, ChevronDown } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";

const ReviewMainDataTable = () => {
  const { state, actions } = useGlobalContext();

  // State for filtering, search, and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "">("");
  const [hoveredReviewId, setHoveredReviewId] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false);
  const rowsPerPage = 30;
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to get topic content by ID
  const getTopicContent = (topicId: number): string => {
    const topic = state.topics.find((t) => t.id === topicId);
    return topic ? topic.content : "Unknown Topic";
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsRatingDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filtering and search function
  const filteredData = useMemo(() => {
    return state.reviews.filter((item) => {
      const matchesSearch =
        searchTerm === "" ||
        (item.name &&
          item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.content &&
          item.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.app_id &&
          item.app_id.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRating = ratingFilter === "" || item.rating === ratingFilter;

      return matchesSearch && matchesRating;
    });
  }, [state.reviews, searchTerm, ratingFilter]);

  // Pagination - use global state values
  const totalPages = state.reviewsTotalPages;
  const currentPage = state.reviewsPage;

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      actions.fetchReviews(newPage, rowsPerPage);
    }
  };

  // Rating filter options
  const ratingOptions = [
    { value: "", label: "All Ratings" },
    { value: 1, label: "1 Star" },
    { value: 2, label: "2 Stars" },
    { value: 3, label: "3 Stars" },
    { value: 4, label: "4 Stars" },
    { value: 5, label: "5 Stars" },
  ];

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
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="outline"
                  onClick={() => setIsRatingDropdownOpen(!isRatingDropdownOpen)}
                  className="w-32 justify-between"
                >
                  {ratingFilter === ""
                    ? "All Ratings"
                    : `${ratingFilter} Star${ratingFilter === 1 ? "" : "s"}`}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {isRatingDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white border rounded-md shadow-lg z-10">
                    {ratingOptions.map((option) => (
                      <button
                        key={option.value}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        onClick={() => {
                          setRatingFilter(option.value as number | "");
                          setIsRatingDropdownOpen(false);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {state.isLoadingReviews ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
              <span className="text-blue-600">Loading reviews...</span>
            </div>
          ) : state.reviews.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-gray-500">
                No reviews found. Please select an app first.
              </span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Topic ID</TableHead>
                    <TableHead>Content</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((review) => (
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
                        {review.topic_id ? (
                          <div
                            className={`relative cursor-help px-2 py-1 rounded text-xs font-medium transition-colors ${
                              hoveredReviewId === review.id
                                ? "bg-blue-200 text-blue-900"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            }`}
                            onMouseEnter={() => setHoveredReviewId(review.id)}
                            onMouseLeave={() => setHoveredReviewId(null)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {review.topic_id}
                            {hoveredReviewId === review.id && (
                              <div className="absolute z-50 bottom-full left-0 mb-2 p-2 bg-gray-900 text-white text-xs rounded shadow-lg max-w-xs whitespace-normal">
                                <strong>Topic {review.topic_id}:</strong>
                                <br />
                                {getTopicContent(review.topic_id)}
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            No topic
                          </span>
                        )}
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
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(currentPage * rowsPerPage, state.reviewsTotal)} of{" "}
              {state.reviewsTotal} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
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
                onClick={() => handlePageChange(currentPage + 1)}
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
