import { RequestWizard } from "@/components/forms/RequestWizard";

export default async function NewClientRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text">New request</h1>
      <RequestWizard defaultType={type ?? "consult"} />
    </div>
  );
}
