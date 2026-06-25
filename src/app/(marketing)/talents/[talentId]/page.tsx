import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, MapPin, Star, Github, Linkedin, Globe } from "lucide-react";
import { getTalentById } from "@/lib/talents/queries";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({ params }: { params: Promise<{ talentId: string }> }) {
  const { talentId } = await params;
  const talent = await getTalentById(talentId);
  if (!talent) return { title: "Talent Not Found" };
  const profile = talent.profiles as { display_name?: string; full_name?: string };
  const name = profile.display_name || profile.full_name || "AI/ML Expert";
  return { title: name };
}

export default async function TalentDetailPage({
  params,
}: {
  params: Promise<{ talentId: string }>;
}) {
  const { talentId } = await params;
  const talent = await getTalentById(talentId);
  if (!talent || talent.visibility === "hidden") notFound();

  const profile = talent.profiles as {
    full_name: string | null;
    display_name: string | null;
    avatar_url: string | null;
    location: string | null;
    bio: string | null;
    linkedin_url: string | null;
    github_url: string | null;
    website_url: string | null;
  };

  const name = profile.display_name || profile.full_name || "AI/ML Expert";
  const isLimited = talent.visibility === "limited";

  return (
    <div className="section-container py-16 md:py-24">
      <div className="card-surface p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <UserAvatar name={name} imageUrl={profile.avatar_url} size="lg" className="!h-20 !w-20 !text-2xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-text">{name}</h1>
              {talent.verified_at && (
                <Badge variant="success">
                  <BadgeCheck size={12} />
                  Verified Talent
                </Badge>
              )}
            </div>
            <p className="mt-1 text-lg text-brand">{talent.professional_headline}</p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-text-muted">
              {profile.location && !isLimited && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={16} />
                  {profile.location}
                </span>
              )}
              {talent.reputation_overall > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Star size={16} className="text-amber-500" />
                  {Number(talent.reputation_overall).toFixed(1)} reputation
                </span>
              )}
            </div>
          </div>
          <Button href="/client/requests/new">Request Introduction</Button>
        </div>

        {profile.bio && !isLimited && (
          <p className="mt-8 text-text-body">{profile.bio}</p>
        )}

        {talent.skill_claims.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
              Verified Skills
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {talent.skill_claims.map((claim: { id: string; level: number; skills: { name: string } }) => (
                <Badge key={claim.id} variant="brand">
                  {(claim.skills as { name: string }).name} · L{claim.level}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {!isLimited && (
          <div className="mt-6 flex gap-4">
            {profile.github_url && (
              <Link href={profile.github_url} className="text-text-muted hover:text-brand" target="_blank">
                <Github size={20} />
              </Link>
            )}
            {profile.linkedin_url && (
              <Link href={profile.linkedin_url} className="text-text-muted hover:text-brand" target="_blank">
                <Linkedin size={20} />
              </Link>
            )}
            {profile.website_url && (
              <Link href={profile.website_url} className="text-text-muted hover:text-brand" target="_blank">
                <Globe size={20} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
