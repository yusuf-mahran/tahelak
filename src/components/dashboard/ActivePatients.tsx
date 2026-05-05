import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography';
import { Badge } from '@/components/ui/badge';
import { User, Activity, Clock } from 'lucide-react';

interface ActivePatientsProps {
  count: number;
}

export function ActivePatients({ count }: ActivePatientsProps) {
  // Mock data for individual patients to make it look "stunning"
  const recentPatients = [
    {
      id: 1,
      name: 'Ahmad Al-Farsi',
      status: 'In Consultation',
      time: '10m ago',
    },
    { id: 2, name: 'Sara Johnson', status: 'Waiting', time: '25m ago' },
    { id: 3, name: 'Mohammed Ali', status: 'Post-Op', time: '1h ago' },
  ];

  return (
    <Card className="border-none shadow-sm h-full bg-linear-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Active Patients
          </CardTitle>
          <CardDescription>Current patient load</CardDescription>
        </div>
        <div className="px-3 py-1 bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-500/20">
          {count}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {recentPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-muted/20 border border-blue-100 dark:border-blue-900/30 shadow-sm transition-all hover:translate-x-1"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <TypographyP className="text-sm font-bold m-0 leading-none">
                    {patient.name}
                  </TypographyP>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    <Clock className="h-3 w-3" />
                    {patient.time}
                  </div>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="text-[10px] font-bold bg-blue-100/50 text-blue-700 hover:bg-blue-100/50"
              >
                {patient.status}
              </Badge>
            </div>
          ))}

          <button className="w-full py-2 mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest border-t border-dashed border-blue-200 dark:border-blue-800">
            View All Active Cases
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
