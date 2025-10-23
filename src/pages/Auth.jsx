import { useNavigate } from "react-router-dom";
import AuthPage from "./AuthPage";

export default function Auth() {
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    console.log("User logged in:", user);
    navigate("/home"); // redirect ke halaman homepage
  };

  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
}
