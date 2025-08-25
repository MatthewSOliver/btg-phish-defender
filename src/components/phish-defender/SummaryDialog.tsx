
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { UserAnswer } from "@/types/phish-defender";
import { summarizePerformance } from "@/ai/flows/summarize-performance";
import { LoadingSpinner } from "./LoadingSpinner";
import ReactMarkdown from "react-markdown";

interface SummaryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  gameHistory: UserAnswer[];
}

export function SummaryDialog({ isOpen, onOpenChange, gameHistory }: SummaryDialogProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && gameHistory.length > 0 && !summary) {
      const generateSummary = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await summarizePerformance(gameHistory);
          setSummary(result.summary);
        } catch (err) {
          console.error("Failed to generate summary:", err);
          setError("Sorry, we couldn't generate your performance summary. Please try again.");
        } finally {
          setIsLoading(false);
        }
      };
      generateSummary();
    }
    // Reset summary when dialog is closed
    if (!isOpen) {
        setSummary(null);
    }
  }, [isOpen, gameHistory, summary]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Your Performance Summary</DialogTitle>
          <DialogDescription>
            Here's an AI-powered analysis of your performance in the game.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <LoadingSpinner className="h-8 w-8 text-primary" />
              <p className="text-muted-foreground">Analyzing your performance...</p>
            </div>
          )}
          {error && (
            <div className="text-center text-destructive-foreground bg-destructive/80 p-4 rounded-md">
                {error}
            </div>
          )}
          {summary && (
             <ReactMarkdown 
                className="prose prose-sm dark:prose-invert max-w-none"
                components={{
                    code({node, inline, className, children, ...props}) {
                    return (
                        <code className="font-code bg-muted text-muted-foreground rounded-sm px-1 py-0.5" {...props}>
                        {children}
                        </code>
                    )
                    }
                }}
            >
                {summary}
            </ReactMarkdown>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
