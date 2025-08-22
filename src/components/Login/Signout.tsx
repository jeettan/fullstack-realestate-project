import "../../App.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Signout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, []);

  return <p>Sign out</p>;
}
