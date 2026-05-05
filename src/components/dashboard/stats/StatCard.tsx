import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypographyH3, TypographyP } from '@/components/ui/typography';
import CardContainer from '@/components/shared/CardContainer';

export default function StatCard({
  label,
  desc,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  desc: string;
  value: string | number;
  icon: React.ElementType<{ className?: string }>;
  color: string;
  bg: string;
}) {
  return (
    <CardContainer key={label} className="border-b-4 border-b-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </CardTitle>
        <div
          className={`p-2 rounded-lg ${bg} ${color} group-hover:scale-110 transition-transform`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <TypographyH3 className="text-3xl font-extrabold font-tomorrow tracking-tight capitalize truncate">
          {value}
        </TypographyH3>
        <div className="mt-4 pt-4 border-t border-border/50">
          <TypographyP className="text-[10px] text-muted-foreground italic font-medium">
            {desc}
          </TypographyP>
        </div>
      </CardContent>
    </CardContainer>
  );
}
