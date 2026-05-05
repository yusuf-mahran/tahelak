'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import { TrendingUp } from 'lucide-react';
import CardContainer from '@/components/shared/CardContainer';

const ROLE_COLORS: Record<string, string> = {
  manager: '#f59e0b',
  doctor: '#3b82f6',
  patient: '#10b981',
  cumulative: '#ef4444',
};

type Granularity = 'day' | 'month' | 'year';

function formatKey(date: Date, granularity: Granularity): string {
  if (granularity === 'day') {
    return date.toISOString().slice(0, 10); // YYYY-MM-DD
  }
  if (granularity === 'month') {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  return String(date.getFullYear());
}

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="z-10 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl px-4 py-3 min-w-35">
      <p className="text-xs font-bold text-foreground mb-2 border-b border-border pb-1.5">
        {label}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ background: entry.color }}
              />
              <span className="text-[11px] text-muted-foreground capitalize">
                {entry.name}
              </span>
            </div>
            <span className="text-[11px] font-bold text-foreground">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatLabel(key: string, granularity: Granularity): string {
  if (granularity === 'day') {
    const [, m, d] = key.split('-');
    return `${d}/${m}`;
  }
  if (granularity === 'month') {
    const [y, m] = key.split('-');
    return `${new Date(Number(y), Number(m) - 1).toLocaleString('default', { month: 'short' })} ${y}`;
  }
  return key;
}

export function UserGrowthChart() {
  const { users, usersLoading } = useDashboardDataContext();
  const [granularity, setGranularity] = useState<Granularity>('day');

  const { chartData, roles } = useMemo(() => {
    if (!users.length) return { chartData: [], roles: [] };

    const roles = [
      ...new Set(users.map((u) => u.role).filter(Boolean)),
    ] as string[];

    // Count users per (role, bucket)
    const buckets: Record<string, Record<string, number>> = {};

    for (const user of users) {
      if (!user.created_at || !user.role) continue;
      const key = formatKey(new Date(user.created_at), granularity);
      if (!buckets[key]) buckets[key] = {};
      buckets[key][user.role] = (buckets[key][user.role] ?? 0) + 1;
    }

    // Sort buckets chronologically
    const sortedKeys = Object.keys(buckets).sort();

    // Build cumulative counts per role and overall
    const cumulativeByRole: Record<string, number> = {};
    let cumulativeTotal = -1; // Start at -1 to exclude the first user creation from the total count

    const chartData = sortedKeys.map((key) => {
      const point: Record<string, string | number> = {
        label: formatLabel(key, granularity),
      };

      for (const role of roles) {
        const delta = buckets[key][role] ?? 0;
        cumulativeByRole[role] = (cumulativeByRole[role] ?? 0) + delta;
        point[role] = cumulativeByRole[role];
      }

      const totalDelta = Object.values(buckets[key]).reduce((s, v) => s + v, 0);
      cumulativeTotal += totalDelta;
      point['cumulative'] = cumulativeTotal;

      return point;
    });

    return { chartData, roles };
  }, [users, granularity]);

  if (usersLoading && !users.length) {
    return (
      <CardContainer className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </CardContent>
      </CardContainer>
    );
  }

  return (
    <CardContainer className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          User Growth
        </CardTitle>
        <div className="flex items-center gap-1 rounded-lg border border-border overflow-hidden text-xs">
          {(['day', 'month', 'year'] as Granularity[]).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              className={`px-3 py-1.5 font-medium transition-colors capitalize ${
                granularity === g
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
            No user data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/50"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11 }}
                className="text-muted-foreground"
                tickLine={false}
                axisLine={false}
                width={32}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: 'hsl(var(--border))',
                  strokeWidth: 1,
                  strokeDasharray: '4 2',
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: 12,
                  paddingTop: 12,
                }}
              />

              {roles.map(
                (role) =>
                  role !== 'root' && (
                    <Line
                      key={role}
                      type="monotone"
                      dataKey={role}
                      stroke={ROLE_COLORS[role] ?? '#94a3b8'}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ),
              )}

              <Line
                type="monotone"
                dataKey="cumulative"
                name="Total (cumulative)"
                stroke={ROLE_COLORS.cumulative}
                strokeWidth={2}
                strokeDasharray="5 4"
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </CardContainer>
  );
}
