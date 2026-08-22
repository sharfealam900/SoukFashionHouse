import { NavLink } from "react-router-dom";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`admin-sidebar ${
        sidebarOpen ? "mobile-open" : ""
      }`}
    >

      {/* Logo */}
      <div className="admin-logo">
        SOUK ADMIN
      </div>

      {/* Navigation */}
      <nav className="admin-nav">

        <NavLink
          to="/admin"
          end
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-speedometer2"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/products"
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-box-seam"></i>
          <span>Products</span>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-bag-check"></i>
          <span>Orders</span>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-tags"></i>
          <span>Categories</span>
        </NavLink>

        <NavLink
          to="/admin/users"
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-people"></i>
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin/coupons"
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-ticket-perforated"></i>
          <span>Coupons</span>
        </NavLink>

        <NavLink
          to="/admin/contact"
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-chat-dots"></i>
          <span>Contact Messages</span>
        </NavLink>

        <NavLink
          to="/admin/subscribers"
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-envelope-paper"></i>
          <span>Subscribers</span>
        </NavLink>

        <NavLink
          to="/admin/banners"
          className="nav-link"
          onClick={closeSidebar}
        >
          <i className="bi bi-images"></i>
          <span>Banner Management</span>
        </NavLink>

      </nav>
    </aside>
  );
}