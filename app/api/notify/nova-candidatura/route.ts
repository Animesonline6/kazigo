import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { novaCandidaturaTemplate } from "@/lib/email/templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kazigo-eight.vercel.app";

export async function POST(request: NextRequest) {
  try {
    const { jobId, message } = await request.json();

    if (!jobId) {
      return NextResponse.json({ ok: false, error: "jobId em falta" }, { status: 400 });
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Sem sessão" }, { status: 401 });
    }

    // Envio de email é "best-effort": se o Resend não estiver configurado,
    // não falhamos o pedido — só não enviamos nada.
    if (!resend) {
      return NextResponse.json({ ok: true, skipped: "RESEND_API_KEY não configurada" });
    }

    const { data: job } = await supabase
      .from("jobs")
      .select("id, title, client_id")
      .eq("id", jobId)
      .single();

    if (!job) {
      return NextResponse.json({ ok: false, error: "Trabalho não encontrado" }, { status: 404 });
    }

    const [{ data: clientProfile }, { data: workerProfile }] = await Promise.all([
      supabase.from("profiles").select("full_name, email").eq("id", job.client_id).single(),
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    ]);

    if (!clientProfile?.email) {
      return NextResponse.json({ ok: false, error: "Email do cliente não encontrado" }, { status: 404 });
    }

    const { subject, html } = novaCandidaturaTemplate({
      clientName: clientProfile.full_name || "Cliente",
      workerName: workerProfile?.full_name || "Um trabalhador",
      jobTitle: job.title,
      jobUrl: `${SITE_URL}/trabalhos/${job.id}`,
      message,
    });

    await resend.emails.send({
      from: EMAIL_FROM,
      to: clientProfile.email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    // Nunca deixamos um erro de email rebentar o fluxo de candidatura —
    // só registamos o erro no servidor.
    console.error("Erro ao enviar email de nova candidatura:", err);
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
