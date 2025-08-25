import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, TriangleAlert } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface FeedbackProps {
  isCorrect: boolean;
  feedbackText: string;
}

export function Feedback({ isCorrect, feedbackText }: FeedbackProps) {
  return (
    <Alert variant={isCorrect ? "default" : "destructive"} className={`mt-4 animate-in fade-in duration-500 ${isCorrect ? 'bg-secondary border-primary/50' : ''}`}>
      {isCorrect ? (
        <ShieldCheck className="h-4 w-4 !text-primary" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      <AlertTitle className={isCorrect ? '!text-primary' : ''}>{isCorrect ? "Correct!" : "Incorrect"}</AlertTitle>
      <AlertDescription asChild>
        <ReactMarkdown 
          className="prose prose-sm dark:prose-invert"
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline ? (
                <code className={className} {...props}>
                  {children}
                </code>
              ) : (
                <code className="font-code bg-muted text-muted-foreground rounded-sm px-1 py-0.5" {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {feedbackText}
        </ReactMarkdown>
      </AlertDescription>
    </Alert>
  );
}
