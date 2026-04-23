"use client";
import { useEffect, useState } from "react";
import { createClient } from "@utils/supabase/client";
import { Tweet } from "@/app/_components/Tweet";

export default function PublicFeed() {
  const supabase = createClient();

  const [tweets, setTweets] = useState<any[]>([]);

  const loadTweets = async () => {
    const { data } = await supabase
      .from("slam-lord-tweets")
      .select("*")
      .order("published_date", { ascending: false })
      .eq("is_published", true);
    if (data) setTweets(data);
  };

  useEffect(() => {
    loadTweets();

    const channel = supabase
      .channel("public_tweets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "slam-lord-tweets" },
        () => {
          loadTweets();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans">
      <header className="sticky top-0 bg-black/80 backdrop-blur-md py-4 border-b border-zinc-800 mb-6">
        <h1 className="text-2xl font-black tracking-tighter text-orange-500 italic">
          Slam d'or 2026
        </h1>
      </header>

      <div className="max-w-xl mx-auto space-y-6">
        {tweets.map((t, i) => (
          <Tweet key={t.id} tweet={t} isFirst={i === 0} />
        ))}
      </div>
    </div>
  );
}
