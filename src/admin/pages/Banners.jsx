import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Table,
    Spinner,
    Form,
} from "react-bootstrap";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
    getBanners,
    deleteBanner,
} from "../services/bannerApi";

export default function Banners() {
    const [banners, setBanners] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const fetchBanners = async () => {
        try {
            setLoading(true);

            const { data } =
                await getBanners();

            setBanners(data.banners || []);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to load banners."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const filteredBanners =
        useMemo(() => {
            const keyword =
                search.toLowerCase();

            return banners.filter((banner) =>
                banner.title
                    .toLowerCase()
                    .includes(keyword)
            );
        }, [search, banners]);

    const deleteHandler = async (
        id
    ) => {
        if (
            !window.confirm(
                "Delete this banner?"
            )
        )
            return;

        try {
            await deleteBanner(id);

            toast.success(
                "Banner deleted successfully."
            );

            fetchBanners();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to delete banner."
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">
                        Banner Management
                    </h2>

                    <p className="text-muted mb-0">
                        Total Banners :{" "}
                        {banners.length}
                    </p>

                </div>

                <Link
                    to="/admin/banners/new"
                    className="btn btn-primary"
                >
                    + Add Banner
                </Link>

            </div>

            <div className="row mb-3">

                <div className="col-md-4">

                    <Form.Control
                        placeholder="Search Banner..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>

            <Table
                bordered
                hover
                responsive
                className="align-middle"
            >

                <thead className="table-dark">

                    <tr>

                        <th>#</th>

                        <th>Image</th>

                        <th>Title</th>

                        <th>Status</th>

                        <th>Order</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>          
                    {filteredBanners.length === 0 ? (

                    <tr>

                        <td
                            colSpan="6"
                            className="text-center py-5"
                        >
                            No banners found.
                        </td>

                    </tr>

                ) : (

                    filteredBanners.map(
                        (banner, index) => (

                            <tr key={banner._id}>

                                <td>
                                    {index + 1}
                                </td>

                                <td>

                                    <img
                                        src={banner.image}
                                        alt={banner.title}
                                        width="120"
                                        height="60"
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: "6px",
                                        }}
                                    />

                                </td>

                                <td>

                                    <div className="fw-semibold">
                                        {banner.title}
                                    </div>

                                    <small className="text-muted">
                                        {banner.subtitle}
                                    </small>

                                </td>

                                <td>

                                    {banner.isActive ? (

                                        <span className="badge bg-success">
                                            Active
                                        </span>

                                    ) : (

                                        <span className="badge bg-secondary">
                                            Inactive
                                        </span>

                                    )}

                                </td>

                                <td>

                                    {banner.displayOrder}

                                </td>

                                <td>

                                    <div className="d-flex gap-2">

                                        <Link
                                            to={`/admin/banners/edit/${banner._id}`}
                                            className="btn btn-warning btn-sm"
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteHandler(
                                                    banner._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        )
                    )

                )}

                </tbody>

            </Table>

        </div>
    );
}