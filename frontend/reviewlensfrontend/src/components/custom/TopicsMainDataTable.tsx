import React from "react";
import type { Topic } from "@/dataTypes/reviewTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useGlobalContext } from "@/context/GlobalContext";

const TopicsMainDataTable = () => {
  const { state } = useGlobalContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Topics Data</CardTitle>
      </CardHeader>
      <CardContent>
        {state.isLoadingTopics ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-2" />
            <span className="text-blue-600">Loading topics...</span>
          </div>
        ) : state.topics.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <span className="text-gray-500">
              No topics found. Please select an app first.
            </span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic ID</TableHead>
                  <TableHead>App ID</TableHead>
                  <TableHead>Topic Keywords</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.topics.map((topic: Topic) => (
                  <TableRow key={topic.id}>
                    <TableCell className="font-medium">{topic.id}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {topic.app_id}
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="flex flex-wrap gap-1">
                        {topic.content
                          .split(", ")
                          .map((keyword: string, index: number) => (
                            <span
                              key={index}
                              className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {keyword}
                            </span>
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicsMainDataTable;
