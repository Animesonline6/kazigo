import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileCheck2,
  Tag,
  Flag,
  Star,
  CreditCard,
  BarChart3,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** true = já tem dados reais ligados; false = ainda depende de tabela nova */
  ready: boolean;
}

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, ready: true },
  { href: "/admin/utilizadores", label: "Utilizadores", icon: Users, ready: true },
  { href: "/admin/trabalhos", label: "Trabalhos", icon: Briefcase, ready: true },
  { href: "/admin/candidaturas", label: "Candidaturas", icon: FileCheck2, ready: true },
  { href: "/admin/categorias", label: "Categorias", icon: Tag, ready: true },
  { href: "/admin/denuncias", label: "Denúncias", icon: Flag, ready: true },
  { href: "/admin/avaliacoes", label: "Avaliações", icon: Star, ready: true },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: CreditCard, ready: false },
  { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3, ready: false },
  { href: "/admin/notificacoes-admin", label: "Notificações", icon: Bell, ready: true },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings, ready: true },
];
