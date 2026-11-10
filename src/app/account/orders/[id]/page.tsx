import { Confirmation } from "@/components/order-experience";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <Confirmation id={(await params).id} />;
}
