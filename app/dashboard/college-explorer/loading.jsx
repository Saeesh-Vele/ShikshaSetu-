import { Skeleton } from "@/components/ui/skeleton";

export default function CollegeExplorerLoading() {
  return (
    <div className="flex gap-4 h-[calc(100vh-8rem)]">
      <div className="w-80 shrink-0 space-y-3 p-4">
        <Skeleton className="h-9 w-full rounded-lg" />
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 p-4 rounded-xl border border-border/50">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
      <Skeleton className="flex-1 rounded-2xl" />
    </div>
  );
}
