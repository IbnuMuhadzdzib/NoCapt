import { useState, useEffect } from "react";

export default function ToggleTheme() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
    )
}