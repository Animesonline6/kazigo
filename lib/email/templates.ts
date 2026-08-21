const NAVY = "#0B2545";
const TEAL = "#00A99D";

function baseLayout(content: string) {
  return `
  <div style="background-color:#F4F6F8;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E5E9EF;">
      <div style="background-color:${NAVY};padding:20px 24px;">
        <span style="color:#ffffff;font-size:18px;font-weight:bold;">KaziGo</span>
      </div>
      <div style="padding:28px 24px;color:#1A1A1A;font-size:14px;line-height:1.6;">
        ${content}
      </div>
      <div style="padding:16px 24px;border-top:1px solid #E5E9EF;">
        <p style="margin:0;color:#8A94A6;font-size:12px;">
          Recebeste este email porque tens uma conta na KaziGo.
        </p>
      </div>
    </div>
  </div>`;
}

export function novaCandidaturaTemplate({
  clientName,
  workerName,
  jobTitle,
  jobUrl,
  message,
}: {
  clientName: string;
  workerName: string;
  jobTitle: string;
  jobUrl: string;
  message?: string | null;
}) {
  const subject = `Nova candidatura para "${jobTitle}"`;

  const html = baseLayout(`
    <p style="margin:0 0 12px;">Olá ${clientName},</p>
    <p style="margin:0 0 16px;">
      <strong>${workerName}</strong> candidatou-se ao teu trabalho
      "<strong>${jobTitle}</strong>".
    </p>
    ${
      message
        ? `<div style="background:#F4F6F8;border-radius:8px;padding:12px 14px;margin:0 0 20px;color:#4A5568;">
            "${message}"
          </div>`
        : ""
    }
    <a href="${jobUrl}" style="display:inline-block;background-color:${TEAL};color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:bold;font-size:14px;">
      Ver candidatura
    </a>
  `);

  return { subject, html };
}
