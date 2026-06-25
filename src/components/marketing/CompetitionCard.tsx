import Link from "next/link";
import { Trophy, Calendar, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Competition } from "@/lib/profiles/types";

interface CompetitionCardProps {
  competition: Competition;
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  return (
    <Link href={`/competitions/${competition.id}`} className="card-surface block p-6">
      <div className="mb-3 flex items-start justify-between gap-3">
        <Trophy size={20} className="shrink-0 text-brand" aria-hidden />
        <Badge variant="brand">{competition.status.replace(/_/g, " ")}</Badge>
      </div>
      <h3 className="text-lg font-semibold text-text">{competition.title}</h3>
      {competition.description && (
        <p className="mt-2 line-clamp-2 text-sm text-text-muted">{competition.description}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-muted">
        {competition.domain && <span>{competition.domain}</span>}
        {competition.prize_pool_cents != null && (
          <span className="inline-flex items-center gap-1">
            <DollarSign size={14} />
            {formatCurrency(competition.prize_pool_cents)}
          </span>
        )}
        {competition.ends_at && (
          <span className="inline-flex items-center gap-1">
            <Calendar size={14} />
            Ends {formatDate(competition.ends_at)}
          </span>
        )}
      </div>
    </Link>
  );
}
