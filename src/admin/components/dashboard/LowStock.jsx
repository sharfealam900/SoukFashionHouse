import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function LowStockProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
const res = await api.get("/admin/analytics/low-stock");

      setProducts(res.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="fw-bold text-danger mb-4">
          Low Stock Products
        </h5>

        {products.length === 0 ? (
          <p className="text-success">
            All products are sufficiently stocked.
          </p>
        ) : (
          products.slice(0, 5).map((product) => (
            <div
              key={product._id}
              className="d-flex justify-content-between align-items-center border-bottom py-3"
            >
              <div className="d-flex align-items-center">
                <img
                  src={product.images[0]?.url}
                  alt={product.name}
                  width={55}
                  height={55}
                  className="rounded"
                  style={{ objectFit: "cover" }}
                />

                <div className="ms-3">
                  <h6 className="mb-1">{product.name}</h6>
                  <small className="text-muted">
                    ₹{product.price}
                  </small>
                </div>
              </div>

              <span
                className={`badge ${
                  product.stock === 0
                    ? "bg-danger"
                    : "bg-warning text-dark"
                }`}
              >
                {product.stock} Left
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}