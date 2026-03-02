import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type JobStatus = 'wishlist' | 'applied' | 'phone-screen' | 'interview' | 'offer' | 'rejected';
export type Priority = 'high' | 'medium' | 'low';

export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  jobUrl: string;
  status: JobStatus;
  priority: Priority;
  salaryRange?: string;
  notes?: string;
  dateApplied: string;
  dateCreated: string;
  dateUpdated: string;
  interviewDate?: string;
  logoUrl?: string;
}

export interface Activity {
  id: string;
  type: 'created' | 'updated' | 'status_change' | 'interview_scheduled';
  jobId: string;
  jobTitle: string;
  companyName: string;
  description: string;
  timestamp: string;
}

export interface UpcomingEvent {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  type: 'interview' | 'phone-screen' | 'follow-up';
  date: string;
  time?: string;
}

interface JobStore {
  jobs: Job[];
  activities: Activity[];
  upcomingEvents: UpcomingEvent[];
  currentView: 'landing' | 'dashboard' | 'jobs' | 'analytics';
  viewMode: 'kanban' | 'list';
  editingJob: Job | null;
  isModalOpen: boolean;
  
  // Actions
  setCurrentView: (view: 'landing' | 'dashboard' | 'jobs' | 'analytics') => void;
  setViewMode: (mode: 'kanban' | 'list') => void;
  openModal: (job?: Job) => void;
  closeModal: () => void;
  
  addJob: (job: Omit<Job, 'id' | 'dateCreated' | 'dateUpdated'>) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  updateJobStatus: (id: string, status: JobStatus) => void;
  
  getJobsByStatus: (status: JobStatus) => Job[];
  getStats: () => {
    total: number;
    pending: number;
    interviews: number;
    offers: number;
    wishlist: number;
    applied: number;
    phoneScreen: number;
    rejected: number;
  };
}

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 11);

// Mock data with 10 sample jobs
const mockJobs: Job[] = [
  {
    id: generateId(),
    companyName: 'Google',
    jobTitle: 'Senior Software Engineer',
    jobUrl: 'https://careers.google.com/jobs/123',
    status: 'interview',
    priority: 'high',
    salaryRange: '$180k - $250k',
    notes: 'Technical interview scheduled. Focus on system design and algorithms.',
    dateApplied: '2025-01-10',
    dateCreated: '2025-01-08',
    dateUpdated: '2025-01-15',
    interviewDate: '2025-01-22',
    logoUrl: 'https://logo.clearbit.com/google.com',
  },
  {
    id: generateId(),
    companyName: 'Microsoft',
    jobTitle: 'Full Stack Developer',
    jobUrl: 'https://careers.microsoft.com/jobs/456',
    status: 'phone-screen',
    priority: 'high',
    salaryRange: '$150k - $200k',
    notes: 'Initial phone screen with recruiter. Discuss Azure experience.',
    dateApplied: '2025-01-12',
    dateCreated: '2025-01-11',
    dateUpdated: '2025-01-14',
    logoUrl: 'https://logo.clearbit.com/microsoft.com',
  },
  {
    id: generateId(),
    companyName: 'Amazon',
    jobTitle: 'Frontend Engineer',
    jobUrl: 'https://amazon.jobs/jobs/789',
    status: 'applied',
    priority: 'medium',
    salaryRange: '$140k - $180k',
    notes: 'Applied through referral. Expecting LP questions.',
    dateApplied: '2025-01-14',
    dateCreated: '2025-01-14',
    dateUpdated: '2025-01-14',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
  },
  {
    id: generateId(),
    companyName: 'Stripe',
    jobTitle: 'Staff Engineer',
    jobUrl: 'https://stripe.com/jobs/101',
    status: 'offer',
    priority: 'high',
    salaryRange: '$220k - $300k',
    notes: 'Offer received! Negotiating equity package.',
    dateApplied: '2024-12-20',
    dateCreated: '2024-12-18',
    dateUpdated: '2025-01-16',
    logoUrl: 'https://logo.clearbit.com/stripe.com',
  },
  {
    id: generateId(),
    companyName: 'Netflix',
    jobTitle: 'Senior React Developer',
    jobUrl: 'https://jobs.netflix.com/jobs/202',
    status: 'wishlist',
    priority: 'medium',
    salaryRange: '$180k - $280k',
    notes: 'Dream company! Need to prepare portfolio.',
    dateApplied: '',
    dateCreated: '2025-01-15',
    dateUpdated: '2025-01-15',
    logoUrl: 'https://logo.clearbit.com/netflix.com',
  },
  {
    id: generateId(),
    companyName: 'Meta',
    jobTitle: 'Software Engineer III',
    jobUrl: 'https://careers.meta.com/jobs/303',
    status: 'rejected',
    priority: 'high',
    salaryRange: '$170k - $230k',
    notes: 'Rejected after final round. Feedback: need more distributed systems experience.',
    dateApplied: '2024-12-05',
    dateCreated: '2024-12-03',
    dateUpdated: '2025-01-10',
    logoUrl: 'https://logo.clearbit.com/meta.com',
  },
  {
    id: generateId(),
    companyName: 'Airbnb',
    jobTitle: 'Full Stack Engineer',
    jobUrl: 'https://careers.airbnb.com/jobs/404',
    status: 'applied',
    priority: 'medium',
    salaryRange: '$160k - $210k',
    notes: 'Great culture. Focus on React and Ruby on Rails.',
    dateApplied: '2025-01-13',
    dateCreated: '2025-01-13',
    dateUpdated: '2025-01-13',
    logoUrl: 'https://logo.clearbit.com/airbnb.com',
  },
  {
    id: generateId(),
    companyName: 'Spotify',
    jobTitle: 'Frontend Developer',
    jobUrl: 'https://www.lifeatspotify.com/jobs/505',
    status: 'wishlist',
    priority: 'low',
    salaryRange: '$130k - $170k',
    notes: 'Music streaming experience would be great.',
    dateApplied: '',
    dateCreated: '2025-01-16',
    dateUpdated: '2025-01-16',
    logoUrl: 'https://logo.clearbit.com/spotify.com',
  },
  {
    id: generateId(),
    companyName: 'Shopify',
    jobTitle: 'Senior Developer',
    jobUrl: 'https://www.shopify.com/careers/606',
    status: 'phone-screen',
    priority: 'medium',
    salaryRange: '$145k - $190k',
    notes: 'Phone screen scheduled with engineering manager.',
    dateApplied: '2025-01-08',
    dateCreated: '2025-01-07',
    dateUpdated: '2025-01-17',
    interviewDate: '2025-01-20',
    logoUrl: 'https://logo.clearbit.com/shopify.com',
  },
  {
    id: generateId(),
    companyName: 'Notion',
    jobTitle: 'Product Engineer',
    jobUrl: 'https://www.notion.so/careers/707',
    status: 'interview',
    priority: 'high',
    salaryRange: '$165k - $220k',
    notes: 'Take-home assignment completed. Awaiting feedback.',
    dateApplied: '2025-01-05',
    dateCreated: '2025-01-04',
    dateUpdated: '2025-01-18',
    interviewDate: '2025-01-23',
    logoUrl: 'https://logo.clearbit.com/notion.so',
  },
];

// Mock activities
const mockActivities: Activity[] = [
  {
    id: generateId(),
    type: 'status_change',
    jobId: mockJobs[0].id,
    jobTitle: mockJobs[0].jobTitle,
    companyName: mockJobs[0].companyName,
    description: 'Status changed to Interview',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateId(),
    type: 'interview_scheduled',
    jobId: mockJobs[0].id,
    jobTitle: mockJobs[0].jobTitle,
    companyName: mockJobs[0].companyName,
    description: 'Interview scheduled for Jan 22',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateId(),
    type: 'created',
    jobId: mockJobs[7].id,
    jobTitle: mockJobs[7].jobTitle,
    companyName: mockJobs[7].companyName,
    description: 'Added to Wishlist',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateId(),
    type: 'status_change',
    jobId: mockJobs[3].id,
    jobTitle: mockJobs[3].jobTitle,
    companyName: mockJobs[3].companyName,
    description: 'Received an Offer! 🎉',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: generateId(),
    type: 'updated',
    jobId: mockJobs[8].id,
    jobTitle: mockJobs[8].jobTitle,
    companyName: mockJobs[8].companyName,
    description: 'Phone screen scheduled',
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock upcoming events
const mockUpcomingEvents: UpcomingEvent[] = [
  {
    id: generateId(),
    jobId: mockJobs[8].id,
    jobTitle: mockJobs[8].jobTitle,
    companyName: mockJobs[8].companyName,
    type: 'phone-screen',
    date: '2025-01-20',
    time: '10:00 AM',
  },
  {
    id: generateId(),
    jobId: mockJobs[0].id,
    jobTitle: mockJobs[0].jobTitle,
    companyName: mockJobs[0].companyName,
    type: 'interview',
    date: '2025-01-22',
    time: '2:00 PM',
  },
  {
    id: generateId(),
    jobId: mockJobs[9].id,
    jobTitle: mockJobs[9].jobTitle,
    companyName: mockJobs[9].companyName,
    type: 'interview',
    date: '2025-01-23',
    time: '11:00 AM',
  },
  {
    id: generateId(),
    jobId: mockJobs[1].id,
    jobTitle: mockJobs[1].jobTitle,
    companyName: mockJobs[1].companyName,
    type: 'follow-up',
    date: '2025-01-25',
  },
];

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      jobs: mockJobs,
      activities: mockActivities,
      upcomingEvents: mockUpcomingEvents,
      currentView: 'landing',
      viewMode: 'kanban',
      editingJob: null,
      isModalOpen: false,

      setCurrentView: (view) => set({ currentView: view }),
      setViewMode: (mode) => set({ viewMode: mode }),
      
      openModal: (job) => set({ isModalOpen: true, editingJob: job || null }),
      closeModal: () => set({ isModalOpen: false, editingJob: null }),

      addJob: (jobData) => {
        const newJob: Job = {
          ...jobData,
          id: generateId(),
          dateCreated: new Date().toISOString(),
          dateUpdated: new Date().toISOString(),
        };
        
        const newActivity: Activity = {
          id: generateId(),
          type: 'created',
          jobId: newJob.id,
          jobTitle: newJob.jobTitle,
          companyName: newJob.companyName,
          description: `Added to ${newJob.status.replace('-', ' ')}`,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          jobs: [newJob, ...state.jobs],
          activities: [newActivity, ...state.activities],
        }));
      },

      updateJob: (id, updates) => {
        set((state) => ({
          jobs: state.jobs.map((job) =>
            job.id === id
              ? { ...job, ...updates, dateUpdated: new Date().toISOString() }
              : job
          ),
        }));
      },

      deleteJob: (id) => {
        set((state) => ({
          jobs: state.jobs.filter((job) => job.id !== id),
        }));
      },

      updateJobStatus: (id, status) => {
        const job = get().jobs.find((j) => j.id === id);
        if (!job) return;

        const newActivity: Activity = {
          id: generateId(),
          type: 'status_change',
          jobId: id,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          description: `Status changed to ${status.replace('-', ' ')}`,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.id === id
              ? { ...j, status, dateUpdated: new Date().toISOString() }
              : j
          ),
          activities: [newActivity, ...state.activities],
        }));
      },

      getJobsByStatus: (status) => {
        return get().jobs.filter((job) => job.status === status);
      },

      getStats: () => {
        const jobs = get().jobs;
        return {
          total: jobs.length,
          wishlist: jobs.filter((j) => j.status === 'wishlist').length,
          applied: jobs.filter((j) => j.status === 'applied').length,
          phoneScreen: jobs.filter((j) => j.status === 'phone-screen').length,
          interviews: jobs.filter((j) => j.status === 'interview').length,
          offers: jobs.filter((j) => j.status === 'offer').length,
          rejected: jobs.filter((j) => j.status === 'rejected').length,
          pending: jobs.filter((j) => ['applied', 'phone-screen', 'interview'].includes(j.status)).length,
        };
      },
    }),
    {
      name: 'job-journey-storage',
      partialize: (state) => ({
        jobs: state.jobs,
        activities: state.activities,
        upcomingEvents: state.upcomingEvents,
      }),
    }
  )
);
