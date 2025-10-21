export default function GenerateButton({loading}) {
    return (
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
    )
}