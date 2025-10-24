import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function SavedPage({ user }) {
  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    if (!user) return; // guard

    const fetchCaptions = async () => {
      const { data, error } = await supabase
        .from("captions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) console.error(error.message);
      else setCaptions(data);
    };

    fetchCaptions();
  }, [user]);

  if (!user) return <p className="p-6 text-center">Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {captions.map((item) => (
        <div key={item.id} className="card bg-base-100 shadow-md p-4">
          {item.image_url && (
            <img
              src={item.image_url}
              alt="Saved"
              className="rounded-md mb-3"
            />
          )}
          <p className="text-sm">{item.caption}</p>
        </div>
      ))}
    </div>
  );
}
