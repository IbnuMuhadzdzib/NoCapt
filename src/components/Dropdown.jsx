import { IoLanguage } from "react-icons/io5";

export default function Dropdown({ children}) {
    return (
        <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn m-1"><IoLanguage></IoLanguage></div>
                  <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
                    {children}
                  </ul>
                </div>
    )
}