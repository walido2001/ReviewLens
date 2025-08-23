import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalContext } from "@/context/GlobalContext";
import type { Topic } from "@/dataTypes/reviewTypes";

const TopicTable = () => {
  const { state } = useGlobalContext();

  return (
    <div className="overflow-auto max-h-64">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Topic ID</TableHead>
            <TableHead className="text-left">Topic Keywords</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {state.topics.map((topic: Topic) => (
            <TableRow key={topic.id}>
              <TableCell className="font-medium">{topic.id}</TableCell>
              <TableCell>
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
  );
};

export default TopicTable;
