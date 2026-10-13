import { Disc3 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionPlaceholder } from "@/components/section-placeholder";

export default function AlbunsPage() {
  return (
    <>
      <PageHeader
        icon={Disc3}
        title="Álbuns"
        description="Registre álbuns ouvidos, artista, nota e quando você escutou."
      />
      <SectionPlaceholder entityLabel="álbuns" />
    </>
  );
}
