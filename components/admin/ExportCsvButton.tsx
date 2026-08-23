"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

function toCsvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function ExportCsvButton({
  filename,
  rows,
}: {
  filename: string;
  rows: Record<string, unknown>[];
}) {
  function handleExport() {
    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]);
    const csvLines = [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => toCsvValue(row[h])).join(",")),
    ];
    const csv = csvLines.join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button size="sm" variant="outline" onClick={handleExport} disabled={rows.length === 0}>
      <Download className="h-4 w-4" aria-hidden="true" />
      Exportar CSV ({rows.length})
    </Button>
  );
}
