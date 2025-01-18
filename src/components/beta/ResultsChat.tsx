"use client";
import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "answerwriting/components/ui/card";
import { Button } from "answerwriting/components/ui/button";
import { Send } from "lucide-react";
import { Message } from "answerwriting/types";
import { AlertCircle, Check, Star } from "lucide-react";
import { EvaluationResponse } from "answerwriting/types";

interface ResultsChatProps {
  initialResponse?: EvaluationResponse;
  loading?: boolean;
}

export default function ResultsChat({
  initialResponse,
  loading,
}: ResultsChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialResponse) {
      const formattedMessages: Message[] = [];

      // Score message
      formattedMessages.push({
        id: "score",
        content: `Score: ${initialResponse.score} / 15`,
        timestamp: new Date(),
        isUser: false,
        type: "score",
      });

      // Good parts
      if (initialResponse.goodParts?.length) {
        formattedMessages.push({
          id: "good-parts",
          content: "Good Points:",
          timestamp: new Date(),
          isUser: false,
          type: "good-parts-header",
        });

        initialResponse.goodParts.forEach((part, index) => {
          formattedMessages.push({
            id: `good-part-${index}`,
            content: `${part.goodPart}${part.appreciation ? ` - ${part.appreciation}` : ""}`,
            timestamp: new Date(),
            isUser: false,
            type: "good-part",
          });
        });
      }

      // Mistakes and corrections
      if (initialResponse.mistakesAndCorrections?.length) {
        formattedMessages.push({
          id: "mistakes",
          content: "Areas for Improvement:",
          timestamp: new Date(),
          isUser: false,
          type: "mistakes-header",
        });

        initialResponse.mistakesAndCorrections.forEach((mistake, index) => {
          formattedMessages.push({
            id: `mistake-${index}`,
            content: `Mistake: ${mistake.mistake}\nCorrection: ${mistake.correction}`,
            timestamp: new Date(),
            isUser: false,
            type: "mistake",
          });
        });
      }

      // // Model answer
      // formattedMessages.push({
      //   id: 'model-answer',
      //   content: `Model Answer:\n${initialResponse.modelAnswer}`,
      //   timestamp: new Date(),
      //   isUser: false,
      //   type: 'model-answer'
      // });

      setMessages(formattedMessages);
    }
  }, [initialResponse]);

  console.log("initialResponse=======", initialResponse);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: newMessage,
        timestamp: new Date(),
        isUser: true,
        type: "",
      },
    ]);
    setNewMessage("");
  };

  const renderMessage = (message: Message) => {
    if (message.isUser) {
      return (
        <div className="max-w-[80%] p-3 rounded-lg bg-blue-500 text-white">
          <p>{message.content}</p>
          <span className="text-xs opacity-75">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      );
    }

    switch (message.type) {
      case "score":
        return (
          <div className="max-w-[80%] p-3 rounded-lg bg-green-100 text-green-800 flex items-center gap-2">
            <Star className="w-5 h-5" />
            <p className="text-lg font-semibold">{message.content}</p>
          </div>
        );
      case "good-parts-header":
        return (
          <div className="max-w-[80%] p-3 rounded-lg bg-blue-100 text-blue-800 font-semibold">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              <p>{message.content}</p>
            </div>
          </div>
        );
      case "good-part":
        return (
          <div className="max-w-[80%] p-3 rounded-lg bg-blue-50 text-blue-800 ml-4">
            <p>{message.content}</p>
          </div>
        );
      case "mistakes-header":
        return (
          <div className="max-w-[80%] p-3 rounded-lg bg-orange-100 text-orange-800 font-semibold">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <p>{message.content}</p>
            </div>
          </div>
        );
      case "mistake":
        return (
          <div className="max-w-[80%] p-3 rounded-lg bg-orange-50 text-orange-800 ml-4 space-y-2">
            {message.content.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        );
        // case 'model-answer':
        return (
          <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
            <p className="font-semibold mb-2">Model Answer:</p>
            <p className="whitespace-pre-wrap">
              {message.content.split("\n")[1]}
            </p>
          </div>
        );
      default:
        return (
          <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-900">
            <p>{message.content}</p>
            <span className="text-xs opacity-75">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl h-[600px] overflow-scroll flex flex-col">
      <CardHeader>
        <CardTitle>Evaluation Results</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                {renderMessage(message)}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 mt-auto">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md resize-none"
            rows={2}
            disabled={loading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || loading}
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
