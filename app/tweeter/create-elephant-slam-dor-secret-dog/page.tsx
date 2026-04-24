"use client";
import { useState, useEffect } from "react";
import { cn } from "@/app/_utils/lib/helper";
import { createClient } from "@utils/supabase/client";
import { Tweet } from "@/app/_components/Tweet";
export default function RegiePage() {
  const supabase = createClient();

  const [tweets, setTweets] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("SLAM_DOR_OFFICIEL");
  const [publicationDelay, setPublicationDelay] = useState(0);

  const updatePublicationDelay = (value: string) => {
    const parsedValue = Number(value);

    if (!isNaN(parsedValue) && parsedValue >= 0) {
      setPublicationDelay(parsedValue);
    }
  };

  const fetchTweets = async () => {
    const { data } = await supabase
      .from("slam-lord-tweets")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setTweets(data);
  };

  useEffect(() => {
    fetchTweets();
    const channel = supabase
      .channel("all_tweets")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "slam-lord-tweets" },
        () => {
          fetchTweets();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;

    await supabase.from("slam-lord-tweets").insert({
      content,
      author,
      is_published: false,
    });

    setContent("");
    fetchTweets();
  };

  const publish = async (id: string) => {
    await supabase
      .from("slam-lord-tweets")
      .update({ is_published: true, published_date: new Date().toISOString() })
      .eq("id", id);
    fetchTweets();
  };

  const publishLater = async (id: string, minutes: number) => {
    const scheduledDate = new Date();
    scheduledDate.setMinutes(scheduledDate.getMinutes() + minutes);

    await supabase
      .from("slam-lord-tweets")
      .update({
        is_published: true,
        published_date: scheduledDate.toISOString(),
      })
      .eq("id", id);

    fetchTweets();
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-4 md:p-10 font-bold text-black">
      <h1 className="text-4xl font-black uppercase italic mb-10 border-b-4 border-black inline-block">
        Régie Directe
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl mb-6 uppercase italic">Nouveau Message</h2>
          <form onSubmit={addDraft} className="space-y-4">
            <div>
              <label className="block text-sm uppercase mb-1">Auteur</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border-2 border-black p-2 focus:bg-yellow-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm uppercase mb-1">Contenu</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border-2 border-black p-2 h-32 focus:bg-blue-100 outline-none"
                placeholder="C'était un tout petit péno dans le tout petit chien... "
              />
            </div>
            <button className="w-full bg-black text-white p-4 uppercase hover:bg-zinc-800 active:translate-y-1">
              Enregistrer en brouillon
            </button>
          </form>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl uppercase italic border-l-8 border-orange-500 pl-4">
            Feed en direct
          </h2>

          {tweets.map((t) => (
            <div key={t.id} className="relative group">
              <div
                className={cn(!t.is_published && "opacity-60 grayscale-[50%]")}
              >
                <Tweet tweet={t} isFirst={false} />
              </div>

              {!t.is_published && (
                <div className="absolute bottom-2 right-2 flex flex-col   w-20 gap-4">
                  <input
                    value={publicationDelay}
                    onChange={(e) => updatePublicationDelay(e.target.value)}
                    placeholder="0"
                    className=" border-2 border-black p-1 focus:bg-yellow-200 outline-none"
                  />{" "}
                  <button
                    onClick={() => publishLater(t.id, publicationDelay)}
                    className=" bg-green-500 border-2 border-black p-1 font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-sm uppercase"
                  >
                    Publier
                  </button>
                </div>
              )}

              {t.is_published && (
                <div className="absolute bottom-2 right-2 bg-black text-green px-2 py-1 text-[10px] uppercase">
                  En ligne
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
