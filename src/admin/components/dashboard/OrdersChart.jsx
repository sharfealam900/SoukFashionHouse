import { useEffect, useState } from "react";


import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../../api/axios";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
];

export default function OrdersChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
const res = await api.get("/admin/analytics/orders");

      const formatted = res.data.analytics.map((item) => ({
        name: item._id,
        value: item.count,
      }));

      setData(formatted);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-4">
          Order Status
        </h5>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}