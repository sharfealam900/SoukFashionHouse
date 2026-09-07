import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createProduct, deleteProductImage, getCategories, getProduct, updateProduct } from "../services/adminApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const createColor = () => ({ name: "", hex: "#000000", existingImages: [], files: [], previews: [] });

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [colorVariants, setColorVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState([{ size: "", stock: 0 }]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data.categories || []);
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (isEdit) loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const { data } = await getProduct(id);
      const product = data.product;
      setValue("name", product.name || "");
      setValue("description", product.description || "");
      setValue("price", product.price || 0);
      setValue("discount", product.discount || 0);
      setValue("stock", product.stock || 0);
      setValue("brand", product.brand || "");
      setValue("gender", product.gender || "Unisex");
      setValue("category", product.category?._id || "");
      setExistingImages(product.images || []);

      let productSizes = product.sizes || [];
      if (Array.isArray(productSizes) && productSizes.length === 1 && typeof productSizes[0] === "string") {
        try { productSizes = JSON.parse(productSizes[0]); } catch { productSizes = []; }
      }
      setSizes(
        Array.isArray(productSizes)
          ? productSizes.map((item) => ({ size: Number(item.size), stock: Number(item.stock || 0) })).filter((item) => Number.isFinite(item.size))
          : []
      );

      const variants = Array.isArray(product.colorVariants) && product.colorVariants.length
        ? product.colorVariants.map((variant) => ({
            name: variant.name || "",
            hex: variant.hex || "#000000",
            existingImages: variant.images || [],
            files: [],
            previews: [],
          }))
        : (Array.isArray(product.colors) && product.colors.length
            ? product.colors.map((name, index) => ({
                name,
                hex: "#000000",
                existingImages: index === 0 ? (product.images || []) : [],
                files: [],
                previews: [],
              }))
            : []);
      setColorVariants(variants);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load product");
    }
  };

  const addColorVariant = () => setColorVariants((prev) => [...prev, createColor()]);

  const removeColorVariant = (index) => {
    setColorVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateColorVariant = (index, field, value) => {
    setColorVariants((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const handleColorFiles = (index, event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    const previews = files.map((file) => URL.createObjectURL(file));
    setColorVariants((prev) => prev.map((item, i) => i === index ? { ...item, files: [...item.files, ...files], previews: [...item.previews, ...previews] } : item));
    event.target.value = "";
  };

  const removeNewColorImage = (colorIndex, imageIndex) => {
    setColorVariants((prev) => prev.map((item, i) => {
      if (i !== colorIndex) return item;
      if (item.previews[imageIndex]) URL.revokeObjectURL(item.previews[imageIndex]);
      return { ...item, files: item.files.filter((_, index) => index !== imageIndex), previews: item.previews.filter((_, index) => index !== imageIndex) };
    }));
  };

  const removeExistingColorImage = async (colorIndex, image) => {
    if (!isEdit || !image.public_id) return;
    const confirmDelete = window.confirm("Delete this image?");
    if (!confirmDelete) return;
    try {
      await deleteProductImage(id, image.public_id);
      setColorVariants((prev) => prev.map((item, i) => i === colorIndex ? { ...item, existingImages: item.existingImages.filter((img) => img.public_id !== image.public_id) } : item));
      setExistingImages((prev) => prev.filter((img) => img.public_id !== image.public_id));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete image");
    }
  };

  const removeLegacyImage = async (image) => {
    if (!isEdit || !image.public_id) return;
    const confirmDelete = window.confirm("Delete this image?");
    if (!confirmDelete) return;
    try {
      await deleteProductImage(id, image.public_id);
      setExistingImages((prev) => prev.filter((img) => img.public_id !== image.public_id));
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete image");
    }
  };

  const handleSizeChange = (index, field, value) => {
    setSizes((prev) => prev.map((item, i) => i === index ? { ...item, [field]: field === "size" ? value : Number(value) } : item));
  };

  const addSizeRow = () => setSizes((prev) => [...prev, { size: "", stock: 0 }]);
  const removeSizeRow = (index) => setSizes((prev) => prev.filter((_, i) => i !== index));

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("discount", data.discount);
      formData.append("stock", data.stock);
      formData.append("brand", data.brand || "");
      formData.append("gender", data.gender || "Unisex");
      formData.append("category", data.category);
      formData.append("sizes", JSON.stringify(sizes.map((item) => ({ size: Number(item.size), stock: Number(item.stock || 0) })).filter((item) => Number.isFinite(item.size) && item.size > 0)));

      const metadata = [];
      let fileIndex = 0;

      for (const variant of colorVariants) {
        const images = [];
        for (const image of variant.existingImages) {
          images.push({ type: "existing", url: image.url, public_id: image.public_id });
        }
        for (const file of variant.files) {
          images.push({ type: "new", index: fileIndex });
          formData.append("images", file);
          fileIndex += 1;
        }
        metadata.push({ name: variant.name.trim(), hex: variant.hex, images });
      }

      const validMetadata = metadata.filter((variant) => variant.name);
      if (validMetadata.length > 0) {
        formData.append("colorVariants", JSON.stringify(validMetadata));
        formData.append("colors", JSON.stringify(validMetadata.map((variant) => variant.name)));
      }

      const response = isEdit ? await updateProduct(id, formData) : await createProduct(formData);
      toast.success(response.data.message || (isEdit ? "Product updated successfully" : "Product created successfully"));
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || (isEdit ? "Failed to update product" : "Failed to create product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid souk-admin-product">
      <h2 className="mb-4">{isEdit ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Product Name</label>
                <input type="text" className="form-control" {...register("name", { required: true })} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select className="form-select" {...register("category", { required: true })}>
                  <option value="">Select Category</option>
                  {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Brand</label>
                <input type="text" className="form-control" {...register("brand")} />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Gender</label>
                <select className="form-select" {...register("gender")}>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input type="number" min="0" className="form-control" {...register("price", { required: true })} />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Discount (%)</label>
                <select className="form-select" {...register("discount")}>
                  {[0,5,10,15,20,25,30,40,50,60,70,80].map((value) => <option key={value} value={value}>{value === 0 ? "No Discount" : `${value}%`}</option>)}
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Stock</label>
                <input type="number" min="0" className="form-control" {...register("stock", { required: true })} />
              </div>

              <div className="col-12 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="mb-1">Sizes</h5>
                    <p className="text-muted mb-0">Set stock for each available size.</p>
                  </div>
                  <button type="button" className="btn btn-success" onClick={addSizeRow}>+ Add Size</button>
                </div>
                {sizes.map((item, index) => (
                  <div className="row mb-3 align-items-center" key={index}>
                    <div className="col-md-5"><input type="number" min="0" className="form-control" placeholder="Size" value={item.size} onChange={(e) => handleSizeChange(index, "size", e.target.value)} /></div>
                    <div className="col-md-4"><input type="number" min="0" className="form-control" placeholder="Stock" value={item.stock} onChange={(e) => handleSizeChange(index, "stock", e.target.value)} /></div>
                    <div className="col-md-3"><button type="button" className="btn btn-danger w-100" onClick={() => removeSizeRow(index)}>Remove</button></div>
                  </div>
                ))}
              </div>

              <div className="col-12 mb-4">
                <label className="form-label">Description</label>
                <textarea rows="6" className="form-control" {...register("description", { required: true })}></textarea>
              </div>

              <div className="col-12">
                <div className="souk-admin-color-header">
                  <div>
                    <h5>Color Variants</h5>
                    <p>Add every available color and upload images specifically for that color.</p>
                  </div>
                  <button type="button" className="btn btn-dark" onClick={addColorVariant}>+ Add Color</button>
                </div>

                {colorVariants.map((variant, colorIndex) => (
                  <div className="souk-admin-color-card" key={colorIndex}>
                    <div className="row g-3 align-items-end">
                      <div className="col-md-5">
                        <label className="form-label">Color Name</label>
                        <input type="text" className="form-control" value={variant.name} placeholder="Brown" onChange={(e) => updateColorVariant(colorIndex, "name", e.target.value)} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Color</label>
                        <div className="souk-admin-color-input">
                          <input type="color" value={variant.hex || "#000000"} onChange={(e) => updateColorVariant(colorIndex, "hex", e.target.value)} />
                          <span>{variant.hex}</span>
                        </div>
                      </div>
                      <div className="col-md-3">
                        <button type="button" className="btn btn-outline-danger w-100" onClick={() => removeColorVariant(colorIndex)}>Remove Color</button>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="form-label">Images for {variant.name || "this color"}</label>
                      <input type="file" accept="image/*" multiple className="form-control" onChange={(e) => handleColorFiles(colorIndex, e)} />
                    </div>

                    <div className="souk-admin-image-grid">
                      {variant.existingImages.map((image) => (
                        <div className="souk-admin-image-item" key={image.public_id}>
                          <img src={image.url} alt={variant.name} />
                          <button type="button" onClick={() => removeExistingColorImage(colorIndex, image)}>×</button>
                        </div>
                      ))}
                      {variant.previews.map((image, imageIndex) => (
                        <div className="souk-admin-image-item" key={`${colorIndex}-${imageIndex}`}>
                          <img src={image} alt="Preview" />
                          <button type="button" onClick={() => removeNewColorImage(colorIndex, imageIndex)}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {colorVariants.length === 0 && <div className="souk-admin-empty-colors">No color variants added. Click Add Color to create color-specific galleries.</div>}
              </div>

              {isEdit && colorVariants.length === 0 && existingImages.length > 0 && (
                <div className="col-12 mt-4">
                  <h5>Existing Product Images</h5>
                  <div className="souk-admin-image-grid">
                    {existingImages.map((image) => (
                      <div className="souk-admin-image-item" key={image.public_id}>
                        <img src={image.url} alt="Product" />
                        <button type="button" onClick={() => removeLegacyImage(image)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 mb-5">
          <button type="submit" className="btn btn-primary px-5" disabled={loading}>{loading ? "Saving..." : isEdit ? "Update Product" : "Save Product"}</button>
        </div>
      </form>
    </div>
  );
}
