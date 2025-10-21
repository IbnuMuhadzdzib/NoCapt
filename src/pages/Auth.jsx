import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function Auth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      // ambil session yang tersimpan (tanpa request ke server)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);

      // kalau udah login langsung arahkan ke homepage
      if (session?.user) navigate("/home");
    };

    initAuth();

    // pantau perubahan login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) navigate("/home");
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // biar balik ke app abis login
      },
    });
    if (error) console.error("Login error:", error.message);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to NoCapt!</h1>
        <p className="opacity-70 mb-4">
          Generate social media captions smarter ✨
        </p>

        {!user ? (
          <button
            onClick={handleLogin}
            className="btn btn-outline btn-primary flex items-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <p className="text-lg">
              Hi, {user.user_metadata.full_name || "User"} 👋
            </p>
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="w-16 h-16 rounded-full border"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Auth;
