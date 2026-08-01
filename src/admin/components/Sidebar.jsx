import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        SOUK ADMIN
      </div>

      <nav className="nav flex-column mt-3">

        <NavLink
          to="/admin"
          end
          className="nav-link"
        >
          <i className="bi bi-speedometer2"></i>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/products"
          className="nav-link"
        >
          <i className="bi bi-box-seam"></i>
          Products
        </NavLink>

        <NavLink
          to="/admin/orders"
          className="nav-link"
        >
          <i className="bi bi-bag-check"></i>
          Orders
        </NavLink>

        <NavLink
          to="/admin/categories"
          className="nav-link"
        >
          <i className="bi bi-tags"></i>
          Categories
        </NavLink>

        <NavLink
          to="/admin/users"
          className="nav-link"
        >
          <i className="bi bi-people"></i>
          Users
        </NavLink>

        <NavLink
          to="/admin/coupons"
          className="nav-link"
        >
          <i className="bi bi-ticket-perforated"></i>
          Coupons
        </NavLink>


        <NavLink
          to="/admin/contact"
          className="nav-link"
        >
          <i className="bi bi-chat-dots"></i>
          Contact Messages
        </NavLink>




        <NavLink
          to="/admin/subscribers"
          className="nav-link"
        >
          <i className="bi bi-envelope-paper"></i>
          Subscribers
        </NavLink>

        <NavLink
          to="/admin/banners"
          className="nav-link"
        >
          <i className="bi bi-images"></i>
          Banner Management
        </NavLink>

      </nav>
    </aside>
  );
}