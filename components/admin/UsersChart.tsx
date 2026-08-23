"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { ChartCard } from "@/components/admin/ChartCard";
import { createClient } from "@/lib/supabase/client";
import { getUserSignupsSeries, type UserRange } from "@/lib/admin/queries";
import { cn } from "@/lib/utils";

const ranges: { value: UserRange; label: string }[] = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "12m", label: "12 meses" },
];

export function UsersChart() {
  const [range, setRange] = useState<UserRange>("30d");
  const [points, setPoints] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const supabase = createClient();

    getUserSignupsSeries(supabase, range).then((res) => {
      if (!active) return;
      setPoints(res.points);
      setError(res.error ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [range]);

  const hasData = points.some((p) => p.value > 0);

  return (
    <ChartCard
      title="Novos utilizadores"
      loading={loading}
      error={error}
      empty={!loading && !error && !hasData}
      emptyMessage="Ainda não há registos suficientes neste período."
      actions={
        <div className="flex gap-1 rounded-full bg-surface-muted p-1">
          {ranges.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => setRange(r.value)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                range === r.value ? "bg-white text-navy-700 shadow-sm" : "text-ink-faint"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E9EF" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#00A99D" strokeWidth={2} dot={false} name="Novos utilizadores" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
