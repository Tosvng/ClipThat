import { Button } from "@/components/ui/button";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <Button
      variant="ghost"
      className="text-red-600 hover:text-red-700 hover:bg-red-100"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
