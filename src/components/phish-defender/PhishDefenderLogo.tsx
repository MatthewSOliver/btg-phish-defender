import { ShieldCheck } from 'lucide-react';

export function PhishDefenderLogo() {
  return (
    <div className="flex items-center gap-3">
      <ShieldCheck className="h-10 w-10 text-primary" />
      <div>
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Phish Defender
        </h1>
        <p className="text-sm text-muted-foreground">Phishing Awareness Simulator</p>
      </div>
    </div>
  );
}
