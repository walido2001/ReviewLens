import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGlobalContext } from "@/context/GlobalContext";

const RatingAvgPane = () => {
  const { state } = useGlobalContext();

  const ratingValue = state.ratingAvg !== null ? state.ratingAvg : 0;

  return (
    <Card className="h-48">
      <CardHeader>
        <CardTitle className="text-lg">Rating Avg</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-600">
            {ratingValue.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Out of 5</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RatingAvgPane;
