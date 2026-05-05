import { GraduationCap } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <GraduationCap className="absolute inset-0 m-auto h-5 w-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground tracking-wide">Loading…</p>
      </div>
    </div>
  );
}
