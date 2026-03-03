'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Clock,
  Calendar,
  TrendingUp,
  Target,
  Award,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { StatCard } from './StatCard';
import { ActivityFeed } from './ActivityFeed';
import { UpcomingEvents } from './UpcomingEvents';
import { useJobStore } from '@/store/job-store';
import { useAuthStore } from '@/store/auth-store';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const router = useRouter();
  const { toast } = useToast();

  const total = useJobStore((state) => state.jobs.length);
  const pending = useJobStore((state) =>
    state.jobs.filter((j) => ['applied', 'phone-screen', 'interview'].includes(j.status)).length
  );
  const interviews = useJobStore((state) => state.jobs.filter((j) => j.status === 'interview').length);
  const offers = useJobStore((state) => state.jobs.filter((j) => j.status === 'offer').length);

  const activities = useJobStore((state) => state.activities);
  const upcomingEvents = useJobStore((state) => state.upcomingEvents);

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

  const userName = user?.name || user?.email?.split('@')[0] || 'there';

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      clearUser();
      toast({
        title: 'Success',
        description: 'Logged out successfully',
      });
      router.push('/login');
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 bg-[radial-gradient(circle_at_1px_1px,oklch(0.85_0.01_260/.45)_1px,transparent_1px)] bg-[length:22px_22px] p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border/70 bg-gradient-to-br from-background via-background to-secondary/45 p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {getGreeting()}, {userName}!
            </h1>
            <p className="mt-1 text-muted-foreground">{formatDate()}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-2 text-success">
              {offers > 0 ? <Award className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              <span className="text-sm font-medium">
                {offers > 0 ? `${offers} Offer${offers > 1 ? 's' : ''} Received` : 'Pipeline in Progress'}
              </span>
            </div>
            <Button variant="outline" className="gap-2" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Applications" value={total} icon={Briefcase} color="primary" />
        <StatCard
          title="Pending Response"
          value={pending}
          icon={Clock}
          trend={`${pending} active conversation${pending === 1 ? '' : 's'}`}
          color="warning"
        />
        <StatCard
          title="Interviews Scheduled"
          value={interviews}
          icon={Calendar}
          trend={interviews > 0 ? `${interviews} in pipeline` : 'No interviews yet'}
          color="accent"
        />
        <StatCard title="Offers Received" value={offers} icon={TrendingUp} color="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border border-border/70 bg-gradient-to-r from-primary/10 via-card/90 to-accent/10 p-6 shadow-sm"
      >
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <Target className="h-5 w-5 text-primary" />
          Job Search Tips
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-card/90 p-4">
            <p className="text-sm font-medium">Follow-up Strategy</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Send a thank-you email within 24 hours of any interview.
            </p>
          </div>
          <div className="rounded-xl border bg-card/90 p-4">
            <p className="text-sm font-medium">Application Volume</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Aim for 5-10 quality applications per week for best results.
            </p>
          </div>
          <div className="rounded-xl border bg-card/90 p-4">
            <p className="text-sm font-medium">Response Rate</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Consistency beats volume. Keep a weekly cadence and track every follow-up.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
