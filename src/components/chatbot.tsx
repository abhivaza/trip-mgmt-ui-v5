"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApi } from "@/context/api-provider";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { Loader2, Send, Trash2, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TRY_AGAIN_TEXT } from "@/lib/app-utils";
import ReactMarkdown from "react-markdown";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatInitType = "general" | "trip-specific" | "custom";

interface ChatbotSectionProps {
  chatInitType: ChatInitType;
  customInitMessage?: string;
}

export function ChatbotSection({
  chatInitType,
  customInitMessage = "",
}: ChatbotSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const api = useApi();
  const { toast } = useToast();
  const { trip_id } = useParams<{ trip_id: string }>();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const MAX_CHAR_COUNT = 280;

  // Sample questions based on chat type
  const sampleQuestions =
    chatInitType === "trip-specific"
      ? [
          "How is my day 2 looking?",
          "Can you please give me history of the city?",
        ]
      : [
          "Are there any historic attractions I visited?",
          "What kid friendly places I visited during my trips?",
        ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  const initializeChat = async () => {
    let initMessage = "";
    switch (chatInitType) {
      case "general":
        initMessage =
          "Hello! How can I assist you with your travel plans today?";
        break;
      case "trip-specific":
        initMessage = `Welcome! I'm here to help with your current trip. What would you like to know?`;
        break;
      case "custom":
        initMessage = customInitMessage;
        break;
    }

    const assistantMessage: Message = {
      role: "assistant",
      content: initMessage,
      timestamp: new Date(),
    };
    setMessages([assistantMessage]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await api.post<{ question: string }, { answer: string }>(
        chatInitType === "trip-specific"
          ? `/app/trip/${trip_id}/chat`
          : `/app/trips/chat`,
        {
          question: input,
        }
      );
      const assistantMessage: Message = {
        role: "assistant",
        content: response.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response." + " " + TRY_AGAIN_TEXT,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    initializeChat();
    toast({
      title: "Chat Cleared",
      description:
        "All messages have been removed and the chat has been reinitialized.",
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSampleQuestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
        <CardTitle>Trip Assistant</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={clearChat}
          aria-label="Clear chat"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <ScrollArea className="h-[300px]" ref={scrollAreaRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                } items-start max-w-[80%]`}
              >
                <Avatar className="w-8 h-8 mr-2">
                  <AvatarFallback>
                    {message.role === "user" ? <User /> : <Bot />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`flex flex-col ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center items-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3 p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <div className="flex-1 relative">
            <Input
              value={input}
              onChange={(e) =>
                setInput(e.target.value.slice(0, MAX_CHAR_COUNT))
              }
              placeholder="Ask a question about your trip..."
              disabled={isLoading}
              aria-label="Chat input"
              className="pr-12"
            />
            <span className="absolute right-2 bottom-2 text-xs text-muted-foreground">
              {input.length}/{MAX_CHAR_COUNT}
            </span>
          </div>
          <Button
            type="submit"
            disabled={isLoading || input.length === 0}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>

        {/* Sample questions section */}
        <div className="w-full">
          <p className="text-xs text-muted-foreground mb-1">
            Try asking (click to use):
          </p>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs py-1 h-auto"
                onClick={() => handleSampleQuestionClick(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
