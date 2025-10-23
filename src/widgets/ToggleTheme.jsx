import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function ToggleTheme() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const { t } = useTranslation();

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <button onClick={toggleTheme} className="btn btn-sm btn-outline">
      {theme === "light" ? t("theme.dark") : t("theme.light")}
    </button>
    )
}