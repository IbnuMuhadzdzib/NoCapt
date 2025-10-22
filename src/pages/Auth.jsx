import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 👈 buat navigasi

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        navigate("/home"); // 👈 redirect kalau udah login
      }
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) navigate("/home"); // 👈 redirect realtime
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for confirmation link!");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setUser(data.user);
        navigate("/home"); // 👈 langsung ke homepage
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/home", // 👈 redirect juga ke home
      },
    });
    if (error) console.error("Google login error:", error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {!user ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-80 p-6 shadow-md rounded-xl"
        >
          <h2 className="text-2xl font-bold text-center">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="input input-bordered w-full"
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </button>

          <div className="divider">or</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline flex items-center gap-2 justify-center"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="text-center text-sm mt-3">
            {isSignUp ? "Already have an account?" : "New here?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="link link-primary"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-lg">Welcome, {user.email} 👋</p>
          <button onClick={handleLogout} className="btn btn-outline">
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default AuthPage;
