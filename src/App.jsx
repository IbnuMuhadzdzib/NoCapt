// src/App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { supabase } from "./lib/supabase";
import "./index.css";
import Auth from "./pages/Auth.jsx";
import Homepage from "./pages/Homepage.jsx";
import SavedPage from "./pages/SavedPage.jsx";
import "./i18n.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      setLoading(false);
    };
    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return 
  <div className="flex items-center justify-center h-screen bg-base-200">
        <span className="loading loading-dots loading-xs ml-1"></span>
    </div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route path="/saved" element={<SavedPage user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
