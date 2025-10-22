import { useState } from "react"

export default function GenerateButton({loading, t, onClick}) {  
  const [afterClick, setAfterClick] = useState(false);

  function handleClick() {
    if (onClick) onClick();
    setAfterClick(true);
  }

  return (
         <button disabled={loading} onClick={handleClick} className='btn cursor-pointer'>
              {loading ? 
              (
                <p className='cursor-none'>
                  {t("button.generating")}
                  <span className="loading loading-dots loading-xs ml-1"></span>
                </p>
              )  
              : 
              afterClick ? t("button.regenerate") : t("button.generate")
              }
            </button>
    )
}