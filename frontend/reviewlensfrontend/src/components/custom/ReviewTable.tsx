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

interface ReviewData {
  Reviewer: string;
  Review: string;
  Rating: number;
  Sentiment_Level: number;
}

const ReviewTable = () => {
  const dummyHeader = ["Reviewer", "Review", "Rating", "Sentiment Level"];

  const dummyData: ReviewData[] = [
    {
      Reviewer: "Mark",
      Review: "Hello, There, These, Are, Fake, Topics, To Display",
      Rating: 12,
      Sentiment_Level: 3,
    },
    {
      Reviewer: "Mark",
      Review: "Hello, There, These, Are, Fake, Topics, To Display",
      Rating: 12,
      Sentiment_Level: 3,
    },
    {
      Reviewer: "Mark",
      Review: "Hello, There, These, Are, Fake, Topics, To Display",
      Rating: 12,
      Sentiment_Level: 3,
    },
    {
      Reviewer: "Mark",
      Review: "Hello, There, These, Are, Fake, Topics, To Display",
      Rating: 12,
      Sentiment_Level: 3,
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {dummyHeader.map((item) => {
            return <TableHead>{item}</TableHead>;
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {dummyData.map((item) => {
          return (
            <TableRow>
              <TableCell className="text-left">{item.Reviewer}</TableCell>
              <TableCell className="text-center">{item.Review}</TableCell>
              <TableCell className="text-right">{item.Rating}</TableCell>
              <TableCell className="text-right">
                {item.Sentiment_Level}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ReviewTable;
