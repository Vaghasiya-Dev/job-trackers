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
    <Card className="h-full border-border/70 bg-card/85 shadow-sm backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-5 w-5" />
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
                  className="rounded-xl border border-border/60 bg-card/90 p-3 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className={`rounded-lg p-2 ${iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium">{event.jobTitle}</p>
                        <Badge variant="outline" className="text-xs">
                          {eventLabels[event.type]}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{event.companyName}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatEventDate(event.date)}</span>
                        {event.time && (
                          <>
                            <span>&bull;</span>
                            <Clock className="h-3 w-3" />
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
              <div className="py-8 text-center text-sm text-muted-foreground">No upcoming events</div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
