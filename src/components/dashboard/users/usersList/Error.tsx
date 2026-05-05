import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TypographyP } from '@/components/ui/typography';
import CardContainer from '@/components/shared/CardContainer';

interface ErrorProps {
  usersError?: string | null;
}

export default function Error({ usersError }: ErrorProps) {
  return (
    <CardContainer className="h-full min-h-96 flex flex-col items-center justify-center p-10 text-center">
      <div className="p-4 bg-destructive/10 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <TypographyP className="font-bold text-destructive m-0">
        Failed to load users
      </TypographyP>
      <TypographyP className="text-sm text-muted-foreground mt-1">
        {usersError ||
          'An unexpected error occurred while fetching the users list.'}
      </TypographyP>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => window.location.reload()}
      >
        Try Again
      </Button>
    </CardContainer>
  );
}
