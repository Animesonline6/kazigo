/**
 * Domain types for KaziGo.
 * These describe the shape of data the frontend expects. They are intentionally
 * decoupled from any backend/ORM shape so the future API can be mapped onto them.
 */

// ---------- Geography / i18n (prepared for multi-country expansion) ----------

export type CountryCode = "MZ"; // extend later: "PT" | "AO" | "ZA" ...
export type CurrencyCode = "MZN"; // extend later: "USD" | "EUR" ...
export type LanguageCode = "pt"; // extend later: "en" ...

export interface Locale {
  country: CountryCode;
  currency: CurrencyCode;
  language: LanguageCode;
  timezone: string; // e.g. "Africa/Maputo"
}

export interface Location {
  city: string;
  province?: string;
  country: CountryCode;
  remote?: boolean;
}

// ---------- Users ----------

export type UserRole = "worker" | "client" | "company" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  location: Location;
  createdAt: string;
  verified: boolean;
}

export interface WorkerProfile extends User {
  role: "worker";
  headline: string;
  bio: string;
  skills: string[];
  hourlyRate?: number;
  rating: number; // 0-5
  reviewsCount: number;
  completedJobs: number;
  availability: "available" | "busy" | "unavailable";
  portfolio?: PortfolioItem[];
}

export interface ClientProfile extends User {
  role: "client";
  jobsPosted: number;
  rating: number;
  reviewsCount: number;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  location: Location;
  category: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  foundedYear?: number;
  employeeRange?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
}

// ---------- Categories ----------

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // lucide-react icon name
  jobsCount: number;
  description?: string;
}

// ---------- Jobs ----------

export type JobType = "remoto" | "presencial" | "hibrido";
export type JobBudgetType = "fixo" | "por_hora";
export type JobStatus = "aberto" | "em_andamento" | "concluido" | "cancelado" | "pausado";

export interface JobBudget {
  type: JobBudgetType;
  min: number;
  max?: number;
  currency: CurrencyCode;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  location: Location;
  type: JobType;
  budget: JobBudget;
  deadline?: string;
  clientId: string;
  clientName: string;
  clientAvatarUrl?: string;
  status: JobStatus;
  skillsRequired: string[];
  applicantsCount: number;
  createdAt: string;
  featured?: boolean;
}

export type ApplicationStatus = "pendente" | "aceite" | "recusada" | "retirada";

export interface JobApplication {
  id: string;
  jobId: string;
  workerId: string;
  message: string;
  proposedRate?: number;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Contract {
  id: string;
  jobId: string;
  workerId: string;
  clientId: string;
  agreedAmount: number;
  currency: CurrencyCode;
  status: "ativo" | "concluido" | "disputado" | "cancelado";
  startedAt: string;
  endedAt?: string;
}

// ---------- Messaging ----------

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage?: Message;
  unreadCount: number;
}

// ---------- Notifications ----------

export type NotificationType =
  | "candidatura"
  | "mensagem"
  | "pagamento"
  | "avaliacao"
  | "sistema";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

// ---------- Reviews ----------

export interface Review {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  targetId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ---------- Payments (types only — no real integration yet) ----------

export type PaymentMethod = "mpesa" | "emola" | "cartao" | "transferencia";
export type PaymentStatus = "pendente" | "concluido" | "falhou" | "reembolsado";

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  currency: CurrencyCode;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: string;
}

// ---------- Support / Trust & Safety ----------

export interface Report {
  id: string;
  reporterId: string;
  targetType: "job" | "user" | "message";
  targetId: string;
  reason: string;
  status: "aberto" | "em_analise" | "resolvido";
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: "aberto" | "em_analise" | "resolvido" | "fechado";
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  targetType: "job" | "worker" | "company";
  targetId: string;
  createdAt: string;
}

// ---------- UI state helpers ----------

export type AsyncState = "idle" | "loading" | "success" | "error" | "empty";
