import { Gamepad2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SectionPlaceholder } from "@/components/section-placeholder";

export default function JogosPage() {
  return (
    <>
      <PageHeader
        icon={Gamepad2}
        title="Jogos"
        description="Marque o que está jogando, o que zerou e onde pegou platina."
      />
      <SectionPlaceholder entityLabel="jogos" />
    </>
  );
}
