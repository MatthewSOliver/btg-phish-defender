"use client";

import { useState } from 'react';
import type { Email, UserClassification } from '@/types/phish-defender';
import { provideFeedback } from '@/ai/flows/provide-feedback';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Feedback } from './Feedback';
import { Shield, TriangleAlert, User, Mail } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from './LoadingSpinner';
import ReactMarkdown from 'react-markdown';

interface EmailCardProps {
  email: Email;
  onMark: (email: Email, userClassification: UserClassification, isCorrect: boolean) => void;
}

export function EmailCard({ email, onMark }: EmailCardProps) {
  const [classification, setClassification] = useState<UserClassification | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean, feedback: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleMark = async (userClassification: UserClassification) => {
    if (isProcessing || classification) return;

    setIsProcessing(true);
    setClassification(userClassification);

    try {
      const result = await provideFeedback({ email, userClassification });
      setFeedback(result);
      onMark(email, userClassification, result.isCorrect);
    } catch (error) {
      console.error("Error providing feedback:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get feedback from AI. Please try again.",
      });
      setClassification(null); // Reset if feedback fails
    } finally {
      setIsProcessing(false);
    }
  };

  const isMarked = !!classification;

  return (
    <Card className={`transition-all duration-300 ${isMarked ? 'opacity-70' : 'hover:shadow-lg'}`}>
      <CardHeader>
        <CardTitle className="flex items-start gap-3 text-xl">
          <Mail className="h-5 w-5 mt-1 shrink-0 text-muted-foreground" />
          <span>{email.subject}</span>
        </CardTitle>
        <div className="flex items-center gap-3 text-sm text-muted-foreground pl-8">
            <User className="h-4 w-4 shrink-0" />
            <span>From: {email.sender}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm whitespace-pre-wrap font-code bg-secondary/50 p-4 rounded-md">
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
            {email.body}
          </ReactMarkdown>
        </div>
        {feedback && (
          <Feedback isCorrect={feedback.isCorrect} feedbackText={feedback.feedback} />
        )}
      </CardContent>
      {!isMarked && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => handleMark('Safe')} disabled={isProcessing}>
             {isProcessing && classification === 'Safe' ? <LoadingSpinner className="mr-2" /> : <Shield className="mr-2 h-4 w-4" />}
            Mark as Safe
          </Button>
          <Button className="bg-destructive/80 hover:bg-destructive text-destructive-foreground" onClick={() => handleMark('Phishing')} disabled={isProcessing}>
            {isProcessing && classification === 'Phishing' ? <LoadingSpinner className="mr-2" /> : <TriangleAlert className="mr-2 h-4 w-4" />}
            Mark as Phishing
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
