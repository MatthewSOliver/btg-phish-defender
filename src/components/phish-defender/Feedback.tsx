import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck, TriangleAlert } from "lucide-react";

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
      <AlertDescription className="prose prose-sm dark:prose-invert">
        {feedbackText}
      </AlertDescription>
    </Alert>
  );
}
