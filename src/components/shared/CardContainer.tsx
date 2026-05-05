import { cn } from '@/lib/utils';
import { Card } from '../ui';

export default function CardContainer({
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <Card
      className={cn(`relative group overflow-hidden ${props.className || ''}`)}
      {...props}
    >
      {children}
    </Card>
  );
}
