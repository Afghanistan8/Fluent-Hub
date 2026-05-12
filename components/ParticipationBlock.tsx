import type { Dapp } from "@/lib/schema";
import { Users, Zap, Sparkles, Wallet, Trophy, Clock } from "lucide-react";

type Participation = Dapp["participation"];

const FIELDS: {
  key: keyof Participation;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "who_its_for", label: "Who it's for", icon: <Users className="h-3.5 w-3.5" /> },
  { key: "what_you_do", label: "What you do", icon: <Zap className="h-3.5 w-3.5" /> },
  { key: "why_it_matters", label: "Why it matters", icon: <Sparkles className="h-3.5 w-3.5" /> },
  { key: "entry_cost", label: "Entry cost", icon: <Wallet className="h-3.5 w-3.5" /> },
  { key: "reward_loop", label: "Reward loop", icon: <Trophy className="h-3.5 w-3.5" /> },
  {
    key: "time_to_first_value",
    label: "Time to first value",
    icon: <Clock className="h-3.5 w-3.5" />,
  },
];

export function ParticipationBlock({ participation }: { participation: Participation }) {
  return (
    <section>
      <span className="font-mono text-2xs uppercase tracking-wider text-accent">Participation</span>
      <h2 className="mt-2 text-xl font-semibold tracking-tight">How to participate</h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Every listing answers the same six questions, so you can compare apps fairly.
      </p>
      <dl className="mt-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
        {FIELDS.map(({ key, label, icon }) => (
          <div key={key} className="flex flex-col gap-2 bg-background p-5">
            <dt className="flex items-center gap-2 font-mono text-2xs uppercase tracking-wider text-muted-foreground">
              <span className="text-accent">{icon}</span>
              {label}
            </dt>
            <dd className="text-[13px] leading-relaxed text-foreground">{participation[key]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
