'use client';

import { motion } from 'framer-motion';
import { ExternalLink, MoreVertical, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Job, Priority } from '@/store/job-store';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Job['status']) => void;
  isDragging?: boolean;
}

const priorityColors: Record<Priority, string> = {
  high: 'priority-high',
  medium: 'priority-medium',
  low: 'priority-low',
};

const statusBorders: Record<Job['status'], string> = {
  wishlist: 'status-wishlist',
  applied: 'status-applied',
  'phone-screen': 'status-phone-screen',
  interview: 'status-interview',
  offer: 'status-offer',
  rejected: 'status-rejected',
};

export function JobCard({ job, onEdit, onDelete, onStatusChange, isDragging }: JobCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Card className={`border-l-4 ${statusBorders[job.status]} bg-card/95 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-primary/25 to-accent/25 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {job.companyName.charAt(0)}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate">{job.jobTitle}</h3>
                <p className="text-sm text-muted-foreground truncate">{job.companyName}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(job)}>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(job.jobUrl, '_blank')}>
                  View Job <ExternalLink className="ml-2 h-3 w-3" />
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(job.id)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={priorityColors[job.priority]}>
              {job.priority}
            </Badge>
            {job.salaryRange && (
              <Badge variant="secondary" className="text-xs bg-secondary/70">
                <DollarSign className="h-3 w-3 mr-1" />
                {job.salaryRange}
              </Badge>
            )}
            {job.interviewDate && (
              <Badge variant="secondary" className="text-xs bg-secondary/70">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(job.interviewDate).toLocaleDateString()}
              </Badge>
            )}
          </div>

          {job.notes && (
            <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
              {job.notes}
            </p>
          )}

          {job.dateApplied && (
            <p className="text-xs text-muted-foreground mt-3">
              Applied: {new Date(job.dateApplied).toLocaleDateString()}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.status !== 'wishlist' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full border px-2 text-xs"
                onClick={() => onStatusChange(job.id, 'wishlist')}
              >
                Wishlist
              </Button>
            )}
            {job.status !== 'applied' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full border px-2 text-xs"
                onClick={() => onStatusChange(job.id, 'applied')}
              >
                Applied
              </Button>
            )}
            {job.status !== 'phone-screen' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full border px-2 text-xs"
                onClick={() => onStatusChange(job.id, 'phone-screen')}
              >
                Phone
              </Button>
            )}
            {job.status !== 'interview' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full border px-2 text-xs"
                onClick={() => onStatusChange(job.id, 'interview')}
              >
                Interview
              </Button>
            )}
            {job.status !== 'offer' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full border px-2 text-xs text-success"
                onClick={() => onStatusChange(job.id, 'offer')}
              >
                Offer
              </Button>
            )}
            {job.status !== 'rejected' && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 rounded-full border px-2 text-xs text-destructive"
                onClick={() => onStatusChange(job.id, 'rejected')}
              >
                Rejected
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
