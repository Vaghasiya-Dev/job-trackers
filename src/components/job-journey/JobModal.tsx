'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Job, JobStatus, Priority } from '@/store/job-store';

interface JobModalProps {
  isOpen: boolean;
  editingJob: Job | null;
  onClose: () => void;
  onSave: (job: Omit<Job, 'id' | 'dateCreated' | 'dateUpdated'>) => void;
  onUpdate: (id: string, updates: Partial<Job>) => void;
}

const statusOptions: { value: JobStatus; label: string }[] = [
  { value: 'wishlist', label: 'Wishlist' },
  { value: 'applied', label: 'Applied' },
  { value: 'phone-screen', label: 'Phone Screen' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const getInitialFormData = (editingJob: Job | null) => {
  if (editingJob) {
    return {
      companyName: editingJob.companyName,
      jobTitle: editingJob.jobTitle,
      jobUrl: editingJob.jobUrl,
      status: editingJob.status,
      priority: editingJob.priority,
      salaryRange: editingJob.salaryRange || '',
      notes: editingJob.notes || '',
      dateApplied: editingJob.dateApplied,
      interviewDate: editingJob.interviewDate || '',
    };
  }
  return {
    companyName: '',
    jobTitle: '',
    jobUrl: '',
    status: 'wishlist' as JobStatus,
    priority: 'medium' as Priority,
    salaryRange: '',
    notes: '',
    dateApplied: '',
    interviewDate: '',
  };
};

function JobFormContent({ 
  editingJob, 
  onClose, 
  onSave, 
  onUpdate 
}: { 
  editingJob: Job | null;
  onClose: () => void;
  onSave: (job: Omit<Job, 'id' | 'dateCreated' | 'dateUpdated'>) => void;
  onUpdate: (id: string, updates: Partial<Job>) => void;
}) {
  const [formData, setFormData] = useState(() => getInitialFormData(editingJob));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingJob) {
      onUpdate(editingJob.id, formData);
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="e.g., Google"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job Title *</Label>
          <Input
            id="jobTitle"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            placeholder="e.g., Senior Engineer"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="jobUrl">Job URL *</Label>
        <Input
          id="jobUrl"
          type="url"
          value={formData.jobUrl}
          onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value: JobStatus) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select
            value={formData.priority}
            onValueChange={(value: Priority) => setFormData({ ...formData, priority: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salaryRange">Salary Range</Label>
          <Input
            id="salaryRange"
            value={formData.salaryRange}
            onChange={(e) => setFormData({ ...formData, salaryRange: e.target.value })}
            placeholder="e.g., $150k - $200k"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateApplied">Date Applied</Label>
          <Input
            id="dateApplied"
            type="date"
            value={formData.dateApplied}
            onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="interviewDate">Interview Date</Label>
        <Input
          id="interviewDate"
          type="date"
          value={formData.interviewDate}
          onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Add any notes about this application..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {editingJob ? 'Update Job' : 'Add Job'}
        </Button>
      </div>
    </form>
  );
}

export function JobModal({ isOpen, editingJob, onClose, onSave, onUpdate }: JobModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-bold">
            {editingJob ? 'Edit Job Application' : 'Add New Job'}
          </DialogTitle>
        </DialogHeader>
        
        {isOpen && (
          <JobFormContent
            key={editingJob?.id || 'new'}
            editingJob={editingJob}
            onClose={onClose}
            onSave={onSave}
            onUpdate={onUpdate}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
