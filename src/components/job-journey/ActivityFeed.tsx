'use client';

import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, Calendar, ArrowRight, CheckCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity } from '@/store/job-store';

interface ActivityFeedProps {
  activities: Activity[];
}

const activityIcons = {
  created: Plus,
  updated: ArrowRight,
  status_change: ArrowRight,
  interview_scheduled: Calendar,
};

const activityColors = {
  created: 'text-primary bg-primary/10',
  updated: 'text-accent bg-accent/10',
  status_change: 'text-warning bg-warning/10',
  interview_scheduled: 'text-success bg-success/10',
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity, index) => {
              const Icon = activityIcons[activity.type];
              const iconColor = activityColors[activity.type];
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className={`p-2 rounded-lg ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.jobTitle}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.companyName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            {activities.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No recent activity
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
