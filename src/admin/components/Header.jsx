import logo from "../../assets/logo.jpg";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="admin-header">
      <div>
        <h4 className="mb-0 fw-bold">
          Admin Dashboard
        </h4>
      </div>

      <div className="d-flex align-items-center gap-3">
        <span className="fw-semibold">
          Welcome, Admin
        </span>

        <Link to="/" className="logo">
          <img src={logo} alt="Logo" width={150} />
        </Link>
      </div>
    </header>
  );
}