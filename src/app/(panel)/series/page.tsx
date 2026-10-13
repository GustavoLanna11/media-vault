import { Tv } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionPlaceholder } from "@/components/section-placeholder";

export default function SeriesPage() {
  return (
    <>
      <PageHeader
        icon={Tv}
        title="Séries"
        description="Acompanhe temporadas, status e notas das séries que você curte."
      />
      <SectionPlaceholder entityLabel="séries" />
    </>
  );
}
