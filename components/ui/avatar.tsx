import { cn } from "@/app/_utils/lib/helper";
import Image from "next/image";

export const Avatar = ({ name }: { name: string }) => {
  const imageUrl = `https://i.pravatar.cc/150?u=${name}`;

  return (
    <div
      className={cn(
        "relative h-12 w-12 shrink-0 overflow-hidden rounded-full",
        "border-2 border-orange-400 bg-orange-500",
      )}
    >
      <Image
        src={imageUrl}
        alt={`Portrait de ${name}`}
        fill
        className="object-cover"
        unoptimized // Important car l'image change à chaque requête sur ce site
      />

      {/* Fallback au cas où l'image met du temps à charger */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center font-black text-black">
        {name[0].toUpperCase()}
      </div>
    </div>
  );
};
