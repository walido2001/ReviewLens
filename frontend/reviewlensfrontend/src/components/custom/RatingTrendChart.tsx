import React, { useState, useEffect } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";
import { apiService } from "@/services/api";

interface TrendDataPoint {
  date: string;
  avg_rating: number;
  review_count: number;
}

interface TrendStatistics {
  change: string;
  percentageChange: string;
  direction: "up" | "down" | "stable";
}

interface RatingTrendResponse {
  app_id: string;
  period: string;
  trend_data: TrendDataPoint[];
  trend_statistics: TrendStatistics;
}

const RatingTrendChart = () => {
  const { state } = useGlobalContext();
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [error, setError] = useState<string | null>(null);

  // Fetch trend data when app or period changes
  useEffect(() => {
    const fetchTrendData = async () => {
      if (!state.currentApp) {
        setTrendData([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response: RatingTrendResponse = await apiService.fetchRatingTrend(
          state.currentApp.id,
          period
        );
        setTrendData(response.trend_data);
        setTrendStats(response.trend_statistics);
      } catch (err) {
        setError("Failed to fetch rating trend data");
        console.error("Error fetching rating trend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [state.currentApp, period]);

  const [trendStats, setTrendStats] = useState<TrendStatistics | null>(null);

  // Format data for chart
  const chartData = trendData.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString(),
    formattedRating: item.avg_rating.toFixed(1),
  }));

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { formattedRating: string; review_count: number };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="font-semibold text-sm mb-1">{label}</div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              Average Rating:{" "}
              <span className="font-medium">{data.formattedRating}/5</span>
            </div>
            <div>
              Reviews: <span className="font-medium">{data.review_count}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!state.currentApp) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle>Rating Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <span className="text-gray-500">
            Select an app to view rating trends
          </span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rating Trend</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={period === "daily" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("daily")}
            >
              Daily
            </Button>
            <Button
              variant={period === "weekly" ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod("weekly")}
            >
              Weekly
            </Button>
          </div>
        </div>
        {trendStats && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Trend:</span>
            <div className="flex items-center gap-1">
              {trendStats.direction === "up" && (
                <TrendingUp className="h-4 w-4 text-green-600" />
              )}
              {trendStats.direction === "down" && (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              {trendStats.direction === "stable" && (
                <Minus className="h-4 w-4 text-gray-600" />
              )}
              <span
                className={`font-medium ${
                  trendStats.direction === "up"
                    ? "text-green-600"
                    : trendStats.direction === "down"
                      ? "text-red-600"
                      : "text-gray-600"
                }`}
              >
                {trendStats.change} ({trendStats.percentageChange}%)
              </span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
            <span className="text-blue-600">Loading trend data...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-red-600">{error}</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-500">No trend data available</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 5]} tickCount={6} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="avg_rating"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingTrendChart;
