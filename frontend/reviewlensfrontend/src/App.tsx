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
              <TabsTrigger value="Reviews" disabled>
                Reviews
              </TabsTrigger>
              <TabsTrigger value="Topics" disabled>
                Topics
              </TabsTrigger>
              <TabsTrigger value="Chatbot" disabled>
                Chatbot
              </TabsTrigger>
            </TabsList>
            <TabsContent value="Overview" className="col-span-2">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Box 1</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieChart />
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Box 2</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Graph is here</p>
                    </CardContent>
                  </Card>
                </div>
                <div>Box 3</div>
                <div>Box 4</div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default App;
