import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    checkSession();

    // Listen kalau session berubah (misal user logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    // tampilin skeleton/loading screen biar gak “kedip” homepage
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <span className="loading loading-dots loading-xs ml-1"></span>
      </div>
    );
  }

  // kalau gak ada session → redirect ke login
  if (!session) {
    return <Navigate to="/" replace />;
  }

  // kalau udah login → render halaman anaknya
  return children;
}
