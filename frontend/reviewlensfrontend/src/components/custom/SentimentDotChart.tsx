import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface SentimentSpreadFormat {
  id: number;
  name: string;
  rating: number;
  sentiment_score?: number;
  date: string;
}

const SentimentDotChart = () => {
  const dummyData = [
    {
      id: 49971,
      name: "M. G.",
      rating: 4,
      sentiment_score: 0.9,
      date: "2025-04-29",
    },
    {
      id: 49975,
      name: "R. W.",
      rating: 5,
      sentiment_score: 0.7,
      date: "2025-05-01",
    },
    {
      id: 49980,
      name: "P. E.",
      rating: 5,
      sentiment_score: 1,
      date: "2025-05-03",
    },
    {
      id: 49977,
      name: "S. A. Y.",
      rating: 5,
      sentiment_score: 0,
      date: "2025-05-04",
    },
    {
      id: 49981,
      name: "R. A.",
      rating: 5,
      sentiment_score: 0.2,
      date: "2025-05-06",
    },
    {
      id: 49974,
      name: "K. K.",
      rating: 5,
      sentiment_score: 1,
      date: "2025-05-07",
    },
    {
      id: 49979,
      name: "R. A.",
      rating: 5,
      sentiment_score: 0.6,
      date: "2025-05-08",
    },
    {
      id: 49969,
      name: "M. R.",
      rating: 1,
      sentiment_score: 0.7,
      date: "2025-05-10",
    },
    {
      id: 49973,
      name: "S. C.",
      rating: 1,
      sentiment_score: 0.2,
      date: "2025-05-11",
    },
    {
      id: 49982,
      name: "H. S.",
      rating: 5,
      sentiment_score: 1,
      date: "2025-05-13",
    },
    {
      id: 49970,
      name: "P. G.",
      rating: 5,
      sentiment_score: 0.2,
      date: "2025-05-15",
    },
    {
      id: 49978,
      name: "C. N.",
      rating: 5,
      sentiment_score: 0,
      date: "2025-05-17",
    },
    {
      id: 49972,
      name: "H. H.",
      rating: 5,
      sentiment_score: 0,
      date: "2025-05-19",
    },
    {
      id: 49968,
      name: "T. J.",
      rating: 5,
      sentiment_score: 0,
      date: "2025-05-21",
    },
    {
      id: 49976,
      name: "A. P. J. O.",
      rating: 5,
      sentiment_score: 1,
      date: "2025-05-23",
    },
    {
      id: 49967,
      name: "J. A.",
      rating: 5,
      sentiment_score: 1,
      date: "2025-05-24",
    },
  ] satisfies SentimentSpreadFormat[];

  return (
    <>
      <ResponsiveContainer width="80%" height={450}>
        <ScatterChart>
          {/* <CartesianGrid /> */}
          <XAxis
            type="category"
            dataKey="date"
            name="Date"
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            allowDuplicatedCategory={false}
          />
          <YAxis
            type="number"
            dataKey="rating"
            name="Rating"
            domain={[0, 5]}
            tickCount={6}
          />
          <Legend />
          <Scatter name="Rating Score" data={dummyData} fill="#8884d8" />
          <Scatter
            name="Sentiment Score"
            data={dummyData.map((row) => ({
              ...row,
              rating: ((row.sentiment_score + 1) / 2) * 5,
            }))}
            fill="#82ca9d"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
};

export default SentimentDotChart;
