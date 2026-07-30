import React, {
    useEffect,
    useState,
} from "react";

import {
    Form,
    Button,
    Card,
    Spinner,
} from "react-bootstrap";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    createBanner,
    updateBanner,
    getBanner,
} from "../services/bannerApi";

export default function AddBanner() {
    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);

    const [loading, setLoading] =
        useState(false);

    const [preview, setPreview] =
        useState("");

    const [formData, setFormData] =
        useState({
            title: "",
            subtitle: "",
            buttonText: "Shop Now",
            buttonLink: "/shop",
            displayOrder: 1,
            isActive: true,
            image: null,
        });

    useEffect(() => {
        if (isEdit) {
            loadBanner();
        }
    }, []);

    const loadBanner = async () => {
        try {
            setLoading(true);

            const { data } =
                await getBanner(id);

            setFormData({
                title: data.banner.title,
                subtitle:
                    data.banner.subtitle,
                buttonText:
                    data.banner.buttonText,
                buttonLink:
                    data.banner.buttonLink,
                displayOrder:
                    data.banner.displayOrder,
                isActive:
                    data.banner.isActive,
                image: null,
            });

            setPreview(data.banner.image);

        } catch (error) {
            toast.error(
                "Unable to load banner."
            );
        } finally {
            setLoading(false);
        }
    };

    const changeHandler = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const imageHandler = (e) => {
        const file =
            e.target.files[0];

        if (!file) return;

        setFormData((prev) => ({
            ...prev,
            image: file,
        }));

        setPreview(
            URL.createObjectURL(file)
        );
    };

    const submitHandler = async (
        e
    ) => {
        e.preventDefault();

        try {
            setLoading(true);

            const data =
                new FormData();

            data.append(
                "title",
                formData.title
            );

            data.append(
                "subtitle",
                formData.subtitle
            );

            data.append(
                "buttonText",
                formData.buttonText
            );

            data.append(
                "buttonLink",
                formData.buttonLink
            );

            data.append(
                "displayOrder",
                formData.displayOrder
            );

            data.append(
                "isActive",
                formData.isActive
            );

            if (formData.image) {
                data.append(
                    "images",
                    formData.image
                );
            }

            if (isEdit) {
                await updateBanner(id, data);

                toast.success(
                    "Banner updated successfully."
                );
            } else {
                await createBanner(data);

                toast.success(
                    "Banner created successfully."
                );
            }

            navigate("/admin/banners");

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">

            <Card className="shadow">

                <Card.Body>

                    <h3 className="mb-4">

                        {isEdit
                            ? "Edit Banner"
                            : "Add Banner"}

                    </h3>

                    <Form onSubmit={submitHandler}>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Banner Title
                            </Form.Label>

                            <Form.Control
                                name="title"
                                value={formData.title}
                                onChange={changeHandler}
                                required
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Subtitle
                            </Form.Label>

                            <Form.Control
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={changeHandler}
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Button Text
                            </Form.Label>

                            <Form.Control
                                name="buttonText"
                                value={formData.buttonText}
                                onChange={changeHandler}
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Button Link
                            </Form.Label>

                            <Form.Control
                                name="buttonLink"
                                value={formData.buttonLink}
                                onChange={changeHandler}
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">

                            <Form.Label>
                                Display Order
                            </Form.Label>

                            <Form.Control
                                type="number"
                                min="1"
                                name="displayOrder"
                                value={formData.displayOrder}
                                onChange={changeHandler}
                            />

                        </Form.Group>

                        <Form.Group className="mb-3">

                            <Form.Check
                                type="switch"
                                label="Active Banner"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={changeHandler}
                            />

                        </Form.Group>

                        <Form.Group className="mb-4">

                            <Form.Label>
                                Banner Image
                            </Form.Label>

                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={imageHandler}
                            />

                        </Form.Group>

                        {preview && (

                            <div className="mb-4">

                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="img-fluid rounded border"
                                    style={{
                                        maxHeight: "250px",
                                        objectFit: "cover",
                                    }}
                                />

                            </div>

                        )}

                        <div className="d-flex gap-2">

                            <Button
                                type="submit"
                                disabled={loading}
                            >

                                {loading ? (

                                    <>
                                        <Spinner
                                            animation="border"
                                            size="sm"
                                            className="me-2"
                                        />
                                        Saving...
                                    </>

                                ) : isEdit ? (

                                    "Update Banner"

                                ) : (

                                    "Create Banner"

                                )}

                            </Button>

                            <Button
                                variant="secondary"
                                onClick={() =>
                                    navigate("/admin/banners")
                                }
                            >
                                Cancel
                            </Button>

                        </div>

                    </Form>

                </Card.Body>

            </Card>

        </div>
    );
}