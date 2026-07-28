import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createProduct, deleteProductImage, getCategories, getProduct, updateProduct, } from "../services/adminApi";
import { useNavigate, useParams } from "react-router-dom";

export default function AddProduct() {

    const [categories, setCategories] = useState([]);
    const [preview, setPreview] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

            setValue("name", product.name);
            setValue("description", product.description);
            setValue("price", product.price);
            setValue("discount", product.discount);
            setValue("stock", product.stock);
            setValue("brand", product.brand);
            setValue("gender", product.gender);
            setValue("category", product.category?._id);
            setExistingImages(product.images || []);
        } catch (error) {
            console.error(error);
            alert("Failed to load product.");
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

            alert("Image deleted successfully.");
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Failed to delete image."
            );
        }
    };





    const handleImages = (e) => {
        const files = [...e.target.files];

        setPreview(files.map((file) => URL.createObjectURL(file)));
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

            for (let image of data.images) {
                formData.append("images", image);
            }

            let response;

            if (isEdit) {
                response = await updateProduct(id, formData);
            } else {
                response = await createProduct(formData);
            }

            alert(response.data.message);

            navigate("/admin/products");

        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to create product");
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