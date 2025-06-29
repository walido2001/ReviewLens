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

const TopicsMainDataTable = () => {
  // Dummy topic data following the Topic interface
  const dummyTopics: Topic[] = [
    {
      id: 5,
      app_id: "com.openai.chatgpt",
      content: "performance, crashes, bugs, slow, lag",
    },
    {
      id: 8,
      app_id: "com.openai.chatgpt",
      content: "accuracy, wrong, incorrect, unreliable",
    },
    {
      id: 11,
      app_id: "com.openai.chatgpt",
      content: "pricing, cost, subscription, expensive",
    },
    {
      id: 12,
      app_id: "com.openai.chatgpt",
      content: "writing, essays, assignments, homework",
    },
    {
      id: 14,
      app_id: "com.openai.chatgpt",
      content: "tutoring, learning, education, teaching",
    },
    {
      id: 15,
      app_id: "com.openai.chatgpt",
      content: "helpful, useful, assistance, support",
    },
    {
      id: 18,
      app_id: "com.openai.chatgpt",
      content: "generic, vague, specific, detailed",
    },
    {
      id: 22,
      app_id: "com.openai.chatgpt",
      content: "voice, audio, conversation, speech",
    },
    {
      id: 25,
      app_id: "com.openai.chatgpt",
      content: "features, video, images, generation",
    },
    {
      id: 30,
      app_id: "com.openai.chatgpt",
      content: "image, generation, create, visual",
    },
    {
      id: 35,
      app_id: "com.openai.chatgpt",
      content: "interface, ui, design, user experience",
    },
    {
      id: 40,
      app_id: "com.openai.chatgpt",
      content: "speed, fast, quick, response time",
    },
    {
      id: 45,
      app_id: "com.openai.chatgpt",
      content: "privacy, security, data, personal",
    },
    {
      id: 50,
      app_id: "com.openai.chatgpt",
      content: "language, translation, multilingual",
    },
    {
      id: 55,
      app_id: "com.openai.chatgpt",
      content: "coding, programming, development",
    },
    {
      id: 60,
      app_id: "com.openai.chatgpt",
      content: "creative, art, design, inspiration",
    },
    {
      id: 65,
      app_id: "com.openai.chatgpt",
      content: "business, professional, work, productivity",
    },
    {
      id: 70,
      app_id: "com.openai.chatgpt",
      content: "entertainment, fun, games, leisure",
    },
    {
      id: 75,
      app_id: "com.openai.chatgpt",
      content: "health, medical, fitness, wellness",
    },
    {
      id: 80,
      app_id: "com.openai.chatgpt",
      content: "travel, tourism, vacation, planning",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Topics Data</CardTitle>
      </CardHeader>
      <CardContent>
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
              {dummyTopics.map((topic) => (
                <TableRow key={topic.id}>
                  <TableCell className="font-medium">{topic.id}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {topic.app_id}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex flex-wrap gap-1">
                      {topic.content.split(", ").map((keyword, index) => (
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
      </CardContent>
    </Card>
  );
};

export default TopicsMainDataTable;
