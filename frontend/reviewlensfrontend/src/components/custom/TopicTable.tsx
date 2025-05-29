import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TopicData {
  TopicID: number;
  Topics: string;
  AppID: number;
}

const TopicTable = () => {
  const dummyHeader = ["TopicID", "Topics", "AppID"];

  const dummyData: TopicData[] = [
    {
      TopicID: 0,
      Topics: "Hello, There, These, Are, Fake, Topics, To Display",
      AppID: 12,
    },
    {
      TopicID: 1,
      Topics: "Hello, There, These, Are, Fake, Topics, To Display",
      AppID: 12,
    },
    {
      TopicID: 2,
      Topics: "Hello, There, These, Are, Fake, Topics, To Display",
      AppID: 12,
    },
    {
      TopicID: 3,
      Topics: "Hello, There, These, Are, Fake, Topics, To Display",
      AppID: 12,
    },
    {
      TopicID: 4,
      Topics: "Hello, There, These, Are, Fake, Topics, To Display",
      AppID: 12,
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">TopicID</TableHead>
          <TableHead className="text-center">Topics</TableHead>
          <TableHead className="text-right">AppID</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummyData.map((item) => {
          return (
            <TableRow>
              <TableCell className="text-left">{item.TopicID}</TableCell>
              <TableCell className="text-center">{item.Topics}</TableCell>
              <TableCell className="text-right">{item.AppID}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TopicTable;
