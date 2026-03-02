'use client';

import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Clock, 
  Calendar, 
  TrendingUp,
  Target,
  Award
} from 'lucide-react';
import { StatCard } from './StatCard';
import { ActivityFeed } from './ActivityFeed';
import { UpcomingEvents } from './UpcomingEvents';
import { useJobStore } from '@/store/job-store';

export function Dashboard() {
  const total = useJobStore((state) => state.jobs.length);
  const pending = useJobStore((state) =>
    state.jobs.filter((j) => ['applied', 'phone-screen', 'interview'].includes(j.status)).length
  );
  const interviews = useJobStore((state) =>
    state.jobs.filter((j) => j.status === 'interview').length
  );
  const offers = useJobStore((state) =>
    state.jobs.filter((j) => j.status === 'offer').length
  );
  
  const activities = useJobStore((state) => state.activities);
  const upcomingEvents = useJobStore((state) => state.upcomingEvents);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {getGreeting()}, Alex! 👋
          </h1>
          <p className="text-muted-foreground mt-1">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success">
          <Award className="w-5 h-5" />
          <span className="text-sm font-medium">1 Offer Received!</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={total}
          icon={Briefcase}
          color="primary"
        />
        <StatCard
          title="Pending Response"
          value={pending}
          icon={Clock}
          trend="3 active conversations"
          color="warning"
        />
        <StatCard
          title="Interviews Scheduled"
          value={interviews}
          icon={Calendar}
          trend="2 this week"
          color="accent"
        />
        <StatCard
          title="Offers Received"
          value={offers}
          icon={TrendingUp}
          color="success"
        />
      </div>

      {/* Activity & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ActivityFeed activities={activities} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <UpcomingEvents events={upcomingEvents} />
        </motion.div>
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 border"
      >
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Job Search Tips
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-card">
            <p className="font-medium text-sm">Follow-up Strategy</p>
            <p className="text-xs text-muted-foreground mt-1">
              Send a thank-you email within 24 hours of any interview.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card">
            <p className="font-medium text-sm">Application Volume</p>
            <p className="text-xs text-muted-foreground mt-1">
              Aim for 5-10 quality applications per week for best results.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card">
            <p className="font-medium text-sm">Response Rate</p>
            <p className="text-xs text-muted-foreground mt-1">
              Your response rate is 40% - above the industry average!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
