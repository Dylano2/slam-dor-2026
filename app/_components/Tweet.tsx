import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "../_utils/lib/helper";
import { Avatar } from "@/components/ui/avatar";

export type Tweet = {
  author: string;
  published_date: Date;
  content: string;
  image_url?: string;
};

export function Tweet({
  tweet,
  isFirst = false,
}: {
  tweet: Tweet;
  isFirst: boolean;
}) {
  const imagePath = tweet.image_url ? `/assets/${tweet.image_url}.png` : null;
  return (
    <Card className=" md:py-3 shadow-[8px_8px_0px_0px_var(--shadow-color)]  rounded-xl animate-in fade-in gap-1 slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="text-zinc-100 font-bold flex md:flex-row flex-col justify-between">
          <div className="flex gap-2 items-center">
            <Avatar name={tweet.author} />@{tweet.author}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <p>{tweet.content}</p>
        {imagePath && (
          <div className="mt-4 border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_black]">
            <img
              src={imagePath}
              alt="Contenu du tweet"
              className="w-full h-auto object-cover  transition-all duration-500"
            />
          </div>
        )}
        <span
          className={cn(
            " self-end-safe",
            " font-medium",
            isFirst ? "text-green-500" : "text-zinc-400",
          )}
        >
          •
          {tweet.published_date
            ? new Date(tweet.published_date).toLocaleString("fr-FR", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : ""}
        </span>
      </CardContent>
    </Card>
  );
}
