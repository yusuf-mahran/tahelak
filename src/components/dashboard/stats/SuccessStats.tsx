import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardContainer from '../../shared/CardContainer';

interface StatItem {
  label: string;
  value: number;
  color: string;
}

const stats: StatItem[] = [
  { label: 'Completed Appointments', value: 75, color: 'bg-success' },
  { label: 'Cancelled Appointments', value: 15, color: 'bg-yellow-500' },
  { label: 'No-shows', value: 10, color: 'bg-destructive' },
];

export function SuccessStats() {
  return (
    <CardContainer className="h-full">
      <CardHeader className="flex flex-row items-center justify-between border-b border-b-border mb-4 py-4">
        <CardTitle className="text-lg font-bold">Success Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {stats.map((stat, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">{stat.label}</span>
              <span className="text-foreground">{stat.value}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                style={{ width: `${stat.value}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </CardContainer>
  );
}
