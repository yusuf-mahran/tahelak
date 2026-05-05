import GridHeader from '@/components/shared/GridHeader';
import Sidebar from '@/components/shared/Sidebar';
import { RouteGuard } from '@/components/auth/RouteGuard';

export default function GridLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full grid lg:grid-cols-[16rem_1fr] md:grid-cols-[4rem_1fr] grid-rows-[auto_1fr] gap-4 justify-stretch">
      <RouteGuard />
      <aside className="w-full md:h-[calc(100dvh-9rem-1px)] shrink-0 md:border-e max-md:border-b border-border md:pe-4 max-md:py-4">
        <Sidebar />
      </aside>
      {/* Main content area */}
      <main className="max-h-[calc(100dvh-18rem-1px)] md:max-h-[calc(100dvh-9rem-1px)] md:flex-1 py-6">
        <article className="h-fit max-h-full bg-background rounded-lg overflow-auto shadow-sm border border-border/30 py-10 px-6">
          <div className="animate-in fade-in duration-500">
            <GridHeader />
            <main className="mt-10">{children}</main>
          </div>
        </article>
      </main>
    </div>
  );
}
