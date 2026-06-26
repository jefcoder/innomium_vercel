import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApplicationReviewForm } from "@/components/admin/ApplicationReviewForm";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminTalentApplicationDetailPage({
  params,
}: {
  params: Promise<{ applicationId: string }>;
}) {
  const { applicationId } = await params;
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("talent_applications")
    .select("*, profiles(full_name, display_name, headline, location)")
    .eq("id", applicationId)
    .single();

  if (!application) notFound();

  const profile = application.profiles as {
    full_name: string | null;
    display_name: string | null;
    headline: string | null;
    location: string | null;
  } | null;

  const { data: claims } = await supabase
    .from("skill_claims")
    .select("*, skills(name)")
    .eq("application_id", applicationId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href="/admin/talent-applications" className="text-sm text-brand hover:underline">
          ← Back to applications
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-text">
          {profile?.display_name ?? profile?.full_name ?? "Application"}
        </h1>
        <p className="mt-1 text-sm text-text-muted">Review talent application</p>
      </div>

      <div className="card-surface space-y-4 p-6">
        <Badge variant={application.status === "approved" ? "success" : "muted"}>
          {application.status}
        </Badge>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <dt className="text-text-muted">Submitted</dt>
          <dd className="text-text">
            {application.submitted_at ? formatDate(application.submitted_at) : "—"}
          </dd>
          <dt className="text-text-muted">Engagement types</dt>
          <dd className="text-text">{application.engagement_types.join(", ") || "—"}</dd>
          <dt className="text-text-muted">Visibility preference</dt>
          <dd className="text-text">{application.visibility_preference}</dd>
          {profile?.headline && (
            <>
              <dt className="text-text-muted">Headline</dt>
              <dd className="text-text">{profile.headline}</dd>
            </>
          )}
        </dl>
        {application.reviewer_notes && (
          <p className="text-sm text-text-muted">{application.reviewer_notes}</p>
        )}
      </div>

      {claims && claims.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-text">Skill claims</h2>
          <ul className="space-y-2">
            {claims.map((claim) => {
              const skill = claim.skills as { name: string } | null;
              return (
                <li key={claim.id} className="card-surface flex justify-between p-3 text-sm">
                  <span>{skill?.name ?? "Skill"} · Level {claim.level}</span>
                  <Badge variant="muted">{claim.status}</Badge>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <ApplicationReviewForm
        applicationId={applicationId}
        currentStatus={application.status}
      />
    </div>
  );
}
