import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreboardProps {
  score: number;
  total: number;
  processed: number;
}

export function Scoreboard({ score, total, processed }: ScoreboardProps) {
  const progressPercentage = total > 0 ? (processed / total) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex justify-between items-center font-medium text-2xl">
          <span className="text-muted-foreground">Score</span>
          <span className="text-primary font-bold">{score} / {total}</span>
        </div>
        <div>
          <Progress value={progressPercentage} aria-label={`${processed} of ${total} emails reviewed`} />
          <p className="text-sm text-muted-foreground mt-2 text-right">
            {processed} of {total} reviewed
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
