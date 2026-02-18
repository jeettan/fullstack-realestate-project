import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Rent from "./components/Rent/Rent.tsx";
import Login from "./components/Login/Login.tsx";
import Signout from "./components/Login/Signout.tsx";
import Dashboard from "./components/Dashboard/Dashboard.tsx";
import Lease from "./components/Lease/Lease.tsx";
import Properties from "./components/Property/Properties.tsx";
import AddListing from "./components/AddListing/AddListing.tsx";
import EditListing from "./components/EditListing/EditListing.tsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signout" element={<Signout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lease" element={<Lease />} />
        <Route path="/properties/:id" element={<Properties />} />
        <Route path="/add-listing" element={<AddListing />} />
        <Route path="/edit-listing/:id" element={<EditListing />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
