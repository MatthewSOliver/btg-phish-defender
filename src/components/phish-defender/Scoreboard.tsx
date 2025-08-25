import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreboardProps {
  score: number;
  total: number;
  processed: number;
  round: number;
  totalRounds: number;
}

export function Scoreboard({ score, total, processed, round, totalRounds }: ScoreboardProps) {
  const progressPercentage = total > 0 ? (processed / total) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Your Progress</CardTitle>
          <CardDescription>Round {round} of {totalRounds}</CardDescription>
        </div>
        <div className="text-right">
          <span className="text-muted-foreground text-2xl">Score</span>
          <span className="text-primary font-bold text-2xl ml-2">{score}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4">
        <div>
          <Progress value={progressPercentage} aria-label={`${processed} of ${total} emails reviewed in total`} />
          <p className="text-sm text-muted-foreground mt-2 text-right">
            {processed} of {total} total emails reviewed
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
