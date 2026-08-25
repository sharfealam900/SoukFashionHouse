import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createProduct, deleteProductImage, getCategories, getProduct, updateProduct, } from "../services/adminApi";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";


export default function AddProduct() {

    const [categories, setCategories] = useState([]);
    const [preview, setPreview] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [sizes, setSizes] = useState([
        {
            size: "",
            stock: 0,
        },
    ]);

    const { id } = useParams();
    const isEdit = Boolean(id);


    const { register, handleSubmit, setValue } = useForm();


    useEffect(() => {
        async function loadCategories() {
            try {
                const { data } = await getCategories();
                setCategories(data.categories);
            } catch (error) {
                console.error(error);
            }
        }

        loadCategories();
    }, []);


    useEffect(() => {
        if (isEdit) {
            loadProduct();
        }
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
            setValue("gender", product.gender || "");
            setValue("category", product.category?._id || "");

            setExistingImages(product.images || []);



            let productSizes = product.sizes || [];



            if (
                Array.isArray(productSizes) &&
                productSizes.length === 1 &&
                typeof productSizes[0] === "string"
            ) {
                try {
                    productSizes = JSON.parse(productSizes[0]);
                } catch (error) {
                    console.error("Failed to parse sizes:", error);
                    productSizes = [];
                }
            }


            productSizes = productSizes
                .map((item) => {
                    if (typeof item === "string") {
                        try {
                            return JSON.parse(item);
                        } catch (error) {
                            console.error("Invalid size item:", item);
                            return null;
                        }
                    }

                    return item;
                })
                .filter(Boolean);


            productSizes = productSizes
                .map((item) => ({
                    size: Number(item.size),
                    stock: Number(item.stock || 0),
                }))
                .filter((item) => !Number.isNaN(item.size));

            console.log("ADMIN NORMALIZED SIZES:", productSizes);

            setSizes(productSizes);

        } catch (error) {
            console.error("Failed to load product:", error);
            toast.error("Failed to load product.");
        }
    };


    const removeImage = async (imageId) => {
        const confirmDelete = window.confirm(
            "Delete this image?"
        );

        if (!confirmDelete) return;

        try {
            await deleteProductImage(id, imageId);

            setExistingImages((prev) =>
                prev.filter((img) => img.public_id !== imageId)
            );

            toast.success("Image deleted successfully.");
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                "Failed to delete image."
            );
        }
    };





    const handleImages = (e) => {
        const files = [...e.target.files];

        setPreview(files.map((file) => URL.createObjectURL(file)));
    };


    const handleSizeChange = (index, field, value) => {
        setSizes((prev) =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [field]: Number(value),
                    }
                    : item
            )
        );
    };

    const addSizeRow = () => {
        setSizes([
            ...sizes,
            {
                size: "",
                stock: 0,
            },
        ]);
    };

    const removeSizeRow = (index) => {
        const updated = [...sizes];

        updated.splice(index, 1);

        setSizes(updated);
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
            formData.append("brand", data.brand);
            formData.append("gender", data.gender);
            formData.append("category", data.category);
            formData.append("sizes", JSON.stringify(sizes));

            for (let image of data.images) {
                formData.append("images", image);
            }

            let response;

            if (isEdit) {
                response = await updateProduct(id, formData);
            } else {
                response = await createProduct(formData);
            }

            toast.success(
                response.data.message ||
                (isEdit
                    ? "Product updated successfully"
                    : "Product created successfully")
            );

            navigate("/admin/products");

        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                (isEdit
                    ? "Failed to update product"
                    : "Failed to create product")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid">

            <h2 className="mb-4">
                {isEdit ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)}>

                <div className="card shadow-sm">

                    <div className="card-body">

                        <div className="row">

                            {/* Product Name */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Product Name</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("name")}
                                />
                            </div>

                            {/* Category */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Category</label>

                                <select
                                    className="form-select"
                                    {...register("category")}
                                >
                                    <option value="">Select Category</option>

                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Brand */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Brand</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    {...register("brand")}
                                />
                            </div>

                            {/* Gender */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Gender</label>

                                <select
                                    className="form-select"
                                    {...register("gender")}
                                >
                                    <option value="Men">Men</option>
                                    <option value="Women">Women</option>
                                    <option value="Kids">Kids</option>
                                    <option value="Unisex">Unisex</option>
                                </select>
                            </div>

                            {/* Price */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Price</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    {...register("price")}
                                />
                            </div>

                            {/* Discount Price */}
                            {/* Discount */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Discount (%)</label>

                                <select
                                    className="form-select"
                                    {...register("discount")}
                                >
                                    <option value="0">No Discount</option>
                                    <option value="5">5%</option>
                                    <option value="10">10%</option>
                                    <option value="15">15%</option>
                                    <option value="20">20%</option>
                                    <option value="25">25%</option>
                                    <option value="30">30%</option>
                                    <option value="40">40%</option>
                                    <option value="50">50%</option>
                                    <option value="60">60%</option>
                                    <option value="70">70%</option>
                                    <option value="80">80%</option>
                                </select>
                            </div>

                            {/* Stock */}
                            <div className="col-md-4 mb-3">
                                <label className="form-label">Stock</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    {...register("stock")}
                                />
                            </div>



                            <div className="col-12 mb-4">
                                {/* Headings */}
                                <div className="row mb-2">
                                    <div className="col-md-5">
                                        <label className="form-label fw-bold">
                                            Product Size
                                        </label>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">
                                            Product Stock
                                        </label>
                                    </div>

                                    <div className="col-md-2"></div>
                                </div>

                                {/* Rows */}
                                {sizes.map((item, index) => (
                                    <div className="row mb-3 align-items-center" key={index}>
                                        <div className="col-md-5">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Size"
                                                value={item.size}
                                                onChange={(e) =>
                                                    handleSizeChange(index, "size", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-md-4">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Stock"
                                                value={item.stock}
                                                onChange={(e) =>
                                                    handleSizeChange(index, "stock", e.target.value)
                                                }
                                            />
                                        </div>

                                        <div className="col-md-3">
                                            <button
                                                type="button"
                                                className="btn btn-danger w-100"
                                                onClick={() => removeSizeRow(index)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    className="btn btn-success mt-2"
                                    onClick={addSizeRow}
                                >
                                    + Add Size
                                </button>
                            </div>




                            {/* Description */}
                            <div className="col-12 mb-3">
                                <label className="form-label">Description</label>

                                <textarea
                                    rows="5"
                                    className="form-control"
                                    {...register("description")}
                                ></textarea>
                            </div>

                            {/* Images */}
                            <div className="col-12 mb-3">
                                <label className="form-label">Product Images</label>

                                {isEdit && existingImages.length > 0 && (

                                    <div className="row mb-3">

                                        {existingImages.map((img) => (
                                            <div
                                                key={img.public_id}
                                                className="col-md-2 position-relative mb-3"
                                            >

                                                <img
                                                    src={img.url}
                                                    alt=""
                                                    className="img-fluid rounded border"
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        objectFit: "cover",
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                                    onClick={() => removeImage(img.public_id)}
                                                >
                                                    ×
                                                </button>

                                            </div>
                                        ))}
                                    </div>

                                )}

                                <input
                                    type="file"
                                    multiple
                                    className="form-control"
                                    {...register("images")}
                                    onChange={(e) => {
                                        handleImages(e);
                                    }}
                                />

                                {/* Preview */}
                                <div className="row mt-3">

                                    {preview.map((img, index) => (
                                        <div className="col-md-2 col-4 mb-3" key={index}>

                                            <img
                                                src={img}
                                                alt="Preview"
                                                className="img-fluid rounded border"
                                                style={{
                                                    width: "120px",
                                                    height: "120px",
                                                    objectFit: "cover",
                                                }}
                                            />

                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-4">

                    <button
                        type="submit"
                        className="btn btn-primary px-5"
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Product"
                                : "Save Product"}
                    </button>

                </div>

            </form>

        </div>
    );
}