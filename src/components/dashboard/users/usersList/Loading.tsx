import CardContainer from '@/components/shared/CardContainer';
import { CardContent, CardHeader } from '@/components/ui';

export default function Loading() {
  return (
    <CardContainer className="h-full min-h-96 animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="h-8 w-8 bg-muted rounded-full" />
          </div>
        ))}
      </CardContent>
    </CardContainer>
  );
}
