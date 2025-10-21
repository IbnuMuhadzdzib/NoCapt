export default function GenerateButton({loading, t}) {
    return (
         <button disabled={loading} className='btn cursor-pointer'>
              {loading ? 
              (
                <p className='cursor-none'>
                  {t("button.generating")}
                  <span className="loading loading-dots loading-xs ml-1"></span>
                </p>
              )  
              : 
              (t("button.generate"))
              }
            </button>
    )
}