import { CompetitionForm } from "@/components/forms/CompetitionForm";

export default function NewClientCompetitionPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">New competition</h1>
      <CompetitionForm />
    </div>
  );
}
