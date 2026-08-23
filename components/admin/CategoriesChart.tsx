"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartCard } from "@/components/admin/ChartCard";
import { createClient } from "@/lib/supabase/client";
import { getJobsByCategory } from "@/lib/admin/queries";

export function CategoriesChart() {
  const [points, setPoints] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();

    getJobsByCategory(supabase).then((res) => {
      if (!active) return;
      setPoints(res.points);
      setError(res.error ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <ChartCard
      title="Categorias mais procuradas"
      loading={loading}
      error={error}
      empty={!loading && !error && points.length === 0}
      emptyMessage="Ainda não há trabalhos publicados suficientes para mostrar categorias."
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E9EF" />
          <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 11 }} width={90} />
          <Tooltip />
          <Bar dataKey="value" fill="#0B2545" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
