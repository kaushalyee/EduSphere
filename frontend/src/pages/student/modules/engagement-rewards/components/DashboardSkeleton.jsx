export default function DashboardSkeleton() {
  return (
    <div className="min-h-full bg-transparent">
      <div className="mx-auto grid max-w-[1700px] auto-rows-min grid-cols-1 gap-6 pb-10 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
        <div className="h-[280px] animate-pulse rounded-[12px] bg-[#e5e7eb] lg:col-span-2 xl:col-span-3" />
        <div className="h-[280px] animate-pulse rounded-[12px] bg-[#e5e7eb] lg:col-span-1 xl:col-span-1" />
        <div className="h-[220px] animate-pulse rounded-[12px] bg-[#e5e7eb] lg:col-span-2 xl:col-span-2" />
        <div className="grid gap-3 lg:col-span-1 xl:col-span-1 xl:col-start-3">
          <div className="h-[120px] animate-pulse rounded-[12px] bg-[#e5e7eb]" />
          <div className="h-[120px] animate-pulse rounded-[12px] bg-[#e5e7eb]" />
          <div className="h-[120px] animate-pulse rounded-[12px] bg-[#e5e7eb]" />
        </div>
        <div className="h-[260px] animate-pulse rounded-[12px] bg-[#e5e7eb] lg:col-span-1 xl:col-span-1" />
        <div className="grid h-[420px] grid-cols-1 gap-6 lg:col-span-1 lg:grid-cols-2 xl:col-span-2 xl:gap-8">
          <div className="h-full animate-pulse rounded-[12px] bg-[#e5e7eb]" />
          <div className="h-full animate-pulse rounded-[12px] bg-[#e5e7eb]" />
        </div>
        <div className="h-[300px] animate-pulse rounded-[12px] bg-[#e5e7eb] lg:col-span-1 xl:col-span-1" />
      </div>
    </div>
  );
}
