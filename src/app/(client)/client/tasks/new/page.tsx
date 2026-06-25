import { redirect } from "next/navigation";

export default function NewClientTaskPage() {
  redirect("/client/requests/new?type=task");
}
