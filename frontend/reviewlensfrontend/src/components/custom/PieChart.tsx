import React from "react";
import type { ChartConfig } from "@/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart as RPieChart } from "recharts";

// Function to generate a random hex color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const PieChart = () => {
  const dummyData = [
    { rating: 1, count: 20, fill: getRandomColor() },
    { rating: 2, count: 20, fill: getRandomColor() },
    { rating: 3, count: 20, fill: getRandomColor() },
    { rating: 4, count: 20, fill: getRandomColor() },
    { rating: 5, count: 20, fill: getRandomColor() },
  ];

  const chartConfig = {
    1: { label: "1 Star" },
    2: { label: "2 Stars" },
    3: { label: "3 Stars" },
    4: { label: "4 Stars" },
    5: { label: "5 Stars" },
    count: { label: "Count" },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-64 w-full">
      <RPieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie data={dummyData} dataKey="count" nameKey="rating" label />
      </RPieChart>
    </ChartContainer>
  );
};

export default PieChart;
