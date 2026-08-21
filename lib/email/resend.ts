import { Resend } from "resend";

// A chave vive só no servidor (nunca é exposta ao browser).
// É preciso configurar RESEND_API_KEY nas variáveis de ambiente da Vercel.
export const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Endereço de envio. Usa o teu domínio verificado no Resend quando o tiveres
// (ex: "KaziGo <notificacoes@kazigo.co.mz>"). Até lá, o domínio de teste
// do Resend só entrega para o teu próprio email de conta Resend.
export const EMAIL_FROM = process.env.EMAIL_FROM || "KaziGo <onboarding@resend.dev>";
