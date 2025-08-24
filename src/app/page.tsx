"use client";

import { useState, useEffect } from 'react';
import type { Email } from '@/types/phish-defender';
import { generateEmails } from '@/ai/flows/generate-emails';
import { Scoreboard } from '@/components/phish-defender/Scoreboard';
import { EmailCard } from '@/components/phish-defender/EmailCard';
import { LoadingSpinner } from '@/components/phish-defender/LoadingSpinner';
import { PhishDefenderLogo } from '@/components/phish-defender/PhishDefenderLogo';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"
import { RefreshCw } from 'lucide-react';

const NUMBER_OF_EMAILS = 5;

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [score, setScore] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [gameKey, setGameKey] = useState(Date.now());
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      setScore(0);
      setProcessedCount(0);
      setEmails([]);
      try {
        const generatedEmails = await generateEmails({ numberOfEmails: NUMBER_OF_EMAILS });
        const emailsWithIds = generatedEmails.map((email, index) => ({
          ...email,
          id: `email-${gameKey}-${index}`,
        }));
        setEmails(emailsWithIds);
      } catch (error) {
        console.error("Failed to generate emails:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate emails. Please try again.",
        })
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmails();
  }, [gameKey, toast]);

  const handleMarkEmail = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setProcessedCount(prev => prev + 1);
  };

  const restartGame = () => {
    setGameKey(Date.now());
  };

  const allEmailsProcessed = processedCount === emails.length && emails.length > 0;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <PhishDefenderLogo />
          <Button onClick={restartGame} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Game
          </Button>
        </header>

        <Scoreboard score={score} total={emails.length} processed={processedCount} />
        
        {allEmailsProcessed && !isLoading && (
          <div className="text-center p-8 bg-card rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-2">Congratulations!</h2>
            <p className="text-muted-foreground mb-4">You've reviewed all the emails. Your final score is {score} out of {emails.length}.</p>
            <Button onClick={restartGame}>Play Again</Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <LoadingSpinner className="h-12 w-12 text-primary" />
            <p className="ml-4 text-lg text-muted-foreground mt-4">Generating your emails...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {emails.map((email) => (
              <EmailCard key={email.id} email={email} onMark={handleMarkEmail} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
