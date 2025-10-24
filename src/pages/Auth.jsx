import { useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";
import { useCallback } from "react";

export default function Auth() {
  const navigate = useNavigate();

  const handleLoginSuccess = useCallback((user) => {
    console.log("User logged in:", user);
    navigate("/home"); // redirect ke halaman homepage
  }, [navigate]);

  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
}
