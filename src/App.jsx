import { useState } from 'react';

import ToggleTheme from './widgets/ToggleTheme';

import Dropdown from './components/Dropdown';

import { generateCaption } from './lib/gemini';
import { useTranslation } from 'react-i18next';
// import i18next from 'i18next';

function App() {
    const { t, i18n } = useTranslation();


  const [image, setImage] = useState("");
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("");
  const [style, setStyle] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState();

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
    <div className="p-8">
                  <h1 className="text-3xl mb-4">{t("title")}</h1>
                <ToggleTheme />
                <Dropdown>
                  <li><button onClick={() => i18n.changeLanguage("id")}>🇮🇩 Indonesia</button></li>
                    <li><button onClick={() => i18n.changeLanguage("en")}>en English</button></li>
                </Dropdown>
        <form action="" onSubmit={handleGenerate}>
            <input type="file" 
                    accept='image/*'
                    onChange={(e) => setImage(e.target.files[0])}
                    className='cursor-pointer boder border-1 p-2 rounded-lg'/>
            <div>
              <textarea type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder={t("placeholder.concept")}
                    className='textarea validator boder border-1 p-2 rounded-lg' 
                    required/>
              <div className="validator-hint">Column Can't be Empty</div>
            </div>
            <input type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder={t("placeholder.language")}
                    className='boder border-1 p-2 rounded-lg' />

            <input type="text"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder={t("placeholder.style")}
                    className='boder border-1 p-2 rounded-lg' />

            <button disabled={loading} className='btn cursor-pointer'>
              {loading ? 
              (
                <p className='cursor-none'>
                  Generating 
                  <span className="loading loading-dots loading-xs ml-1"></span>
                </p>
              )  
              : 
              "Generate"
              }
            </button>
        </form>

        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>{result}</p>
          </div>
        )}
    </div>
  );
}

export default App;
