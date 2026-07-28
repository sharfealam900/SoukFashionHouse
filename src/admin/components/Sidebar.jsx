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

            </nav>

        </aside>
    );
}