import { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../services/adminApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // =========================
  // LOAD PRODUCTS
  // =========================
  const loadProducts = async () => {
    try {
      setLoading(true);

      const { data } = await getProducts();

      setProducts(data?.products || []);
    } catch (error) {
      console.error("Failed to load products:", error);

      toast.error(
        error?.response?.data?.message ||
        "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // =========================
  // DELETE PRODUCT
  // =========================
  const handleDelete = (product) => {
    const toastId = toast.custom(
      (t) => (
        <div
          style={{
            width: "360px",
            maxWidth: "calc(100vw - 32px)",
            background: "#ffffff",
            borderRadius: "16px",
            padding: "20px",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.18)",
            border: "1px solid #eeeeee",
            opacity: t.visible ? 1 : 0,
            transform: t.visible
              ? "translateY(0)"
              : "translateY(-10px)",
            transition: "all 0.2s ease",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background: "#fff1f2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              marginBottom: "14px",
            }}
          >
            ⚠
          </div>

          {/* Title */}
          <h5
            style={{
              margin: "0 0 8px",
              fontWeight: "700",
              color: "#111827",
            }}
          >
            Delete Product?
          </h5>

          {/* Message */}
          <p
            style={{
              margin: "0 0 18px",
              color: "#6b7280",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            Are you sure you want to delete{" "}
            <strong>{product.name}</strong>? This action
            cannot be undone.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                toast.dismiss(toastId);
              }}
              style={{
                border: "1px solid #d1d5db",
                background: "#ffffff",
                color: "#374151",
                borderRadius: "8px",
                padding: "9px 16px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={async () => {
                toast.dismiss(toastId);
                await confirmDelete(product._id);
              }}
              style={{
                border: "none",
                background: "#dc2626",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "9px 16px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  // =========================
  // CONFIRM DELETE
  // =========================
  const confirmDelete = async (id) => {
    const loadingToast = toast.loading("Deleting product...");

    try {
      await deleteProduct(id);

      // Remove immediately from UI
      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== id
        )
      );

      toast.dismiss(loadingToast);

      toast.success("Product deleted successfully.", {
        duration: 3000,
      });
    } catch (error) {
      console.error("Delete product error:", error);

      toast.dismiss(loadingToast);

      toast.error(
        error?.response?.data?.message ||
        "Failed to delete product.",
        {
          duration: 4000,
        }
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "300px",
        }}
      >
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <h6 className="text-muted">
            Loading Products...
          </h6>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================
  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">
          Products
        </h3>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() =>
            navigate("/admin/products/new")
          }
        >
          Add Product
        </button>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="card shadow-sm border-0">

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-light">

              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-5 text-muted"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                products.map((product) => (

                  <tr key={product._id}>

                    {/* IMAGE */}
                    <td>
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          width="60"
                          height="60"
                          style={{
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "8px",
                            background: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#9ca3af",
                            fontSize: "12px",
                          }}
                        >
                          No Image
                        </div>
                      )}
                    </td>

                    {/* NAME */}
                    <td>
                      <strong>
                        {product.name}
                      </strong>
                    </td>

                    {/* CATEGORY */}
                    <td>
                      {product.category?.name || "—"}
                    </td>

                    {/* PRICE */}
                    <td>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString("en-IN")}
                    </td>

                    {/* STOCK */}
                    <td>
                      {product.stock ?? 0}
                    </td>

                    {/* STATUS */}
                    <td>
                      {product.stock > 0 ? (
                        <span className="badge bg-success">
                          In Stock
                        </span>
                      ) : (
                        <span className="badge bg-danger">
                          Out Of Stock
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}
                    <td>

                      {/* EDIT */}
                      <button
                        type="button"
                        className="btn btn-sm btn-warning me-2"
                        onClick={() =>
                          navigate(
                            `/admin/products/edit/${product._id}`
                          )
                        }
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDelete(product)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}