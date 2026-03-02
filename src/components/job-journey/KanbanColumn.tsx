'use client';

import { motion } from 'framer-motion';
import { Job, JobStatus } from '@/store/job-store';
import { JobCard } from './JobCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface KanbanColumnProps {
  title: string;
  status: JobStatus;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Job['status']) => void;
}

const statusColors: Record<JobStatus, { bg: string; border: string; text: string }> = {
  wishlist: { 
    bg: 'bg-primary/5', 
    border: 'border-primary/30', 
    text: 'text-primary' 
  },
  applied: { 
    bg: 'bg-blue-50 dark:bg-blue-950/20', 
    border: 'border-blue-200 dark:border-blue-800', 
    text: 'text-blue-600 dark:text-blue-400' 
  },
  'phone-screen': { 
    bg: 'bg-warning/5', 
    border: 'border-warning/30', 
    text: 'text-warning' 
  },
  interview: { 
    bg: 'bg-accent/5', 
    border: 'border-accent/30', 
    text: 'text-accent' 
  },
  offer: { 
    bg: 'bg-success/5', 
    border: 'border-success/30', 
    text: 'text-success' 
  },
  rejected: { 
    bg: 'bg-destructive/5', 
    border: 'border-destructive/30', 
    text: 'text-destructive' 
  },
};

export function KanbanColumn({
  title,
  status,
  jobs,
  onEdit,
  onDelete,
  onStatusChange,
}: KanbanColumnProps) {
  const colors = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-w-[300px] max-w-[300px] flex-col rounded-2xl border bg-card/50 shadow-sm backdrop-blur"
    >
      <div className={`sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b p-3 ${colors.bg}`}>
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${colors.text.replace('text', 'bg')}`} />
          <h3 className={`font-semibold ${colors.text}`}>{title}</h3>
        </div>
        <span className={`rounded-full px-2 py-0.5 text-sm font-medium ${colors.bg} ${colors.text}`}>
          {jobs.length}
        </span>
      </div>

      <div className="flex-1 p-3">
        <ScrollArea className="h-[calc(100vh-22rem)]">
          <div className="space-y-3 pr-2">
            {jobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <JobCard
                  job={job}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </motion.div>
            ))}
            {jobs.length === 0 && (
              <div className={`rounded-xl border border-dashed p-6 text-center text-sm ${colors.border} ${colors.bg} text-muted-foreground`}>
                No jobs in this stage yet
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </motion.div>
  );
}
