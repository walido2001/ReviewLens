import React from "react";
import type { ChartConfig } from "@/components/ui/chart";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Pie, PieChart as RPieChart } from "recharts";
import { useGlobalContext } from "@/context/GlobalContext";

// Function to get color based on rating
const getRatingColor = (rating: number) => {
  const colors = {
    1: "#DC2626", // red-600 - Dark red for 1 star
    2: "#EF4444", // red-500 - Red for 2 stars
    3: "#F59E0B", // amber-500 - Yellow for 3 stars
    4: "#10B981", // emerald-500 - Light green for 4 stars
    5: "#059669", // emerald-600 - Green for 5 stars
  };
  return colors[rating as keyof typeof colors] || "#6B7280"; // gray-500 as fallback
};

const PieChart = () => {
  const { state } = useGlobalContext();

  // Transform the rating breakdown data for the chart
  const chartData = React.useMemo(() => {
    if (!state.ratingBreakdown) {
      return [];
    }

    return state.ratingBreakdown.map((item) => ({
      rating: parseInt(item.rating),
      count: parseInt(item.count),
      fill: getRatingColor(parseInt(item.rating)),
    }));
  }, [state.ratingBreakdown]);

  const chartConfig = {
    1: { label: "1 Star ⭐" },
    2: { label: "2 Stars ⭐⭐" },
    3: { label: "3 Stars ⭐⭐⭐" },
    4: { label: "4 Stars ⭐⭐⭐⭐" },
    5: { label: "5 Stars ⭐⭐⭐⭐⭐" },
    count: { label: "Number of Reviews" },
  } satisfies ChartConfig;

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { rating: number; count: number; fill: string };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const total = chartData.reduce((sum, item) => sum + item.count, 0);
      const percentage = ((data.count / total) * 100).toFixed(1);

      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.fill }}
            />
            <span className="font-semibold text-sm">
              {data.rating} {data.rating === 1 ? "Star" : "Stars"}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            <div>Reviews: {data.count}</div>
            <div>Percentage: {percentage}%</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer config={chartConfig} className="min-h-auto w-full">
      <RPieChart>
        <ChartTooltip content={<CustomTooltip />} />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="rating"
          label={({ rating, count }) => `${rating}★\n${count}`}
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
        />
      </RPieChart>
    </ChartContainer>
  );
};

export default PieChart;
