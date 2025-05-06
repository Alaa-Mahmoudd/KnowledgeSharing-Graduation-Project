import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useAuth } from "../../Context/AuthContext";

export default function Layout() {
  const { user } = useAuth();
  if (user && user.role !== "user" && user.role !== "doctor") return null;
  return (
    <div className="bg-White">
      <Navbar />
      <div className="container mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
