import Navbar from "./components/custom/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieChart from "./components/custom/PieChart";
import TopicTable from "./components/custom/TopicTable";
import ReviewTable from "./components/custom/ReviewTable";
import ReviewMainDataTable from "./components/custom/ReviewMainDataTable";
import TopicsMainDataTable from "./components/custom/TopicsMainDataTable";
import SentimentAvgPane from "./components/custom/SentimentAvgPane";
import RatingAvgPane from "./components/custom/RatingAvgPane";
import LatestReviewPane from "./components/custom/LatestReviewPane";
import SentimentDotSpreadPane from "./components/custom/SentimentDotSpreadPane";
import { GlobalProvider, useGlobalContext } from "./context/GlobalContext";
import ErrorNotification from "./components/custom/ErrorNotification";
import { AppWindow, Loader2 } from "lucide-react";

function AppContent() {
  const { state, actions } = useGlobalContext();

  // Show message when no app is selected
  if (!state.currentApp) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="mb-4">
              <AppWindow className="h-16 w-16 text-gray-400 mx-auto" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              No App Selected
            </h2>
            <p className="text-gray-600 mb-6">
              Please select an app from the dropdown in the navbar to view its
              data.
            </p>
            {state.isLoadingApps && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600 mr-2" />
                <span className="text-blue-600">Loading apps...</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Notification */}
        <ErrorNotification error={state.error} onClose={actions.clearError} />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="p-7">
        <div className="">
          <Tabs
            defaultValue="Overview"
            className="grid grid-cols-2 justify-items-center gap-y-6"
          >
            <TabsList className="col-span-2 w-1/3">
              <TabsTrigger value="Overview">Overview</TabsTrigger>
              <TabsTrigger value="Reviews">Reviews</TabsTrigger>
              <TabsTrigger value="Topics">Topics</TabsTrigger>
              <TabsTrigger value="Chatbot" disabled>
                Chatbot
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Topics" className="col-span-2 w-9/10">
              <TopicsMainDataTable />
            </TabsContent>

            <TabsContent value="Reviews" className="col-span-2 w-9/10">
              <ReviewMainDataTable />
            </TabsContent>

            <TabsContent value="Overview" className="col-span-2 w-9/10">
              <div className="grid grid-cols-3 gap-8">
                {/* Left side - sentiment dot spread */}
                <div className="col-span-2">
                  <SentimentDotSpreadPane />
                </div>

                {/* Right side - 3 panes */}
                <div className="col-span-1 space-y-6">
                  {/* Top row - 2 square panes side by side */}
                  <div className="grid grid-cols-2 gap-4">
                    <SentimentAvgPane />
                    <RatingAvgPane />
                  </div>

                  {/* Bottom - long pane for latest review */}
                  <LatestReviewPane />
                </div>
              </div>

              {/* Bottom section - original charts and tables */}
              <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                  <Card className="h-96">
                    <CardHeader>
                      <CardTitle>Rating Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieChart />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card className="h-96">
                    <CardHeader>
                      <CardTitle>Topics List</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TopicTable />
                    </CardContent>
                  </Card>
                </div>
                <div className="col-span-2">
                  <Card className="h-96">
                    <CardHeader>
                      <CardTitle>Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ReviewTable />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Error Notification */}
      <ErrorNotification error={state.error} onClose={actions.clearError} />
    </>
  );
}

function App() {
  return (
    <GlobalProvider>
      <AppContent />
    </GlobalProvider>
  );
}

export default App;
