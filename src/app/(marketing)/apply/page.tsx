import { redirect } from "next/navigation";
import { ApplyWizard } from "@/components/forms/ApplyWizard";
import { listSkills } from "@/lib/skills/queries";
import { getCurrentProfile } from "@/lib/profiles/queries";
import { getTalentApplication as getApp } from "@/lib/profiles/helpers";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GraduationCap } from "lucide-react";

export const metadata = { title: "Apply as Talent" };

export default async function ApplyPage() {
  const profile = await getCurrentProfile();
  const skills = await listSkills();

  if (!profile) {
    return (
      <div className="section-container py-16 md:py-24">
        <div className="mx-auto max-w-lg text-center">
          <GraduationCap className="mx-auto text-brand" size={48} />
          <h1 className="mt-4 display-md">Apply as Talent</h1>
          <p className="mt-4 text-text-muted">
            Sign in or create a talent account to start your application.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button href="/signup?type=talent_applicant">Create Talent Account</Button>
            <Button href="/login?redirectTo=/apply" variant="outline">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const application = await getApp();

  if (application?.status === "approved") {
    redirect("/talent");
  }

  return (
    <div className="section-container py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="display-md">Talent Application</h1>
            <p className="mt-2 text-text-muted">
              Join the verified AI/ML talent network. Submit evidence for your skills.
            </p>
          </div>
          {application && (
            <Badge variant={application.status === "submitted" ? "brand" : "muted"}>
              {application.status.replace(/_/g, " ")}
            </Badge>
          )}
        </div>
        <ApplyWizard
          skills={skills}
          defaultName={profile.full_name ?? profile.display_name ?? ""}
        />
      </div>
    </div>
  );
}
