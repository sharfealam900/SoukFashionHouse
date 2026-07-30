import { useEffect, useState } from "react";
import api from "../../../api/axios";


export default function NotificationsPanel() {

    const [data, setData] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        const res = await api.get(
            "/admin/analytics/notifications"
        );

        setData(res.data.notifications);
    };

    if (!data) return null;

    return (
        <div className="card shadow-sm border-0 h-100">

            <div className="card-header bg-white fw-bold">
                🔔 Notifications
            </div>

            <div className="list-group list-group-flush">

                <div className="list-group-item d-flex justify-content-between">
                    <span>🔴 Out of Stock</span>
                    <span className="badge bg-danger">
                        {data.outOfStock}
                    </span>
                </div>

                <div className="list-group-item d-flex justify-content-between">
                    <span>🟡 Pending Orders</span>
                    <span className="badge bg-warning text-dark">
                        {data.pendingOrders}
                    </span>
                </div>

                <div className="list-group-item d-flex justify-content-between">
                    <span>🟢 New Users Today</span>
                    <span className="badge bg-success">
                        {data.newUsers}
                    </span>
                </div>

                <div className="list-group-item d-flex justify-content-between">
                    <span>🔵 Low Stock</span>
                    <span className="badge bg-primary">
                        {data.lowStock}
                    </span>
                </div>

            </div>

        </div>
    );
}