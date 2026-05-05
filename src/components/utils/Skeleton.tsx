export default function Skeleton({
  width = 'full',
  height = 6,
  rounded = 'md',
  className = '',
}: {
  width?: number | string;
  height?: number;
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}) {
  return (
    <div
      className={`w-${width} h-${height} bg-muted rounded-${rounded} ${className}`}
    ></div>
  );
}
