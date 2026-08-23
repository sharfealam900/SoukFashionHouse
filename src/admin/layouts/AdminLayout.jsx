import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../Admin.css";
import SEO from "../../Components/SEO";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-wrapper">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <SEO
        title="Admin | Souk Fashion House"
        noIndex
      />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="admin-content">

        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="admin-main">
          <Outlet />
        </main>

      </div>
    </div>
  );
}