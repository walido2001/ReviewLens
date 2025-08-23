import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalContext } from "@/context/GlobalContext";

const SentimentAvgPane = () => {
  const { state } = useGlobalContext();

  const sentimentValue = state.sentimentAvg !== null ? state.sentimentAvg : 0;
  const sentimentLabel = sentimentValue >= 0 ? "Positive" : "Negative";
  const sentimentColor = sentimentValue >= 0 ? "text-blue-600" : "text-red-600";

  return (
    <Card className="h-48">
      <CardHeader>
        <CardTitle className="text-lg">Sentiment Avg</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="text-center">
          <div className={`text-3xl font-bold ${sentimentColor}`}>
            {sentimentValue.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {sentimentLabel}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentAvgPane;
