import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { t } from "i18next";

export default function SavedPage({ user }) {
  const [captions, setCaptions] = useState([]);
  const [sortOption, setSortOption] = useState("newest");
  const [tagFilter, setTagFilter] = useState("");

  const tags = ["funny", "aesthetic", "sad", "motivational", "random"];
  
  useEffect(() => {
    if (!user) return; // guard

    const fetchCaptions = async () => {
      try {
        let query = supabase
        .from("captions")
        .select("*")
        .eq("user_id", user.id);

      if (tagFilter) {
        query = query.contains("tags", [tagFilter]);
      }

      query = query.order("created_at", { ascending: sortOption === "oldest" });

      const { data, error } = await query;
      if (error) console.error(error.message);
      else setCaptions(data);

      } catch (err) {
        console.error("Error fetching captions:", err.message);
      }
    };

    fetchCaptions();

    const channel = supabase
      .channel("public:captions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "captions" },
        (payload) => {
          console.log("New caption inserted:", payload.new);
          setCaptions((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
  }, [user, sortOption, tagFilter]);

  if (!user) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div>
        <h1>Saved Caption ({captions.length})</h1>
      </div>

  {/* Sort Section */}
  <div>
    <h2 className="text-sm font-medium mb-2">Sort by</h2>
    <div className="flex gap-3">
      <label className="label cursor-pointer gap-2">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={sortOption === "newest"}
          onChange={() => setSortOption("newest")}
        />
        <span className="label-text text-sm">Newest</span>
      </label>
      <label className="label cursor-pointer gap-2">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={sortOption === "oldest"}
          onChange={() => setSortOption("oldest")}
        />
        <span className="label-text text-sm">Oldest</span>
      </label>
    </div>
  </div>

  {/* Filter by Tags */}
  <div>
    <h2 className="text-sm font-medium mb-2">Filter by tag</h2>
    <div className="flex flex-wrap gap-2">
      <label className="label cursor-pointer gap-2">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={tagFilter === ""}
          onChange={() => setTagFilter("")}
        />
        <span className="label-text text-sm">All</span>
      </label>
      {tags.map((tag) => (
        <label key={tag} className="label cursor-pointer gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={tagFilter === tag}
            onChange={() => setTagFilter(tag)}
          />
          <span className="label-text text-sm">{tag}</span>
        </label>
      ))}
    </div>
  </div>

      {captions.length === 0 ? (
  <p className="text-center text-sm opacity-70 mt-4">
    {t("savedPage.noCaptions", "No saved captions yet.")}
  </p>
) : (
  <div className="mt-4 flex flex-col gap-3">
    {captions.map((item) => (
      <div
        key={item.id}
        className="p-3 bg-base-200 rounded-lg shadow-sm border border-base-300"
      >
        <img
          src={item.image_url}
          alt="caption image"
          className="w-full h-40 object-cover rounded-md mb-2"
        />
        <p className="text-sm mb-2">{item.caption}</p>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="badge badge-outline badge-sm capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
)}


</div>

  );
}
