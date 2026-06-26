"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

interface LeaderboardEntry {
  id: string;
  rank: number;
  score: number;
}

interface LiveLeaderboardProps {
  competitionId: string;
  initialEntries: LeaderboardEntry[];
}

export function LiveLeaderboard({ competitionId, initialEntries }: LiveLeaderboardProps) {
  const [entries, setEntries] = useState(initialEntries);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`leaderboard-${competitionId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leaderboard_entries",
          filter: `competition_id=eq.${competitionId}`,
        },
        async () => {
          const { data } = await supabase
            .from("leaderboard_entries")
            .select("id, rank, score")
            .eq("competition_id", competitionId)
            .order("rank", { ascending: true });
          if (data) setEntries(data);
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [competitionId]);

  if (entries.length === 0) return null;

  return (
    <div className="mt-8 card-surface p-6">
      <h2 className="heading-section">Leaderboard</h2>
      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-text-muted">
            <th className="pb-2">Rank</th>
            <th className="pb-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="border-b border-border">
              <td className="py-3">{entry.rank}</td>
              <td className="py-3">{Number(entry.score).toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
