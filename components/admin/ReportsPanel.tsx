"use client";

import { useMemo, useState } from "react";
import { Download, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function toCsvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => toCsvValue(r[h])).join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

async function downloadPdf(title: string, filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Gerado em ${new Date().toLocaleDateString("pt-PT")} · ${rows.length} registos`, 14, 22);

  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => headers.map((h) => (r[h] === null || r[h] === undefined ? "" : String(r[h]))));

  autoTable(doc, {
    head: [headers],
    body,
    startY: 28,
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [11, 37, 69] },
  });

  doc.save(filename);
}

interface ReportRow {
  created_at: string;
  [key: string]: unknown;
}

export function ReportsPanel({
  users,
  jobs,
  applications,
}: {
  users: ReportRow[];
  jobs: ReportRow[];
  applications: ReportRow[];
}) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function filterByPeriod(rows: ReportRow[]) {
    return rows.filter((r) => {
      const date = r.created_at?.slice(0, 10);
      if (from && date < from) return false;
      if (to && date > to) return false;
      return true;
    });
  }

  const filteredUsers = useMemo(() => filterByPeriod(users), [users, from, to]);
  const filteredJobs = useMemo(() => filterByPeriod(jobs), [jobs, from, to]);
  const filteredApplications = useMemo(() => filterByPeriod(applications), [applications, from, to]);

  const datasets = [
    { key: "utilizadores", label: "Utilizadores", description: "Contas registadas", rows: filteredUsers },
    { key: "trabalhos", label: "Trabalhos", description: "Trabalhos publicados", rows: filteredJobs },
    { key: "candidaturas", label: "Candidaturas", description: "Candidaturas enviadas", rows: filteredApplications },
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-3 p-5 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-ink-soft">De</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-ink-soft">Até</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
        </div>
        {(from || to) && (
          <button
            type="button"
            onClick={() => {
              setFrom("");
              setTo("");
            }}
            className="text-xs font-medium text-ink-faint hover:text-danger"
          >
            Limpar período
          </button>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {datasets.map((d) => (
          <Card key={d.key} className="flex flex-col gap-3 p-5">
            <p className="text-sm font-semibold text-ink">{d.label}</p>
            <p className="text-xs text-ink-faint">
              {d.description} · {d.rows.length} registo{d.rows.length === 1 ? "" : "s"}
              {(from || to) && " no período"}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadCsv(`kazigo-${d.key}.csv`, d.rows)}
                disabled={d.rows.length === 0}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => downloadPdf(`KaziGo — ${d.label}`, `kazigo-${d.key}.pdf`, d.rows)}
                disabled={d.rows.length === 0}
              >
                <FileText className="h-4 w-4" aria-hidden="true" />
                PDF
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
