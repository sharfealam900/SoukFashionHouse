import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createProduct,
  deleteProductImage,
  getCategories,
  getProduct,
  updateProduct,
} from "../services/adminApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const createColor = () => ({
  name: "",
  hex: "#000000",
  existingImages: [],
  files: [],
  previews: [],
});

const createDetailRows = (values = {}) => [
  { key: "productType", label: "Product Type", placeholder: "Kashmiri Ari Work Kurti" },
  { key: "fabric", label: "Fabric", placeholder: "Premium Ruby Cotton" },
  { key: "work", label: "Work", placeholder: "Kashmiri Ari Manual Work" },
  { key: "pattern", label: "Pattern", placeholder: "Floral & Traditional" },
  { key: "neckType", label: "Neck Type", placeholder: "V-Neck" },
  { key: "sleeveType", label: "Sleeve Type", placeholder: "Full Sleeves" },
  { key: "fit", label: "Fit", placeholder: "Regular Fit" },
  { key: "colour", label: "Colour", placeholder: "Mustard" },
  { key: "season", label: "Season", placeholder: "Summer" },
  { key: "sizesAvailable", label: "Sizes Available", placeholder: "M to L" },
  { key: "closure", label: "Closure", placeholder: "Slip-On" },
  { key: "occasion", label: "Occasion", placeholder: "Casual, Festive & Ethnic Wear" },
  { key: "length", label: "Length", placeholder: "Knee Length" },
  { key: "packageContains", label: "Package Contains", placeholder: "1 Kurti" },
  { key: "workmanship", label: "Workmanship", placeholder: "Manual" },
  { key: "countryOfOrigin", label: "Country of Origin", placeholder: "India" },
].map((field) => ({ ...field, value: values[field.key] || "" }));

const emptyCareInstructions = () => [""];
const emptyDeliveryServices = () => [""];

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [colorVariants, setColorVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sizes, setSizes] = useState([{ size: "", stock: 0 }]);
  const [careInstructions, setCareInstructions] = useState(emptyCareInstructions);
  const [deliveryServices, setDeliveryServices] = useState(emptyDeliveryServices);
  const [detailValues, setDetailValues] = useState({});
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
      const details = product.productDetails || {};

      setValue("name", product.name || "");
      setValue("description", product.description || "");
      setValue("price", product.price || 0);
      setValue("discount", product.discount || 0);
      setValue("stock", product.stock || 0);
      setValue("brand", product.brand || "");
      setValue("gender", product.gender || "Unisex");
      setValue("category", product.category?._id || "");
      setExistingImages(product.images || []);
      setDetailValues(details);

      let productSizes = product.sizes || [];
      if (Array.isArray(productSizes) && productSizes.length === 1 && typeof productSizes[0] === "string") {
        try {
          productSizes = JSON.parse(productSizes[0]);
        } catch {
          productSizes = [];
        }
      }
      setSizes(
        Array.isArray(productSizes)
          ? productSizes
              .map((item) => ({ size: Number(item.size), stock: Number(item.stock || 0) }))
              .filter((item) => Number.isFinite(item.size))
          : []
      );

      setCareInstructions(
        Array.isArray(details.careInstructions) && details.careInstructions.length
          ? details.careInstructions
          : emptyCareInstructions()
      );
      setDeliveryServices(
        Array.isArray(details.deliveryServices) && details.deliveryServices.length
          ? details.deliveryServices
          : emptyDeliveryServices()
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
    setColorVariants((prev) => prev.map((item, i) => i === index
      ? { ...item, files: [...item.files, ...files], previews: [...item.previews, ...previews] }
      : item));
    event.target.value = "";
  };

  const removeNewColorImage = (colorIndex, imageIndex) => {
    setColorVariants((prev) => prev.map((item, i) => {
      if (i !== colorIndex) return item;
      if (item.previews[imageIndex]) URL.revokeObjectURL(item.previews[imageIndex]);
      return {
        ...item,
        files: item.files.filter((_, index) => index !== imageIndex),
        previews: item.previews.filter((_, index) => index !== imageIndex),
      };
    }));
  };

  const removeExistingColorImage = async (colorIndex, image) => {
    if (!isEdit || !image.public_id) return;
    const confirmDelete = window.confirm("Delete this image?");
    if (!confirmDelete) return;
    try {
      await deleteProductImage(id, image.public_id);
      setColorVariants((prev) => prev.map((item, i) => i === colorIndex
        ? { ...item, existingImages: item.existingImages.filter((img) => img.public_id !== image.public_id) }
        : item));
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
    setSizes((prev) => prev.map((item, i) => (
      i === index ? { ...item, [field]: field === "size" ? value : Number(value) } : item
    )));
  };

  const addSizeRow = () => setSizes((prev) => [...prev, { size: "", stock: 0 }]);
  const removeSizeRow = (index) => setSizes((prev) => prev.filter((_, i) => i !== index));

  const updateDetail = (key, value) => {
    setDetailValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateListItem = (setter, index, value) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const addListItem = (setter) => setter((prev) => [...prev, ""]);

  const removeListItem = (setter, index) => {
    setter((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [""];
    });
  };

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
      formData.append(
        "sizes",
        JSON.stringify(
          sizes
            .map((item) => ({ size: Number(item.size), stock: Number(item.stock || 0) }))
            .filter((item) => Number.isFinite(item.size) && item.size > 0)
        )
      );

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
      } else if (isEdit) {
        formData.append("colorVariants", JSON.stringify([]));
        formData.append("colors", JSON.stringify([]));
      }

      const productDetails = {
        ...detailValues,
        careInstructions: careInstructions.map((item) => item.trim()).filter(Boolean),
        deliveryServices: deliveryServices.map((item) => item.trim()).filter(Boolean),
      };
      formData.append("productDetails", JSON.stringify(productDetails));

      const response = isEdit
        ? await updateProduct(id, formData)
        : await createProduct(formData);

      toast.success(response.data.message || (isEdit ? "Product updated successfully" : "Product created successfully"));
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || (isEdit ? "Failed to update product" : "Failed to create product"));
    } finally {
      setLoading(false);
    }
  };

  const detailFields = createDetailRows(detailValues);

  return (
    <div className="container-fluid souk-admin-product">
      <div className="souk-admin-product-heading">
        <div>
          <h2>{isEdit ? "Edit Product" : "Add New Product"}</h2>
          <p>Create the product content exactly as it should appear on the customer-facing product details section.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section className="souk-admin-form-section">
          <div className="souk-admin-section-heading">
            <div>
              <span>01</span>
              <div>
                <h4>Basic Information</h4>
                <p>Name, category, brand and audience.</p>
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-8">
              <label className="form-label">Product Name</label>
              <input type="text" className="form-control" {...register("name", { required: true })} placeholder="Kashmiri Ari Work Kurti" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Category</label>
              <select className="form-select" {...register("category", { required: true })}>
                <option value="">Select Category</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Brand</label>
              <input type="text" className="form-control" {...register("brand")} placeholder="SOUK – The House of Fashion" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Gender</label>
              <select className="form-select" {...register("gender")}>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>
        </section>

        <section className="souk-admin-form-section">
          <div className="souk-admin-section-heading">
            <div>
              <span>02</span>
              <div>
                <h4>Pricing & Inventory</h4>
                <p>Price, discount and stock available for purchase.</p>
              </div>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <label className="form-label">Price (₹)</label>
              <input type="number" min="0" className="form-control" {...register("price", { required: true })} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Discount (%)</label>
              <select className="form-select" {...register("discount")}>
                {[0,5,10,15,20,25,30,40,50,60,70,80].map((value) => <option key={value} value={value}>{value === 0 ? "No Discount" : `${value}%`}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">General Stock</label>
              <input type="number" min="0" className="form-control" {...register("stock", { required: true })} />
            </div>
          </div>

          <div className="souk-admin-subsection">
            <div className="souk-admin-subsection-heading">
              <div>
                <h5>Size & Stock</h5>
                <p>Keep the existing size selector connected to its stock quantity.</p>
              </div>
              <button type="button" className="btn btn-outline-dark" onClick={addSizeRow}>+ Add Size</button>
            </div>
            {sizes.map((item, index) => (
              <div className="souk-admin-size-row" key={index}>
                <div>
                  <label className="form-label">Size</label>
                  <input type="number" min="0" className="form-control" placeholder="42" value={item.size} onChange={(e) => handleSizeChange(index, "size", e.target.value)} />
                </div>
                <div>
                  <label className="form-label">Stock</label>
                  <input type="number" min="0" className="form-control" placeholder="10" value={item.stock} onChange={(e) => handleSizeChange(index, "stock", e.target.value)} />
                </div>
                <button type="button" className="btn btn-outline-danger" onClick={() => removeSizeRow(index)}>Remove</button>
              </div>
            ))}
          </div>
        </section>

        <section className="souk-admin-form-section">
          <div className="souk-admin-section-heading">
            <div>
              <span>03</span>
              <div>
                <h4>Product Description</h4>
                <p>This is the editorial description shown above the specification table.</p>
              </div>
            </div>
          </div>
          <label className="form-label">Description</label>
          <textarea rows="7" className="form-control" {...register("description", { required: true })} placeholder="Describe the product, craftsmanship, styling and intended use..." />
        </section>

        <section className="souk-admin-form-section">
          <div className="souk-admin-section-heading">
            <div>
              <span>04</span>
              <div>
                <h4>Product Details</h4>
                <p>Every field below becomes its own row in the customer-facing Product Details table.</p>
              </div>
            </div>
          </div>

          <div className="row g-4">
            {detailFields.map((field) => (
              <div className="col-md-6" key={field.key}>
                <label className="form-label">{field.label}</label>
                <input
                  type="text"
                  className="form-control"
                  value={field.value}
                  placeholder={field.placeholder}
                  onChange={(event) => updateDetail(field.key, event.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="souk-admin-note-field">
            <label className="form-label">Product Note</label>
            <textarea
              rows="3"
              className="form-control"
              value={detailValues.note || ""}
              onChange={(event) => updateDetail("note", event.target.value)}
              placeholder="Optional note shown below Delivery & Services."
            />
          </div>
        </section>

        <section className="souk-admin-form-section">
          <div className="souk-admin-section-heading">
            <div>
              <span>05</span>
              <div>
                <h4>Care Instructions</h4>
                <p>Each item becomes a bullet point under Care Instructions.</p>
              </div>
            </div>
            <button type="button" className="btn btn-outline-dark" onClick={() => addListItem(setCareInstructions)}>+ Add Instruction</button>
          </div>
          <div className="souk-admin-list-editor">
            {careInstructions.map((item, index) => (
              <div className="souk-admin-list-row" key={index}>
                <span>•</span>
                <input
                  type="text"
                  className="form-control"
                  value={item}
                  placeholder="Gentle hand wash recommended"
                  onChange={(event) => updateListItem(setCareInstructions, index, event.target.value)}
                />
                <button type="button" className="btn btn-outline-danger" onClick={() => removeListItem(setCareInstructions, index)}>×</button>
              </div>
            ))}
          </div>
        </section>

        <section className="souk-admin-form-section">
          <div className="souk-admin-section-heading">
            <div>
              <span>06</span>
              <div>
                <h4>Delivery & Services</h4>
                <p>Each item becomes a bullet point in the delivery/services section.</p>
              </div>
            </div>
            <button type="button" className="btn btn-outline-dark" onClick={() => addListItem(setDeliveryServices)}>+ Add Service</button>
          </div>
          <div className="souk-admin-list-editor">
            {deliveryServices.map((item, index) => (
              <div className="souk-admin-list-row" key={index}>
                <span>•</span>
                <input
                  type="text"
                  className="form-control"
                  value={item}
                  placeholder="Pan-India Delivery Available"
                  onChange={(event) => updateListItem(setDeliveryServices, index, event.target.value)}
                />
                <button type="button" className="btn btn-outline-danger" onClick={() => removeListItem(setDeliveryServices, index)}>×</button>
              </div>
            ))}
          </div>
        </section>

        <section className="souk-admin-form-section">
          <div className="souk-admin-section-heading">
            <div>
              <span>07</span>
              <div>
                <h4>Colour Variants & Images</h4>
                <p>Keep colour-specific galleries connected to the existing product image system.</p>
              </div>
            </div>
            <button type="button" className="btn btn-dark" onClick={addColorVariant}>+ Add Colour</button>
          </div>

          {colorVariants.map((variant, colorIndex) => (
            <div className="souk-admin-color-card" key={colorIndex}>
              <div className="row g-3 align-items-end">
                <div className="col-md-5">
                  <label className="form-label">Colour Name</label>
                  <input type="text" className="form-control" value={variant.name} placeholder="Mustard" onChange={(e) => updateColorVariant(colorIndex, "name", e.target.value)} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Colour Swatch</label>
                  <div className="souk-admin-color-input">
                    <input type="color" value={variant.hex || "#000000"} onChange={(e) => updateColorVariant(colorIndex, "hex", e.target.value)} />
                    <span>{variant.hex}</span>
                  </div>
                </div>
                <div className="col-md-3">
                  <button type="button" className="btn btn-outline-danger w-100" onClick={() => removeColorVariant(colorIndex)}>Remove Colour</button>
                </div>
              </div>

              <div className="mt-4">
                <label className="form-label">Images for {variant.name || "this colour"}</label>
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

          {colorVariants.length === 0 && <div className="souk-admin-empty-colors">No colour variants added. Add a colour when you want selectable colour swatches and colour-specific galleries.</div>}

          {isEdit && colorVariants.length === 0 && existingImages.length > 0 && (
            <div className="mt-4">
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
        </section>

        <div className="souk-admin-form-actions">
          <button type="button" className="btn btn-light" onClick={() => navigate("/admin/products")}>Cancel</button>
          <button type="submit" className="btn btn-primary px-5" disabled={loading}>
            {loading ? "Saving..." : isEdit ? "Update Product" : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
