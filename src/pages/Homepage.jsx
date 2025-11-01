import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { saveCaption } from "../lib/saveCaption";
import { generateCaption } from "../lib/gemini";

// widgets & components
import ToggleTheme from "../widgets/ToggleTheme";
import Prompt from "../widgets/Prompt";
import Dropdown from "../components/Dropdown";
import SavedPage from "./SavedPage";
import TagModal from "../components/TagModal";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("");
  const [style, setStyle] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);


  const openTagModal = () => {
    document.getElementById("tagModal").showModal();
  };
  // cek user login
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate("/");
      else setUser(user);
    });
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) return console.error("Logout error:", error.message);
    setUser(null);
    navigate("/");
  };

  // generate caption
  const handleGenerate = async () => {
  if (!image) return;
  setLoading(true);
  try {
    const caption = await generateCaption(image, keyword, language, style);
    setResult(caption);
  } catch (err) {
    console.error(err);
    setResult("Terjadi kesalahan saat generate caption.");
  }
  setLoading(false);
};


  const handleSave = async () => {
  if (!user || !result) return;

  try {
    setSaving(true);
    console.log("Current user:", user);

    const fileName = `${Date.now()}-${image.name}`;
    console.log("Uploading file:", fileName);

    const { error: uploadError } = await supabase.storage
      .from("captions")
      .upload(fileName, image);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: publicUrl } = supabase.storage
      .from("captions")
      .getPublicUrl(fileName);

    console.log("Public URL:", publicUrl);

    const data = await saveCaption({
      user,
      caption: result,
      imageUrl: publicUrl.publicUrl,
      selectedTags,
    });

    console.log("Save success:", data);

    setImageUrl(publicUrl.publicUrl);
    alert("Caption berhasil disimpan!");
  } catch (err) {
    console.error("Save error:", err.message);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">{t("title")}</h1>
        <ToggleTheme />
      </header>

      <Dropdown>
        <li><button onClick={() => i18n.changeLanguage("id")}>🇮🇩 Indonesia</button></li>
        <li><button onClick={() => i18n.changeLanguage("en")}>🇬🇧 English</button></li>
      </Dropdown>

      <Prompt
        t={t}
        setImage={setImage}
        keyword={keyword}
        setKeyword={setKeyword}
        language={language}
        setLanguage={setLanguage}
        style={style}
        setStyle={setStyle}
        loading={loading}
        handleGenerate={handleGenerate}
      />

      {result && (
        <section className="mt-6 p-4 bg-base-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-2">
            {t("result.title", "Generated Caption")}
          </h2>
          <p className="text-sm leading-relaxed mb-4">{result}</p>
          <button
            onClick={openTagModal}
            className="btn btn-success"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Caption"}
          </button>

          {imageUrl && (
  <div className="mt-4 flex items-center gap-2">
    <button
      className="btn btn-outline btn-sm"
      onClick={() => navigator.clipboard.writeText(imageUrl)}
    >
      Copy Image Link
    </button>
    <a
      href={imageUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-outline btn-sm"
    >
      View Image
    </a>
  </div>
)}

        </section>
      )}

<TagModal
  user={user}
  image={image}
  result={result}
  setImageUrl={setImageUrl}
  selectedTags={selectedTags}
  setSelectedTags={setSelectedTags}
  onSave={handleSave}
/>

      <div className="drawer drawer-end">
  <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    {/* Page content here */}
    <label htmlFor="my-drawer-5" className="drawer-button btn btn-primary">Saved Content</label>
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="menu bg-base-200 min-h-full w-80 p-4">
      <SavedPage user={user} />
    </ul>
  </div>
</div>

      <footer className="pt-4 border-t border-base-300">
        <button
          onClick={handleLogout}
          className="btn btn-outline btn-error w-full sm:w-auto"
        >
          Logout
        </button>
      </footer>
    </div>
  );
}
