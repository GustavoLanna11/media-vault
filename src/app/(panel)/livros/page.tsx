import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionPlaceholder } from "@/components/section-placeholder";

export default function LivrosPage() {
  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="Livros"
        description="Autor, progresso de leitura, resenha e capa — tudo no mesmo lugar."
      />
      <SectionPlaceholder entityLabel="livros" />
    </>
  );
}
