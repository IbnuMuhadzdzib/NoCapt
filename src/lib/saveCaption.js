import { supabase } from "./supabase";

export async function saveCaption({ user, caption, imageUrl }) {
  const { data, error } = await supabase.from("captions").insert([
    {
      user_id: user.id,
      caption: caption,
      image_url: imageUrl,
    },
  ]);

  if (error) {
    console.error("Insert error:", error);
    throw error;
  }

  console.log("Insert success:", data);
  return data;
}
