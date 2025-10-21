import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { generateCaption } from "../lib/gemini";

// widgets & components
import ToggleTheme from "../widgets/ToggleTheme";
import Prompt from "../widgets/Prompt";
import Dropdown from "../components/Dropdown";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("");
  const [style, setStyle] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setUser] = useState(null);

  // cek user login
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate("/"); // redirect ke login
      else setUser(user);
    });
  }, [navigate]);

  // handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
      return;
    }
    setUser(null);
    navigate("/");
  };

  // generate caption
  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const caption = await generateCaption(image, keyword, language, style);
      setResult(caption);
    } catch (err) {
      console.error(err);
      setResult("Terjadi kesalahan waktu generate caption.");
    }
    setLoading(false);
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
          <h2 className="text-lg font-medium mb-2">{t("result.title", "Generated Caption")}</h2>
          <p className="text-sm leading-relaxed">{result}</p>
        </section>
      )}

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
