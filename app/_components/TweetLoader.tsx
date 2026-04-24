import { useEffect, useState } from "react";
import { cn } from "@/app/_utils/lib/helper";
import { Skeleton } from "@/components/ui/skeleton";

export function TweetLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // On crée un intervalle qui monte jusqu'à 100% en 10 secondes
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1; // On avance de 1%
      });
    }, 100); // 100ms * 100 = 10 000ms (10s)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-black mb-8 p-6 border-[3px] border-white rounded-xl bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[80%]" />
      </div>

      <div className="relative h-6 w-full border-2 border-black bg-zinc-100 overflow-hidden">
        <div
          className="h-full bg-[#ADFF2F] border-r-2 border-black transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase italic">
          {progress < 100 ? `Ca arrive ... ${progress}%` : "TERMINÉ"}
        </span>
      </div>
    </div>
  );
}
