import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TypographyP } from '@/components/ui/typography';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReportItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  reporter: string;
  statusColor?: string;
}

export function HospitalReport({ reports }: { reports: ReportItem[] }) {
  return (
    <Card className="h-full border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Hospital Report</CardTitle>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-muted">{report.icon}</div>
              <div>
                <TypographyP className="font-semibold leading-none mb-1 text-foreground">
                  {report.title}
                </TypographyP>
                <p className="text-xs text-muted-foreground italic">
                  Reported by {report.reporter}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
