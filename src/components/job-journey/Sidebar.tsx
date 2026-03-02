'use client';

import { motion } from 'framer-motion';
import { 
  Home, 
  Briefcase, 
  BarChart3, 
  Plus,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useJobStore } from '@/store/job-store';

interface SidebarProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'jobs' | 'analytics') => void;
  onAddJob: () => void;
}

export function Sidebar({ onNavigate, onAddJob }: SidebarProps) {
  const currentView = useJobStore((state) => state.currentView);
  
  const pending = useJobStore((state) =>
    state.jobs.filter((j) => ['applied', 'phone-screen', 'interview'].includes(j.status)).length
  );
  const interviews = useJobStore((state) =>
    state.jobs.filter((j) => j.status === 'interview').length
  );
  const offers = useJobStore((state) =>
    state.jobs.filter((j) => j.status === 'offer').length
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jobs', label: 'Job Board', icon: Briefcase },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  const quickStats = [
    { label: 'Pending', value: pending, icon: Clock },
    { label: 'Interviews', value: interviews, icon: Target },
    { label: 'Offers', value: offers, icon: TrendingUp },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <Button className="w-full gap-2" onClick={onAddJob}>
          <Plus className="w-4 h-4" />
          Add New Job
        </Button>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant={currentView === item.id ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3"
                onClick={() => onNavigate(item.id)}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </motion.div>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="p-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">Quick Stats</h4>
        <div className="space-y-2">
          {quickStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <stat.icon className="w-4 h-4" />
                {stat.label}
              </div>
              <span className="font-medium">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
