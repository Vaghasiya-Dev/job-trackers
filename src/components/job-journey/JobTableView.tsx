'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Job, Priority } from '@/store/job-store';

interface JobTableViewProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
}

const priorityColors: Record<Priority, string> = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
};

const statusLabels: Record<Job['status'], string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  'phone-screen': 'Phone Screen',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

const statusColors: Record<Job['status'], string> = {
  wishlist: 'bg-primary/10 text-primary',
  applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'phone-screen': 'bg-warning/10 text-warning',
  interview: 'bg-accent/10 text-accent',
  offer: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
};

export function JobTableView({ jobs, onEdit }: JobTableViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-hidden rounded-2xl border bg-card shadow-sm"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="w-[250px]">Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job, index) => (
              <motion.tr
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group cursor-pointer border-b/60 hover:bg-muted/40"
                onClick={() => onEdit(job)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {job.companyName.charAt(0)}
                      </span>
                    </div>
                    <span className="truncate">{job.jobTitle}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.companyName}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[job.status]}>
                    {statusLabels[job.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={priorityColors[job.priority]}>
                    {job.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.salaryRange || '-'}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {job.dateApplied ? new Date(job.dateApplied).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(job.jobUrl, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </motion.tr>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-14 text-center text-muted-foreground">
                  No jobs match your current filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
