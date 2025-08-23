import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { API_CONFIG, ENDPOINTS } from "@/config/api";

interface ProcessingStage {
  stage: string;
  status: "started" | "completed" | "failed" | "pending";
  error?: string;
}

interface ProcessingScreenProps {
  appId: string;
  onComplete: () => void;
  onError: (error: string) => void;
}

const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  appId,
  onComplete,
  onError,
}) => {
  const [stages, setStages] = useState<ProcessingStage[]>([]);
  const [currentStage, setCurrentStage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  const stageNames = {
    validation: "Validating App ID",
    review_extraction: "Extracting Reviews",
    sentiment_analysis: "Analyzing Sentiment",
    topic_extraction: "Extracting Topics",
    topic_linkage: "Linking Topics to Reviews",
  };

  const getStageIcon = (stage: ProcessingStage) => {
    switch (stage.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "started":
        return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStageStatus = (stage: ProcessingStage) => {
    switch (stage.status) {
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      case "started":
        return "text-blue-600";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    let abortController: AbortController | null = null;

    const startProcessing = async () => {
      try {
        abortController = new AbortController();

        const response = await fetch(
          `${API_CONFIG.baseURL}${ENDPOINTS.processApp}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ appID: appId }),
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6)); // Remove 'data: ' prefix

                if (data.status === "heartbeat") {
                  continue; // Ignore heartbeat messages
                }

                if (data.stage === "all") {
                  if (data.status === "completed") {
                    setIsProcessing(false);
                    onComplete();
                  } else if (data.status === "failed") {
                    setIsProcessing(false);
                    onError(data.error || "Processing failed");
                  }
                  return;
                }

                // Update stages
                setStages((prev) => {
                  const existingIndex = prev.findIndex(
                    (s) => s.stage === data.stage
                  );
                  if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = data;
                    return updated;
                  } else {
                    return [...prev, data];
                  }
                });

                if (data.status === "started") {
                  setCurrentStage(data.stage);
                }
              } catch (error) {
                console.error("Error parsing SSE data:", error);
              }
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Processing was aborted");
          return;
        }
        console.error("Error during processing:", error);
        onError("Connection lost during processing");
      }
    };

    startProcessing();

    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [appId, onComplete, onError]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center">Processing App: {appId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stageNames).map(([key, name]) => {
              const stage = stages.find((s) => s.stage === key);
              const isCurrent = currentStage === key;
              const isCompleted = stage?.status === "completed";
              const isFailed = stage?.status === "failed";
              const isStarted = stage?.status === "started";

              return (
                <div
                  key={key}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    isCurrent
                      ? "bg-blue-50 border-blue-200"
                      : isCompleted
                        ? "bg-green-50 border-green-200"
                        : isFailed
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {getStageIcon(stage || { stage: key, status: "pending" })}
                  <div className="flex-1">
                    <div
                      className={`font-medium ${getStageStatus(
                        stage || { stage: key, status: "pending" }
                      )}`}
                    >
                      {name}
                    </div>
                    {stage?.error && (
                      <div className="text-sm text-red-600 mt-1">
                        Error: {stage.error}
                      </div>
                    )}
                  </div>
                  {isStarted && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </div>
              );
            })}
          </div>

          {isProcessing && (
            <div className="mt-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600">
                Processing in progress... This may take several minutes.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProcessingScreen;
