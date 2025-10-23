// src/pages/AuthPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AuthPage({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // === SIGN UP MANUAL ===
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Akun berhasil dibuat. Silakan login untuk melanjutkan.");
      setIsSignUp(false);
      setEmail("");
      setPassword("");
    }
  };

  // === LOGIN MANUAL ===
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else if (data?.user) {
      onLoginSuccess(data.user);
    }
  };

  // === LOGIN GOOGLE ===
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    setLoading(false);

    if (error) {
      alert(error.message);
    } else if (data?.url) {
      window.location.href = data.url; // redirect ke Google OAuth
    }
  };

  // === CEK SESSION ===
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        onLoginSuccess(session.user);
      }
    };

    // listen kalau user login dari Google
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          onLoginSuccess(session.user);
        }
      }
    );

    checkSession();
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="w-full max-w-sm p-6 bg-base-100 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? isSignUp
                ? "Creating Account..."
                : "Signing In..."
              : isSignUp
              ? "Sign Up"
              : "Sign In"}
          </button>
        </form>

        <div className="divider">atau</div>

        <button
          onClick={handleGoogleSignIn}
          className="btn btn-outline w-full"
          disabled={loading}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          {loading
              ? isSignUp
                ? "Creating Account..."
                : "Signing In..."
              : isSignUp
              ? "Sign Up with Google"
              : "Sign In with Google"}
        </button>

        <p className="text-center mt-4 text-sm">
          {isSignUp ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <button
            className="link link-primary"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
