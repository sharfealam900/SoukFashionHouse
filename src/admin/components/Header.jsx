import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";

export default function Header({
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <header className="admin-header">

      {/* Mobile Menu Button */}
      <button
        type="button"
        className={`mobile-menu-btn ${sidebarOpen ? "menu-open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Title */}
      <div className="admin-header-title">
        <h4>Admin Dashboard</h4>
      </div>

      {/* Right Section */}
      <div className="admin-header-right">

        <span className="admin-welcome">
          Welcome, Admin
        </span>

        <Link to="/" className="admin-logo-link">
          <img
            src={logo}
            alt="SOUK Logo"
          />
        </Link>

      </div>

    </header>
  );
}