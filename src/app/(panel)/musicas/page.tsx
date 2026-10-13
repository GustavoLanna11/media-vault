import { Music2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionPlaceholder } from "@/components/section-placeholder";

export default function MusicasPage() {
  return (
    <>
      <PageHeader
        icon={Music2}
        title="Músicas"
        description="Faixas avulsas ou ligadas a um álbum — ideal para o que você ouviu recentemente."
      />
      <SectionPlaceholder entityLabel="músicas" />
    </>
  );
}
