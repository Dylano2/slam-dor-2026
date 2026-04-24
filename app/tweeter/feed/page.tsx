"use client";
import { useState, useEffect } from "react";
import { createClient } from "@utils/supabase/client";
import { TweetLoader } from "@/app/_components/TweetLoader";
import { Tweet } from "@/app/_components/Tweet";
import Image from "next/image";

export default function Feed() {
  const [tweets, setTweets] = useState<any[]>([]);
  const [pendingTweets, setPendingTweets] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const loadTweets = async () => {
    const now = new Date().toISOString();

    const { data } = await supabase
      .from("slam-lord-tweets")
      .select("*")
      .eq("is_published", true)
      .lte("published_date", now)
      .order("published_date", { ascending: false });

    if (data) setTweets(data);
  };

  useEffect(() => {
    loadTweets();

    // REALTIME LOGIC
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "slam-lord-tweets" },
        (payload: any) => {
          if (payload.eventType === "UPDATE" && payload.new.is_published) {
            const newTweetId = payload.new.id;

            setPendingTweets((prev) => new Set(prev).add(newTweetId));

            setTimeout(() => {
              setPendingTweets((prev) => {
                const next = new Set(prev);
                next.delete(newTweetId);
                return next;
              });
            }, 10000);
          }

          loadTweets();
        },
      )
      .subscribe();

    const interval = setInterval(loadTweets, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans">
      <header className="flex md:flex-row flex-col items-center sticky z-10 top-0 bg-black/80 backdrop-blur-md py-4 border-b border-zinc-800 mb-6">
        <Image
          className="border-b border-zinc-800 mb-4 md:border-0"
          src="/icon.png"
          alt="Slam d'or logo"
          width={300}
          height={300}
          priority
        />
        <h1 className="text-4xl font-black tracking-tighter text-orange-500">
          Feed d'actualité
        </h1>
      </header>
      <div className="max-w-xl mx-auto py-10 px-4 space-y-8">
        {tweets.map((t, i) => (
          <div key={t.id}>
            {pendingTweets.has(t.id) ? (
              <TweetLoader />
            ) : (
              <Tweet tweet={t} isFirst={i === 0} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
