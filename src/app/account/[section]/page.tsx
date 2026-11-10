import { notFound } from "next/navigation";
import { AccountSettings } from "@/components/account-settings";
export default async function Page({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (
    section !== "profile" &&
    section !== "addresses" &&
    section !== "preferences"
  )
    notFound();
  return <AccountSettings section={section} />;
}
