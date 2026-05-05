import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectAdvisorLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-8">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="p-8 rounded-2xl border border-border/50 space-y-5">
        <Skeleton className="h-6 w-3/4" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
        <Skeleton className="h-10 w-32 ml-auto rounded-lg" />
      </div>
    </div>
  );
}
