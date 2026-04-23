import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "../_utils/lib/helper";
import { Avatar } from "@/components/ui/avatar";

export type Tweet = {
  author: string;
  published_date: Date;
  content: string;
};

export function Tweet({
  tweet,
  isFirst = false,
}: {
  tweet: Tweet;
  isFirst: boolean;
}) {
  return (
    <Card className=" p-4 shadow-[8px_8px_0px_0px_var(--shadow-color)]  rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="text-zinc-100 font-bold flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar name={tweet.author}  />@{tweet.author}
          </div>
          <span
            className={cn(
              "text-sm",
              isFirst ? "text-green-500" : "text-zinc-500",
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{tweet.content}</p>
      </CardContent>
    </Card>
  );
}
