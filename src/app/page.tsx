
"use client";

import { useState, useEffect } from 'react';
import type { Email } from '@/types/phish-defender';
import { generateEmails } from '@/ai/flows/generate-emails';
import { Scoreboard } from '@/components/phish-defender/Scoreboard';
import { EmailCard } from '@/components/phish-defender/EmailCard';
import { LoadingSpinner } from '@/components/phish-defender/LoadingSpinner';
import { PhishDefenderLogo } from '@/components/phish-defender/PhishDefenderLogo';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ArrowRight } from 'lucide-react';
import { GameSettings } from '@/components/phish-defender/GameSettings';
import type { GameConfig } from '@/types/phish-defender';

type GameState = 'settings' | 'loading' | 'playing' | 'round-finished' | 'game-finished';

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [score, setScore] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('settings');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [currentRound, setCurrentRound] = useState(1);
  const { toast } = useToast();

  const startNewGame = (config: GameConfig) => {
    setGameConfig(config);
    setScore(0);
    setCurrentRound(1);
    setGameState('loading');
  };

  const startNewRound = () => {
    setProcessedCount(0);
    setEmails([]);
    setGameState('loading');
  };

  const nextRound = () => {
    if (gameConfig && currentRound < gameConfig.numberOfRounds) {
      setCurrentRound(prev => prev + 1);
      startNewRound();
    } else {
      setGameState('game-finished');
    }
  };

  const restartGame = () => {
    setGameState('settings');
    setGameConfig(null);
  };

  useEffect(() => {
    const fetchEmails = async () => {
      if (gameState !== 'loading' || !gameConfig) return;
      
      try {
        const generatedEmails = await generateEmails({ numberOfEmails: gameConfig.numberOfEmails });
        const emailsWithIds = generatedEmails.map((email, index) => ({
          ...email,
          id: `email-${Date.now()}-${index}`,
        }));
        setEmails(emailsWithIds);
        setGameState('playing');
      } catch (error) {
        console.error("Failed to generate emails:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate emails. Please try again.",
        });
        setGameState('settings');
      }
    };
    
    fetchEmails();
  }, [gameState, gameConfig, toast]);

  const handleMarkEmail = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setProcessedCount(prev => prev + 1);
  };
  
  const allEmailsProcessed = processedCount === emails.length && emails.length > 0;

  const totalEmailsInGame = (gameConfig?.numberOfEmails ?? 0) * (gameConfig?.numberOfRounds ?? 0);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <PhishDefenderLogo />
          {(gameState !== 'settings' && gameState !== 'loading') && (
            <Button onClick={restartGame} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              New Game
            </Button>
          )}
        </header>

        {gameState === 'settings' && <GameSettings onStartGame={startNewGame} />}
        
        {gameState === 'loading' && (
          <div className="flex flex-col justify-center items-center py-20">
            <LoadingSpinner className="h-12 w-12 text-primary" />
            <p className="ml-4 text-lg text-muted-foreground mt-4">
              {`Loading Round ${currentRound} of ${gameConfig?.numberOfRounds}...`}
            </p>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'round-finished' || gameState === 'game-finished') && gameConfig && (
          <>
            <Scoreboard 
              score={score} 
              total={totalEmailsInGame}
              processed={processedCount + (currentRound - 1) * gameConfig.numberOfEmails}
              round={currentRound}
              totalRounds={gameConfig.numberOfRounds}
            />
            
            {(gameState === 'round-finished' || gameState === 'game-finished') && (
              <div className="text-center p-8 bg-card rounded-lg shadow-lg animate-in fade-in duration-500">
                <h2 className="text-2xl font-bold text-primary mb-2">
                  {gameState === 'game-finished' ? "Congratulations!" : `Round ${currentRound} Complete!`}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {gameState === 'game-finished' 
                    ? `You've reviewed all the emails. Your final score is ${score} out of ${totalEmailsInGame}.`
                    : `You scored ${score} so far. Ready for the next round?`}
                </p>
                {gameState === 'game-finished' ? (
                  <Button onClick={restartGame}>Play Again</Button>
                ) : (
                  <Button onClick={nextRound}>
                    {currentRound === gameConfig.numberOfRounds ? 'Finish Game' : 'Next Round'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}

            {gameState === 'playing' && (
              <div className="space-y-6">
                {emails.map((email) => (
                  <EmailCard key={email.id} email={email} onMark={handleMarkEmail} />
                ))}
              </div>
            )}
             {gameState === 'playing' && allEmailsProcessed && (
                <div className="flex justify-center pt-4">
                    <Button onClick={() => setGameState('round-finished')}>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
