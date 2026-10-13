import { Clapperboard } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionPlaceholder } from "@/components/section-placeholder";

export default function FilmesPage() {
  return (
    <>
      <PageHeader
        icon={Clapperboard}
        title="Filmes"
        description="Cadastre o que assistiu, de 0 a 5 estrelas, com descrição, comentários e capa."
      />
      <SectionPlaceholder entityLabel="filmes" />
    </>
  );
}
