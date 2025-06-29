import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopicData {
  TopicID: number;
  Topics: string;
}

const TopicTable = () => {
  const dummyData: TopicData[] = [
    {
      TopicID: 5,
      Topics: "performance, crashes, bugs, slow, lag",
    },
    {
      TopicID: 8,
      Topics: "accuracy, wrong, incorrect, unreliable",
    },
    {
      TopicID: 11,
      Topics: "pricing, cost, subscription, expensive",
    },
    {
      TopicID: 12,
      Topics: "writing, essays, assignments, homework",
    },
    {
      TopicID: 14,
      Topics: "tutoring, learning, education, teaching",
    },
    {
      TopicID: 15,
      Topics: "helpful, useful, assistance, support",
    },
    {
      TopicID: 18,
      Topics: "generic, vague, specific, detailed",
    },
    {
      TopicID: 22,
      Topics: "voice, audio, conversation, speech",
    },
  ];

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
          {dummyData.map((item) => (
            <TableRow key={item.TopicID}>
              <TableCell className="font-medium">{item.TopicID}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.Topics.split(", ").map((keyword, index) => (
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
