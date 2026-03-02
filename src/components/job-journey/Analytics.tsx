'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  TooltipProps,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Target,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useJobStore } from '@/store/job-store';

const COLORS = [
  'oklch(0.45 0.2 260)',
  'oklch(0.6 0.15 200)',
  'oklch(0.75 0.15 85)',
  'oklch(0.6 0.15 175)',
  'oklch(0.6 0.2 145)',
  'oklch(0.55 0.18 25)',
];

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[170px] rounded-xl border border-border/80 bg-card/95 p-3 shadow-xl backdrop-blur">
      {label && <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>}
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={`${entry.name}-${entry.value}`} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold">{entry.value ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Analytics() {
  const jobs = useJobStore((state) => state.jobs);
  const [activePieIndex, setActivePieIndex] = useState(0);

  const {
    total,
    wishlist,
    applied,
    phoneScreen,
    interviews,
    offers,
    rejected,
    pending,
  } = useMemo(() => {
    const counts = {
      total: jobs.length,
      wishlist: 0,
      applied: 0,
      phoneScreen: 0,
      interviews: 0,
      offers: 0,
      rejected: 0,
    };

    for (const job of jobs) {
      if (job.status === 'wishlist') counts.wishlist += 1;
      if (job.status === 'applied') counts.applied += 1;
      if (job.status === 'phone-screen') counts.phoneScreen += 1;
      if (job.status === 'interview') counts.interviews += 1;
      if (job.status === 'offer') counts.offers += 1;
      if (job.status === 'rejected') counts.rejected += 1;
    }

    return {
      ...counts,
      pending: counts.applied + counts.phoneScreen + counts.interviews,
    };
  }, [jobs]);

  const statusData = useMemo(
    () =>
      [
        { name: 'Wishlist', value: wishlist },
        { name: 'Applied', value: applied },
        { name: 'Phone Screen', value: phoneScreen },
        { name: 'Interview', value: interviews },
        { name: 'Offer', value: offers },
        { name: 'Rejected', value: rejected },
      ].filter((item) => item.value > 0),
    [wishlist, applied, phoneScreen, interviews, offers, rejected]
  );

  const weeklyData = [
    { week: 'Week 1', applications: 3, responses: 2 },
    { week: 'Week 2', applications: 5, responses: 3 },
    { week: 'Week 3', applications: 2, responses: 4 },
    { week: 'Week 4', applications: 4, responses: 2 },
  ];

  const funnelData = [
    { stage: 'Wishlist', count: wishlist, fill: COLORS[0] },
    { stage: 'Applied', count: applied, fill: COLORS[1] },
    { stage: 'Phone Screen', count: phoneScreen, fill: COLORS[2] },
    { stage: 'Interview', count: interviews, fill: COLORS[3] },
    { stage: 'Offer', count: offers, fill: COLORS[4] },
  ];

  const priorityData = useMemo(
    () => [
      { priority: 'High', count: jobs.filter((j) => j.priority === 'high').length },
      { priority: 'Medium', count: jobs.filter((j) => j.priority === 'medium').length },
      { priority: 'Low', count: jobs.filter((j) => j.priority === 'low').length },
    ],
    [jobs]
  );

  const responseRate = total > 0 ? Math.round(((phoneScreen + interviews + offers) / total) * 100) : 0;
  const interviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0;
  const offerRate = interviews > 0 ? Math.round((offers / interviews) * 100) : 0;

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_1px_1px,oklch(0.85_0.01_260/.45)_1px,transparent_1px)] bg-[length:20px_20px] p-4 md:p-6 lg:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics & Insights</h1>
        <p className="mt-1 text-muted-foreground">
          Track your job search progress and identify areas for improvement
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: 'Response Rate',
            value: `${responseRate}%`,
            icon: Target,
            trend: '+5%',
            trendUp: true,
            color: 'text-success',
          },
          {
            title: 'Interview Rate',
            value: `${interviewRate}%`,
            icon: Calendar,
            trend: '+2%',
            trendUp: true,
            color: 'text-accent',
          },
          {
            title: 'Offer Rate',
            value: `${offerRate}%`,
            icon: TrendingUp,
            trend: '-1%',
            trendUp: false,
            color: 'text-primary',
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group overflow-hidden border-border/70 bg-card/85 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
              <CardContent className="relative p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className={`text-3xl font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                    <span
                      className={`flex items-center gap-1 text-xs ${metric.trendUp ? 'text-success' : 'text-destructive'}`}
                    >
                      {metric.trendUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                      {metric.trend}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border-border/70 bg-card/85 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Application Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      activeIndex={activePieIndex}
                      onMouseEnter={(_, index) => setActivePieIndex(index)}
                      activeShape={(props: any) => (
                        <Sector
                          {...props}
                          outerRadius={(props.outerRadius ?? 100) + 8}
                          stroke="oklch(0.98 0 0)"
                          strokeWidth={1.5}
                        />
                      )}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border-border/70 bg-card/85 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Applications Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <defs>
                      <linearGradient id="applicationsLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="oklch(0.45 0.2 260)" />
                        <stop offset="100%" stopColor="oklch(0.6 0.18 240)" />
                      </linearGradient>
                      <linearGradient id="responsesLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="oklch(0.6 0.15 175)" />
                        <stop offset="100%" stopColor="oklch(0.68 0.17 190)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/70" />
                    <XAxis dataKey="week" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ stroke: 'oklch(0.55 0.03 260)', strokeDasharray: '4 4' }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      name="Applications"
                      stroke="url(#applicationsLine)"
                      strokeWidth={3}
                      dot={{
                        r: 3,
                        fill: 'oklch(0.45 0.2 260)',
                        stroke: 'oklch(0.98 0 0)',
                        strokeWidth: 1.5,
                      }}
                      activeDot={{
                        r: 8,
                        fill: 'oklch(0.45 0.2 260)',
                        stroke: 'oklch(0.98 0 0)',
                        strokeWidth: 2,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="responses"
                      name="Responses"
                      stroke="url(#responsesLine)"
                      strokeWidth={3}
                      dot={{
                        r: 3,
                        fill: 'oklch(0.6 0.15 175)',
                        stroke: 'oklch(0.98 0 0)',
                        strokeWidth: 1.5,
                      }}
                      activeDot={{
                        r: 8,
                        fill: 'oklch(0.6 0.15 175)',
                        stroke: 'oklch(0.98 0 0)',
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-border/70 bg-card/85 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Application Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/70" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="stage" type="category" className="text-xs" width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {funnelData.map((entry) => (
                        <Cell key={entry.stage} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-border/70 bg-card/85 shadow-sm backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <defs>
                      <linearGradient id="priorityBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.45 0.2 260)" />
                        <stop offset="100%" stopColor="oklch(0.38 0.16 260)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/70" />
                    <XAxis dataKey="priority" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="url(#priorityBar)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border border-border/70 bg-gradient-to-r from-primary/10 via-card/90 to-accent/10 p-6 shadow-sm"
      >
        <h3 className="mb-4 font-semibold">Insights & Recommendations</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-card/90 p-4">
            <p className="text-sm font-medium text-success">Great Progress!</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You&apos;ve received {offers} offer(s). Keep up the momentum!
            </p>
          </div>
          <div className="rounded-xl border bg-card/90 p-4">
            <p className="text-sm font-medium text-warning">Focus Area</p>
            <p className="mt-1 text-xs text-muted-foreground">
              You have {pending} applications awaiting response. Consider follow-ups.
            </p>
          </div>
          <div className="rounded-xl border bg-card/90 p-4">
            <p className="text-sm font-medium text-primary">Tip</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Apply to {wishlist} wishlist jobs to increase your pipeline.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
