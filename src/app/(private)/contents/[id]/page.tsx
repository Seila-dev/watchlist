"use client"
import useContents from "@/hooks/useContents";
import { useEffect } from "react";

// Este é um Server Component por padrão no App Router
export default function Page({ params }: { params: { idParams: string } }) {
  // params.slug conterá o valor dinâmico da URL (ex: "post-1")
  const { idParams } = params; 
  const { contents, fetchContentById } = useContents()

  useEffect(() => {
    fetchContentById(idParams)
  })

  const found = contents.find(content => content.id === idParams)

  console.log(found)
   
  // Aqui você pode buscar os dados do seu conteúdo usando o slug
  // const postData = await fetchPostBySlug(slug);

  return (
    <div>
      <h1>Página do Post: {idParams}</h1>
    </div>
  );
}
