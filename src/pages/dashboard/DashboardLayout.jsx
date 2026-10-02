import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <button className="self-start md:hidden" onClick={() => setOpen((o) => !o)}>☰ Menu</button>
      <Sidebar open={open} onNavigate={() => setOpen(false)} onLogout={() => { logout(); navigate("/login"); }} />
      <main className="min-w-0 flex-1"><Outlet /></main>
    </div>
  );
}
    export default function DashboardLayout() {
        const [open, setOpen] = useState(false);
        const { logout } = useAuth();
        const navigate = useNavigate();
        return (
            <div className="flex flex-col gap-4 md:flex-row">
              <button className="self-start md:hidden" onClick={() => setOpen((o) => !o)}>☰ Menu</button>
              <Sidebar open={open} onNavigate={() => setOpen(false)} onLogout={() => { logout(); navigate("/login"); }} />
              <main className="min-w-0 flex-1"><Outlet /></main>
            </div>
        );
    }
