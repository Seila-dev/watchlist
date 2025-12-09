// src/app/(private)/contents/[id]/page.tsx
import ContentDetailClient from "@/components/ContentDetail/index";

export default function Page({ params }: any) {
  const { id } = params;

  return (
    <div>
      {/* Passa o id pro componente cliente que faz o fetch */}
      <ContentDetailClient id={id} />
    </div>
  );
}
