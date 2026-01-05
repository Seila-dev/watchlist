// src/app/(private)/contents/[id]/page.tsx
import ContentDetailClient from "@/components/ContentDetail/index";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
    const { id } = await params;
  console.log("Page params:", params);
  return <ContentDetailClient id={id} />
}
