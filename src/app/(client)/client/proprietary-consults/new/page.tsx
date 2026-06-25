import { redirect } from "next/navigation";

export default function NewProprietaryConsultPage() {
  redirect("/client/requests/new?type=proprietary");
}
