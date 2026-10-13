import {
  BookOpen,
  Clapperboard,
  Disc3,
  Gamepad2,
  Home,
  Music2,
  Tv,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const mainNav: NavItem[] = [
  {
    href: "/",
    label: "Início",
    icon: Home,
    description: "Visão geral do seu vault",
  },
  {
    href: "/filmes",
    label: "Filmes",
    icon: Clapperboard,
    description: "Filmes assistidos e notas",
  },
  {
    href: "/series",
    label: "Séries",
    icon: Tv,
    description: "Séries em andamento e concluídas",
  },
  {
    href: "/livros",
    label: "Livros",
    icon: BookOpen,
    description: "Leituras e resenhas",
  },
  {
    href: "/jogos",
    label: "Jogos",
    icon: Gamepad2,
    description: "Jogados, zerados e platina",
  },
  {
    href: "/albuns",
    label: "Álbuns",
    icon: Disc3,
    description: "Álbuns ouvidos",
  },
  {
    href: "/musicas",
    label: "Músicas",
    icon: Music2,
    description: "Faixas favoritas recentes",
  },
];
