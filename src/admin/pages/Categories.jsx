import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/adminApi";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }

      setFormData({
        name: "",
        description: "",
      });

      setEditingId(null);

      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);

    setFormData({
      name: cat.name,
      description: cat.description,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await deleteCategory(id);

    loadCategories();
  };

  return (
    <div className="container-fluid py-4">

      <h2 className="mb-4">
        Category Management
      </h2>

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              <div className="col-md-4 mb-3">

                <input
                  className="form-control"
                  name="name"
                  placeholder="Category Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

              </div>

              <div className="col-md-6 mb-3">

                <input
                  className="form-control"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />

              </div>

              <div className="col-md-2 mb-3">

                <button
                  className={`btn ${
                    editingId
                      ? "btn-warning"
                      : "btn-primary"
                  } w-100`}
                >
                  {editingId
                    ? "Update"
                    : "Add"}
                </button>

              </div>

            </div>

          </form>

        </div>

      </div>

      <div className="card shadow-sm">

        <div className="card-body">

          <table className="table table-hover align-middle">

            <thead>

              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th width="180">Actions</th>
              </tr>

            </thead>

            <tbody>

              {categories.map((cat) => (

                <tr key={cat._id}>

                  <td>{cat.name}</td>

                  <td>{cat.description}</td>

                  <td>

                    <span
                      className={`badge ${
                        cat.isActive
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {cat.isActive
                        ? "Active"
                        : "Inactive"}
                    </span>

                  </td>

                  <td>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        handleEdit(cat)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleDelete(cat._id)
                      }
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