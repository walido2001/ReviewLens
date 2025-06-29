import { useState } from "react";
import Navbar from "./components/custom/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PieChart from "./components/custom/PieChart";
import TopicTable from "./components/custom/TopicTable";
import ReviewTable from "./components/custom/ReviewTable";
import SentimentDotChart from "./components/custom/SentimentDotChart";
import ReviewMainDataTable from "./components/custom/ReviewMainDataTable";
import TopicsMainDataTable from "./components/custom/TopicsMainDataTable";

function App() {
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
              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2">
                  <Card className="h-auto">
                    <CardHeader>
                      ``
                      <CardTitle>Sentiment Dot Spread</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <SentimentDotChart />
                    </CardContent>
                  </Card>
                </div>
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
    </>
  );
}

export default App;
