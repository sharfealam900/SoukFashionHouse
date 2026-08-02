import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import api from "../../../api/axios";

export default function CategorySalesChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
const res = await api.get("/admin/analytics/category-sales");

      setData(res.data.sales);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="fw-bold mb-4">
          Sales by Category
        </h5>

        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="_id" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="totalSold"
              fill="#0d6efd"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}