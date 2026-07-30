import { useEffect, useState } from "react";
import axios from "axios";

export default function TopProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/admin/analytics/top-products",
        {
          withCredentials: true,
        }
      );

      setProducts(res.data.topProducts);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">
        <h5 className="fw-bold mb-4">
          Top Selling Products
        </h5>

        {products.length === 0 ? (
          <p className="text-muted">No products found.</p>
        ) : (
          products.map((product, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between mb-3"
            >
              <div className="d-flex align-items-center">
                <img
                  src={product.image}
                  alt={product.name}
                  width={55}
                  height={55}
                  className="rounded"
                  style={{
                    objectFit: "cover",
                  }}
                />

                <div className="ms-3">
                  <h6 className="mb-1">
                    {product.name}
                  </h6>

                  <small className="text-muted">
                    ₹{product.price}
                  </small>
                </div>
              </div>

              <span className="badge bg-success">
                Sold {product.totalSold}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}