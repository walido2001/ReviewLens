import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SentimentDotChart from "./SentimentDotChart";

const SentimentDotSpreadPane = () => {
  return (
    <Card className="h-auto">
      <CardHeader>
        <CardTitle>Sentiment Dot Spread</CardTitle>
      </CardHeader>
      <CardContent>
        <SentimentDotChart />
      </CardContent>
    </Card>
  );
};

export default SentimentDotSpreadPane;
