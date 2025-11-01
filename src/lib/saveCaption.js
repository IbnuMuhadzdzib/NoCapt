import { supabase } from "./supabase";

export async function saveCaption({ user, caption, imageUrl, selectedTags }) {
  const { data, error } = await supabase.from("captions").insert([
    {
      user_id: user.id,
      caption: caption,
      image_url: imageUrl,
      tags: selectedTags
    },
  ])
  .select();

  if (error) {
    console.error("Insert error:", error);
    throw error;
  } else document.getElementById("tagModal").close();

  console.log("Insert success:", data);
  return data;
}
