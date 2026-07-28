import { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../services/adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);



  const loadProducts = async () => {
    try {
      const { data } = await getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(id);

      // Reload products after delete
      loadProducts();

      alert("Product deleted successfully.");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product.");
    }
  };





  if (loading) {
    return <h4>Loading Products...</h4>;
  }

  return (
    <div className="container-fluid">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Products</h3>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/products/new")}
        >
          Add Product
        </button>
      </div>

      <div className="card shadow-sm">

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

              {products.map((product) => (

                <tr key={product._id}>

                  <td>
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.name}
                      width="60"
                      height="60"
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </td>

                  <td>{product.name}</td>

                  <td>{product.category?.name}</td>

                  <td>₹{product.price}</td>

                  <td>{product.stock}</td>

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

                  <td>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                    >
                      Edit
                    
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}