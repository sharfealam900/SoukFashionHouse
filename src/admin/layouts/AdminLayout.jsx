import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../Admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-wrapper">
      <Sidebar />

      <div className="admin-content">
        <Header />

        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}