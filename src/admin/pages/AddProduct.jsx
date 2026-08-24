import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

import api from "../../api/axios";

export default function AddProduct() {
    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = Boolean(id);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [loadingProduct, setLoadingProduct] = useState(false);

    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const [compressingImages, setCompressingImages] = useState(false);

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    const [sizeInput, setSizeInput] = useState("");
    const [colorInput, setColorInput] = useState("");

    const images = watch("images");

    /* =========================================================
       LOAD PRODUCT IN EDIT MODE
    ========================================================= */

    useEffect(() => {
        if (!isEditMode) return;

        const loadProduct = async () => {
            try {
                setLoadingProduct(true);

                const { data } = await api.get(
                    `/products/${id}`
                );

                const product = data.product || data;

                if (!product) {
                    toast.error("Product not found");
                    navigate("/admin/products");
                    return;
                }

                reset({
                    name: product.name || "",
                    description: product.description || "",
                    brand: product.brand || "",
                    gender: product.gender || "Unisex",
                    price: product.price || "",
                    discount: product.discount || 0,
                    stock: product.stock || 0,
                    sku: product.sku || "",
                    category:
                        product.category?._id ||
                        product.category ||
                        "",
                    featured: product.featured || false,
                    isActive:
                        product.isActive !== undefined
                            ? product.isActive
                            : true,
                });

                setSizes(product.sizes || []);
                setColors(product.colors || []);

                setExistingImages(
                    product.images || []
                );

            } catch (error) {
                console.error(
                    "Load product error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load product"
                );

            } finally {
                setLoadingProduct(false);
            }
        };

        loadProduct();
    }, [id, isEditMode, navigate, reset]);

    /* =========================================================
       IMAGE COMPRESSION
    ========================================================= */

    const compressImage = async (file) => {
        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1600,
            useWebWorker: true,
            fileType: "image/webp",
            initialQuality: 0.82,
        };

        try {
            const compressedFile =
                await imageCompression(
                    file,
                    options
                );

            /*
             * browser-image-compression can return a Blob.
             * Convert it back into a File so FormData
             * and your existing backend continue working.
             */

            const compressedImage = new File(
                [compressedFile],
                `${file.name.replace(
                    /\.[^/.]+$/,
                    ""
                )}.webp`,
                {
                    type: "image/webp",
                    lastModified: Date.now(),
                }
            );

            console.log(
                `${file.name}: ${(
                    file.size /
                    1024 /
                    1024
                ).toFixed(2)} MB → ${(
                    compressedImage.size /
                    1024 /
                    1024
                ).toFixed(2)} MB`
            );

            return compressedImage;

        } catch (error) {
            console.error(
                "Image compression failed:",
                error
            );

            throw error;
        }
    };

    /* =========================================================
       HANDLE NEW IMAGES
    ========================================================= */

    const handleImages = async (event) => {
        const selectedFiles = Array.from(
            event.target.files || []
        );

        if (!selectedFiles.length) {
            return;
        }

        /*
         * Existing images + newly selected images
         * should not exceed 5.
         */

        const totalImageCount =
            existingImages.length +
            selectedFiles.length;

        if (totalImageCount > 5) {
            toast.error(
                "Maximum 5 product images are allowed."
            );

            event.target.value = "";
            return;
        }

        try {
            setCompressingImages(true);

            const compressedFiles = [];

            for (const file of selectedFiles) {

                if (
                    !file.type ||
                    !file.type.startsWith("image/")
                ) {
                    toast.error(
                        `${file.name} is not a valid image.`
                    );

                    continue;
                }

                const compressed =
                    await compressImage(file);

                compressedFiles.push(
                    compressed
                );
            }

            if (!compressedFiles.length) {
                toast.error(
                    "No valid images selected."
                );

                return;
            }

            /*
             * Store compressed files in React Hook Form.
             * Your existing submit handler will therefore
             * upload compressed files instead of originals.
             */

            setValue(
                "images",
                compressedFiles,
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );

            /*
             * Create previews from compressed files.
             */

            const previews =
                compressedFiles.map(
                    (file) =>
                        URL.createObjectURL(file)
                );

            setImagePreviews(
                (previous) => [
                    ...previous,
                    ...previews,
                ]
            );

            const originalSize =
                selectedFiles.reduce(
                    (total, file) =>
                        total + file.size,
                    0
                );

            const compressedSize =
                compressedFiles.reduce(
                    (total, file) =>
                        total + file.size,
                    0
                );

            toast.success(
                `${compressedFiles.length} image(s) compressed and ready`
            );

            console.log(
                "Original total:",
                (
                    originalSize /
                    1024 /
                    1024
                ).toFixed(2),
                "MB"
            );

            console.log(
                "Compressed total:",
                (
                    compressedSize /
                    1024 /
                    1024
                ).toFixed(2),
                "MB"
            );

        } catch (error) {

            console.error(
                "Image processing error:",
                error
            );

            toast.error(
                "Unable to process images."
            );

        } finally {

            setCompressingImages(false);

            /*
             * Allows selecting the same image again.
             */

            event.target.value = "";
        }
    };

    /* =========================================================
       REMOVE NEW IMAGE
    ========================================================= */

    const removeNewImage = (index) => {
        const currentImages =
            watch("images") || [];

        const currentPreviews =
            imagePreviews || [];

        /*
         * Revoke object URL to avoid memory leaks.
         */

        if (currentPreviews[index]) {
            URL.revokeObjectURL(
                currentPreviews[index]
            );
        }

        const newImages =
            currentImages.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            );

        const newPreviews =
            currentPreviews.filter(
                (_, imageIndex) =>
                    imageIndex !== index
            );

        setValue(
            "images",
            newImages,
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );

        setImagePreviews(
            newPreviews
        );
    };

    /* =========================================================
       REMOVE EXISTING CLOUDINARY IMAGE
    ========================================================= */

    const removeExistingImage = async (
        imageIndex
    ) => {
        if (!isEditMode) return;

        try {
            /*
             * If your backend already has a dedicated
             * image-delete endpoint, use it here.
             *
             * Otherwise we only remove it from the
             * frontend list and send the remaining images
             * during update.
             */

            const updatedImages =
                existingImages.filter(
                    (_, index) =>
                        index !== imageIndex
                );

            setExistingImages(
                updatedImages
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Unable to remove image."
            );
        }
    };

    /* =========================================================
       ADD SIZE
    ========================================================= */

    const addSize = () => {
        const value =
            String(sizeInput).trim();

        if (!value) {
            toast.error(
                "Enter a size."
            );
            return;
        }

        const numericValue =
            Number(value);

        if (
            Number.isNaN(numericValue)
        ) {
            toast.error(
                "Size must be a number."
            );
            return;
        }

        if (
            sizes.some(
                (item) =>
                    Number(item.size) ===
                    numericValue
            )
        ) {
            toast.error(
                "This size already exists."
            );
            return;
        }

        setSizes([
            ...sizes,
            {
                size: numericValue,
                stock: 0,
            },
        ]);

        setSizeInput("");
    };

    /* =========================================================
       REMOVE SIZE
    ========================================================= */

    const removeSize = (index) => {
        setSizes(
            sizes.filter(
                (_, i) => i !== index
            )
        );
    };

    /* =========================================================
       UPDATE SIZE STOCK
    ========================================================= */

    const updateSizeStock = (
        index,
        stock
    ) => {
        const updated = [...sizes];

        updated[index] = {
            ...updated[index],
            stock: Math.max(
                0,
                Number(stock) || 0
            ),
        };

        setSizes(updated);
    };

    /* =========================================================
       ADD COLOR
    ========================================================= */

    const addColor = () => {
        const value =
            String(colorInput).trim();

        if (!value) {
            toast.error(
                "Enter a color."
            );
            return;
        }

        if (
            colors.some(
                (color) =>
                    color.toLowerCase() ===
                    value.toLowerCase()
            )
        ) {
            toast.error(
                "This color already exists."
            );
            return;
        }

        setColors([
            ...colors,
            value,
        ]);

        setColorInput("");
    };

    /* =========================================================
       REMOVE COLOR
    ========================================================= */

    const removeColor = (index) => {
        setColors(
            colors.filter(
                (_, i) => i !== index
            )
        );
    };

    /* =========================================================
       SUBMIT PRODUCT
    ========================================================= */

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const formData =
                new FormData();

            formData.append(
                "name",
                data.name
            );

            formData.append(
                "description",
                data.description
            );

            formData.append(
                "brand",
                data.brand || ""
            );

            formData.append(
                "gender",
                data.gender || "Unisex"
            );

            formData.append(
                "price",
                data.price
            );

            formData.append(
                "discount",
                data.discount || 0
            );

            formData.append(
                "stock",
                data.stock || 0
            );

            formData.append(
                "sku",
                data.sku
            );

            formData.append(
                "category",
                data.category
            );

            formData.append(
                "featured",
                data.featured
                    ? "true"
                    : "false"
            );

            formData.append(
                "isActive",
                data.isActive !== false
                    ? "true"
                    : "false"
            );

            /* =================================================
               SIZES
            ================================================= */

            formData.append(
                "sizes",
                JSON.stringify(sizes)
            );

            /* =================================================
               COLORS
            ================================================= */

            formData.append(
                "colors",
                JSON.stringify(colors)
            );

            /* =================================================
               EXISTING IMAGES
               Used during edit mode.
            ================================================= */

            if (isEditMode) {

                formData.append(
                    "existingImages",
                    JSON.stringify(
                        existingImages
                    )
                );
            }

            /* =================================================
               NEW COMPRESSED IMAGES
            ================================================= */

            const newImages =
                data.images || [];

            newImages.forEach(
                (image) => {

                    formData.append(
                        "images",
                        image
                    );
                }
            );

            /* =================================================
               API REQUEST
            ================================================= */

            let response;

            if (isEditMode) {

                response =
                    await api.put(
                        `/products/${id}`,
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data",
                            },
                        }
                    );

            } else {

                response =
                    await api.post(
                        "/products",
                        formData,
                        {
                            headers: {
                                "Content-Type":
                                    "multipart/form-data",
                            },
                        }
                    );
            }

            toast.success(
                response.data?.message ||
                (
                    isEditMode
                        ? "Product updated successfully"
                        : "Product created successfully"
                )
            );

            navigate(
                "/admin/products"
            );

        } catch (error) {

            console.error(
                "Product submit error:",
                error
            );

            toast.error(
                error.response?.data
                    ?.message ||
                "Unable to save product."
            );

        } finally {

            setLoading(false);
        }
    };

    /* =========================================================
       CLEANUP PREVIEWS
    ========================================================= */

    useEffect(() => {
        return () => {

            imagePreviews.forEach(
                (url) => {
                    URL.revokeObjectURL(
                        url
                    );
                }
            );

        };
    }, [imagePreviews]);

    /* =========================================================
       LOADING
    ========================================================= */

    if (loadingProduct) {
        return (
            <div className="container py-5 text-center">
                <div
                    className="spinner-border"
                    role="status"
                />

                <p className="mt-3">
                    Loading product...
                </p>
            </div>
        );
    }

    /* =========================================================
       UI
    ========================================================= */

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="mb-1">
                        {isEditMode
                            ? "Edit Product"
                            : "Add Product"}
                    </h2>

                    <p className="text-muted mb-0">
                        {isEditMode
                            ? "Update product information"
                            : "Create a new product"}
                    </p>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={() =>
                        navigate(
                            "/admin/products"
                        )
                    }
                >
                    Back
                </button>

            </div>

            <form
                onSubmit={handleSubmit(
                    onSubmit
                )}
            >

                {/* =================================================
                   BASIC INFORMATION
                ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h5 className="mb-4">
                            Basic Information
                        </h5>

                        <div className="row g-3">

                            {/* NAME */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    Product Name *
                                </label>

                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.name
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register(
                                        "name",
                                        {
                                            required:
                                                "Product name is required",
                                        }
                                    )}
                                />

                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {
                                            errors.name
                                                .message
                                        }
                                    </div>
                                )}

                            </div>

                            {/* SKU */}

                            <div className="col-md-6">

                                <label className="form-label">
                                    SKU *
                                </label>

                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.sku
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register(
                                        "sku",
                                        {
                                            required:
                                                "SKU is required",
                                        }
                                    )}
                                />

                                {errors.sku && (
                                    <div className="invalid-feedback">
                                        {
                                            errors.sku
                                                .message
                                        }
                                    </div>
                                )}

                            </div>

                            {/* DESCRIPTION */}

                            <div className="col-12">

                                <label className="form-label">
                                    Description *
                                </label>

                                <textarea
                                    rows="5"
                                    className={`form-control ${
                                        errors.description
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register(
                                        "description",
                                        {
                                            required:
                                                "Description is required",
                                        }
                                    )}
                                />

                                {errors.description && (
                                    <div className="invalid-feedback">
                                        {
                                            errors
                                                .description
                                                .message
                                        }
                                    </div>
                                )}

                            </div>

                            {/* BRAND */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Brand
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    {...register(
                                        "brand"
                                    )}
                                />

                            </div>

                            {/* GENDER */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Gender
                                </label>

                                <select
                                    className="form-select"
                                    {...register(
                                        "gender"
                                    )}
                                >
                                    <option value="Unisex">
                                        Unisex
                                    </option>

                                    <option value="Men">
                                        Men
                                    </option>

                                    <option value="Women">
                                        Women
                                    </option>

                                    <option value="Kids">
                                        Kids
                                    </option>
                                </select>

                            </div>

                            {/* CATEGORY */}

                            <div className="col-md-4">

                                <label className="form-label">
                                    Category *
                                </label>

                                <input
                                    type="text"
                                    className={`form-control ${
                                        errors.category
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register(
                                        "category",
                                        {
                                            required:
                                                "Category is required",
                                        }
                                    )}
                                />

                                {errors.category && (
                                    <div className="invalid-feedback">
                                        {
                                            errors
                                                .category
                                                .message
                                        }
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                   PRICE / STOCK
                ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h5 className="mb-4">
                            Pricing & Stock
                        </h5>

                        <div className="row g-3">

                            <div className="col-md-4">

                                <label className="form-label">
                                    Price *
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className={`form-control ${
                                        errors.price
                                            ? "is-invalid"
                                            : ""
                                    }`}
                                    {...register(
                                        "price",
                                        {
                                            required:
                                                "Price is required",
                                            min: {
                                                value: 0,
                                                message:
                                                    "Price cannot be negative",
                                            },
                                        }
                                    )}
                                />

                                {errors.price && (
                                    <div className="invalid-feedback">
                                        {
                                            errors
                                                .price
                                                .message
                                        }
                                    </div>
                                )}

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Discount (%)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    className="form-control"
                                    {...register(
                                        "discount"
                                    )}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    className="form-control"
                                    {...register(
                                        "stock"
                                    )}
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                   SIZES
                ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h5 className="mb-3">
                            Sizes
                        </h5>

                        <div className="d-flex gap-2 mb-3">

                            <input
                                type="number"
                                className="form-control"
                                placeholder="Enter size"
                                value={sizeInput}
                                onChange={(e) =>
                                    setSizeInput(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={addSize}
                            >
                                Add
                            </button>

                        </div>

                        {sizes.length > 0 && (

                            <div className="table-responsive">

                                <table className="table align-middle">

                                    <thead>
                                        <tr>
                                            <th>
                                                Size
                                            </th>

                                            <th>
                                                Stock
                                            </th>

                                            <th>
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {sizes.map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <tr
                                                    key={`${item.size}-${index}`}
                                                >

                                                    <td>
                                                        {item.size}
                                                    </td>

                                                    <td>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="form-control"
                                                            value={
                                                                item.stock ??
                                                                0
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                updateSizeStock(
                                                                    index,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                    </td>

                                                    <td>

                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() =>
                                                                removeSize(
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

                {/* =================================================
                   COLORS
                ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h5 className="mb-3">
                            Colors
                        </h5>

                        <div className="d-flex gap-2 mb-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter color"
                                value={colorInput}
                                onChange={(e) =>
                                    setColorInput(
                                        e.target.value
                                    )
                                }
                            />

                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={addColor}
                            >
                                Add
                            </button>

                        </div>

                        <div className="d-flex flex-wrap gap-2">

                            {colors.map(
                                (
                                    color,
                                    index
                                ) => (

                                    <div
                                        key={`${color}-${index}`}
                                        className="badge bg-light text-dark border p-2"
                                    >

                                        {color}

                                        <button
                                            type="button"
                                            className="btn btn-sm p-0 ms-2"
                                            onClick={() =>
                                                removeColor(
                                                    index
                                                )
                                            }
                                        >
                                            ×
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

                {/* =================================================
                   PRODUCT IMAGES
                ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h5 className="mb-2">
                            Product Images
                        </h5>

                        <p className="text-muted small mb-3">
                            You can upload up to 5 images.
                            Large images are automatically
                            compressed before upload.
                        </p>

                        <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            multiple
                            onChange={handleImages}
                            disabled={
                                compressingImages
                            }
                        />

                        {compressingImages && (
                            <div className="mt-3">

                                <div className="d-flex align-items-center">

                                    <div
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                    />

                                    <span className="ms-2">
                                        Compressing images...
                                    </span>

                                </div>

                            </div>
                        )}

                        {/* =================================================
                           EXISTING IMAGES
                        ================================================= */}

                        {existingImages.length >
                            0 && (

                            <div className="mt-4">

                                <h6>
                                    Existing Images
                                </h6>

                                <div className="d-flex flex-wrap gap-3">

                                    {existingImages.map(
                                        (
                                            image,
                                            index
                                        ) => (

                                            <div
                                                key={
                                                    image.public_id ||
                                                    image._id ||
                                                    index
                                                }
                                                style={{
                                                    position:
                                                        "relative",
                                                    width: 140,
                                                }}
                                            >

                                                <img
                                                    src={
                                                        image.url
                                                    }
                                                    alt={`Product ${
                                                        index +
                                                        1
                                                    }`}
                                                    style={{
                                                        width:
                                                            "140px",
                                                        height:
                                                            "160px",
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "8px",
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    style={{
                                                        position:
                                                            "absolute",
                                                        top: 5,
                                                        right: 5,
                                                    }}
                                                    onClick={() =>
                                                        removeExistingImage(
                                                            index
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>
                        )}

                        {/* =================================================
                           NEW IMAGE PREVIEWS
                        ================================================= */}

                        {imagePreviews.length >
                            0 && (

                            <div className="mt-4">

                                <h6>
                                    New Images
                                </h6>

                                <div className="d-flex flex-wrap gap-3">

                                    {imagePreviews.map(
                                        (
                                            preview,
                                            index
                                        ) => (

                                            <div
                                                key={`${preview}-${index}`}
                                                style={{
                                                    position:
                                                        "relative",
                                                    width: 140,
                                                }}
                                            >

                                                <img
                                                    src={
                                                        preview
                                                    }
                                                    alt={`New product ${
                                                        index +
                                                        1
                                                    }`}
                                                    style={{
                                                        width:
                                                            "140px",
                                                        height:
                                                            "160px",
                                                        objectFit:
                                                            "cover",
                                                        borderRadius:
                                                            "8px",
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm"
                                                    style={{
                                                        position:
                                                            "absolute",
                                                        top: 5,
                                                        right: 5,
                                                    }}
                                                    onClick={() =>
                                                        removeNewImage(
                                                            index
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>
                        )}

                    </div>

                </div>

                {/* =================================================
                   OPTIONS
                ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <h5 className="mb-4">
                            Product Settings
                        </h5>

                        <div className="row">

                            <div className="col-md-6">

                                <div className="form-check">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="featured"
                                        {...register(
                                            "featured"
                                        )}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="featured"
                                    >
                                        Featured Product
                                    </label>

                                </div>

                            </div>

                            <div className="col-md-6">

                                <div className="form-check">

                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="isActive"
                                        defaultChecked
                                        {...register(
                                            "isActive"
                                        )}
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="isActive"
                                    >
                                        Active Product
                                    </label>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                   SUBMIT
                ================================================= */}

                <div className="d-flex justify-content-end gap-2 mb-5">

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={
                            loading ||
                            compressingImages
                        }
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn btn-dark px-4"
                        disabled={
                            loading ||
                            compressingImages
                        }
                    >

                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                />

                                {isEditMode
                                    ? "Updating..."
                                    : "Creating..."}
                            </>
                        ) : (
                            isEditMode
                                ? "Update Product"
                                : "Create Product"
                        )}

                    </button>

                </div>

            </form>

        </div>
    );
}