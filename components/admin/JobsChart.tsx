"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { ChartCard } from "@/components/admin/ChartCard";
import { createClient } from "@/lib/supabase/client";
import { getJobsByStatus } from "@/lib/admin/queries";

const COLORS: Record<string, string> = {
  Publicados: "#00A99D",
  "Em andamento": "#0B2545",
  Concluídos: "#22C55E",
  Cancelados: "#EF4444",
  Pausados: "#94A3B8",
};

export function JobsChart() {
  const [points, setPoints] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    getJobsByStatus(supabase).then((res) => {
      if (!active) return;
      setPoints(res.points);
      setError(res.error ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const hasData = points.some((p) => p.value > 0);

  return (
    <ChartCard
      title="Trabalhos por estado"
      loading={loading}
      error={error}
      empty={!loading && !error && !hasData}
      emptyMessage="Ainda não há trabalhos publicados."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E9EF" />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {points.map((p) => (
              <Cell key={p.label} fill={COLORS[p.label] ?? "#00A99D"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
