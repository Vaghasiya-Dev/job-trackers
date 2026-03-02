'use client';

import { motion } from 'framer-motion';
import { format, isToday, isTomorrow } from 'date-fns';
import { Calendar, Phone, Clock, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UpcomingEvent } from '@/store/job-store';

interface UpcomingEventsProps {
  events: UpcomingEvent[];
}

const eventIcons = {
  interview: Calendar,
  'phone-screen': Phone,
  'follow-up': MessageSquare,
};

const eventColors = {
  interview: 'bg-accent/10 text-accent',
  'phone-screen': 'bg-warning/10 text-warning',
  'follow-up': 'bg-primary/10 text-primary',
};

const eventLabels = {
  interview: 'Interview',
  'phone-screen': 'Phone Screen',
  'follow-up': 'Follow-up',
};

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {events.map((event, index) => {
              const Icon = eventIcons[event.type];
              const iconColor = eventColors[event.type];
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl border bg-card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${iconColor}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium truncate">
                          {event.jobTitle}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {eventLabels[event.type]}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {event.companyName}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatEventDate(event.date)}</span>
                        {event.time && (
                          <>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{event.time}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
            {events.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No upcoming events
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
