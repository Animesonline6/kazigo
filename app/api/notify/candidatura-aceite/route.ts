import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { candidaturaAceiteTemplate } from "@/lib/email/templates";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://kazigo-eight.vercel.app";

export async function POST(request: NextRequest) {
  try {
    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json({ ok: false, error: "applicationId em falta" }, { status: 400 });
    }

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Sem sessão" }, { status: 401 });
    }

    if (!resend) {
      return NextResponse.json({ ok: true, skipped: "RESEND_API_KEY não configurada" });
    }

    const { data: application } = await supabase
      .from("job_applications")
      .select("id, job_id, worker_id, status")
      .eq("id", applicationId)
      .single();

    if (!application) {
      return NextResponse.json({ ok: false, error: "Candidatura não encontrada" }, { status: 404 });
    }

    const { data: job } = await supabase
      .from("jobs")
      .select("id, title, client_id")
      .eq("id", application.job_id)
      .single();

    // Só o dono do trabalho pode disparar este email
    if (!job || job.client_id !== user.id) {
      return NextResponse.json({ ok: false, error: "Não autorizado" }, { status: 403 });
    }

    const [{ data: workerProfile }, { data: clientProfile }] = await Promise.all([
      supabase.from("profiles").select("full_name, email").eq("id", application.worker_id).single(),
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    ]);

    if (!workerProfile?.email) {
      return NextResponse.json({ ok: false, error: "Email do trabalhador não encontrado" }, { status: 404 });
    }

    const { subject, html } = candidaturaAceiteTemplate({
      workerName: workerProfile.full_name || "Trabalhador",
      clientName: clientProfile?.full_name || "O cliente",
      jobTitle: job.title,
      jobUrl: `${SITE_URL}/trabalhos/${job.id}`,
    });

    await resend.emails.send({
      from: EMAIL_FROM,
      to: workerProfile.email,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Erro ao enviar email de candidatura aceite:", err);
    return NextResponse.json({ ok: false, error: "Erro interno" }, { status: 500 });
  }
}
