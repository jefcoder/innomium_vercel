import { redirect } from "next/navigation";

export default function NewClientConsultPage() {
  redirect("/client/requests/new?type=consult");
}
