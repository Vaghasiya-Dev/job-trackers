'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  LayoutGrid,
  List,
  Plus,
  Search,
  Target,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KanbanColumn } from './KanbanColumn';
import { JobTableView } from './JobTableView';
import { useJobStore, Job, JobStatus } from '@/store/job-store';

interface JobBoardProps {
  onAddJob: () => void;
  onEditJob: (job: Job) => void;
}

const columns = [
  { status: 'wishlist' as JobStatus, title: 'Wishlist' },
  { status: 'applied' as JobStatus, title: 'Applied' },
  { status: 'phone-screen' as JobStatus, title: 'Phone Screen' },
  { status: 'interview' as JobStatus, title: 'Interview' },
  { status: 'offer' as JobStatus, title: 'Offer' },
  { status: 'rejected' as JobStatus, title: 'Rejected' },
];

export function JobBoard({ onAddJob, onEditJob }: JobBoardProps) {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('all');
  
  const jobs = useJobStore((state) => state.jobs);
  const deleteJob = useJobStore((state) => state.deleteJob);
  const updateJobStatus = useJobStore((state) => state.updateJobStatus);

  const filteredJobs = jobs.filter(
    (job) =>
      (job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === 'all' || job.status === statusFilter)
  );

  const getJobsByStatus = (status: JobStatus) => 
    filteredJobs.filter((job) => job.status === status);

  const stats = {
    total: jobs.length,
    active: jobs.filter((job) => ['applied', 'phone-screen', 'interview'].includes(job.status)).length,
    interviews: jobs.filter((job) => job.status === 'interview').length,
    offers: jobs.filter((job) => job.status === 'offer').length,
    rejected: jobs.filter((job) => job.status === 'rejected').length,
  };

  return (
    <div className="h-full flex flex-col bg-[radial-gradient(circle_at_1px_1px,oklch(0.85_0.01_260/.45)_1px,transparent_1px)] bg-[length:22px_22px]">
      <div className="relative border-b bg-gradient-to-br from-background via-background to-secondary/40 p-4 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.45_0.2_260/.16),transparent_55%)]" />
        <div className="relative space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Pipeline</p>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl">Job Board</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep every application, interview, and offer in one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'kanban' | 'list')}>
                <TabsList className="bg-card/70 backdrop-blur">
                  <TabsTrigger value="kanban" className="gap-1">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Kanban</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-1">
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <Button onClick={onAddJob} className="gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                Add Job
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            <div className="rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BriefcaseBusiness className="h-4 w-4" />
                Total
              </div>
              <p className="mt-2 text-2xl font-semibold">{stats.total}</p>
            </div>
            <div className="rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                Active
              </div>
              <p className="mt-2 text-2xl font-semibold">{stats.active}</p>
            </div>
            <div className="rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Target className="h-4 w-4" />
                Interviews
              </div>
              <p className="mt-2 text-2xl font-semibold">{stats.interviews}</p>
            </div>
            <div className="rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Offers
              </div>
              <p className="mt-2 text-2xl font-semibold">{stats.offers}</p>
            </div>
            <div className="rounded-xl border bg-card/85 p-3 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <XCircle className="h-4 w-4 text-destructive" />
                Rejected
              </div>
              <p className="mt-2 text-2xl font-semibold">{stats.rejected}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search role or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl border bg-card/90 pl-9 shadow-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                className="h-8 rounded-full px-3 text-xs"
                onClick={() => setStatusFilter('all')}
              >
                All ({jobs.length})
              </Button>
              {columns.map((column) => {
                const count = jobs.filter((job) => job.status === column.status).length;
                return (
                  <Button
                    key={column.status}
                    variant={statusFilter === column.status ? 'default' : 'outline'}
                    className="h-8 rounded-full px-3 text-xs"
                    onClick={() => setStatusFilter(column.status)}
                  >
                    {column.title} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <motion.div
              key="kanban"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-x-auto p-4 md:p-6"
            >
              <div className="flex min-h-full gap-4">
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.status}
                    title={column.title}
                    status={column.status}
                    jobs={getJobsByStatus(column.status)}
                    onEdit={onEditJob}
                    onDelete={deleteJob}
                    onStatusChange={updateJobStatus}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-auto p-4 md:p-6"
            >
              <JobTableView jobs={filteredJobs} onEdit={onEditJob} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
