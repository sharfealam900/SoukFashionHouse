import { useEffect, useState } from "react";
import { getDashboardStats } from "../services/adminApi";
import "../Admin.css";
import RevenueChart from "../components/dashboard/RevenueChart";
import OrdersChart from "../components/dashboard/OrdersChart";
import TopProducts from "../components/dashboard/TopProducts";
import LowStockProducts from "../components/dashboard/LowStock";
import NotificationsPanel from "../components/dashboard/NotificationsPanel";
import CategorySalesChart from "../components/dashboard/CategorySalesChart";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const { data } = await getDashboardStats();

            setStats(data.stats);
            setRecentOrders(data.recentOrders || []);
        } catch (error) {
            console.error("Dashboard Error:", error);
        }
    };

    if (!stats) {
        return (
            <div className="container-fluid">
                <h3>Loading Dashboard...</h3>
            </div>
        );
    }

    return (
        <div className="container-fluid">

            <div className="row g-4">

                <div className="col-xl-3 col-md-6">
                    <div className="card dashboard-card users-card">
                        <div className="card-body">
                            <i className="bi bi-people-fill dashboard-icon"></i>
                            <h6>Total Users</h6>
                            <h2>{stats.totalUsers}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card dashboard-card products-card">
                        <div className="card-body">
                            <i className="bi bi-box-seam dashboard-icon"></i>
                            <h6>Total Products</h6>
                            <h2>{stats.totalProducts}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card dashboard-card orders-card">
                        <div className="card-body">
                            <i className="bi bi-bag-check-fill dashboard-icon"></i>
                            <h6>Total Orders</h6>
                            <h2>{stats.totalOrders}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-xl-3 col-md-6">
                    <div className="card dashboard-card revenue-card">
                        <div className="card-body">
                            <i className="bi bi-currency-rupee dashboard-icon"></i>
                            <h6>Revenue</h6>
                            <h2>₹{stats.revenue}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="card dashboard-card">
                        <div className="card-body">
                            <h6>Pending Orders</h6>
                            <h2>{stats.pendingOrders}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="card dashboard-card">
                        <div className="card-body">
                            <h6>Delivered Orders</h6>
                            <h2>{stats.deliveredOrders}</h2>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="card dashboard-card">
                        <div className="card-body">
                            <h6>Out Of Stock</h6>
                            <h2>{stats.outOfStockProducts}</h2>
                        </div>
                    </div>
                </div>

            </div>



            {/* ===================== Stats Cards ===================== */}
            <div className="row g-4">
                {/* Your Stat Cards */}
            </div>

         

            {/* ===================== Revenue ===================== */}
            <div className="row g-4 mt-2">
                <div className="col-12">
                    <RevenueChart />
                </div>
            </div>

            {/* ===================== Analytics ===================== */}
            <div className="row g-4 mt-2">

                {/* Order Status */}
                <div className="col-lg-4">
                    <OrdersChart />
                </div>

                {/* Top Selling Products */}
                <div className="col-lg-8">
                    <TopProducts />
                </div>

            </div>

            {/* ===================== Inventory ===================== */}
            <div className="row g-4 mt-2">

                {/* Low Stock */}
                <div className="col-lg-5">
                    <LowStockProducts />
                </div>

                {/* Category Sales */}
                <div className="col-lg-7">
                    <CategorySalesChart />
                </div>
            </div>





            <div className="card shadow-sm mt-4" height={300}>
                <div className="card-header bg-white">
                    <h5 className="mb-0">Recent Orders</h5>
                </div>

                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {recentOrders.length > 0 ? (
                                recentOrders.map((order) => (
                                    <tr key={order._id}>
                                        <td>{order.shippingAddress?.fullName || "Unknown"}</td>

                                        <td>₹{order.totalAmount}</td>

                                        <td>
                                            <span
                                                className={`badge ${order.paymentStatus === "Paid"
                                                    ? "bg-success"
                                                    : "bg-warning text-dark"
                                                    }`}
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="badge bg-primary">
                                                {order.orderStatus}
                                            </span>
                                        </td>

                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString("en-IN")}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        No Orders Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}