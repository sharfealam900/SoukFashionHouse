import React, { useEffect, useMemo, useState } from "react";
import { Badge, Spinner, Table, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getCoupons,
  deleteCoupon,
} from "../services/couponApi";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const { data } = await getCoupons();

      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch coupons."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const filteredCoupons = useMemo(() => {
    const keyword = search.toLowerCase();

    return coupons.filter((coupon) =>
      coupon.code.toLowerCase().includes(keyword)
    );
  }, [coupons, search]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this coupon?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCoupon(id);

      toast.success("Coupon deleted successfully.");

      fetchCoupons();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete coupon."
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

        <h2 className="fw-bold">
          Coupons
        </h2>

        <Link
          to="/admin/coupons/new"
          className="btn btn-dark"
        >
          + Create Coupon
        </Link>

      </div>

      <div className="d-flex justify-content-end mb-3">

        <Form.Control
          style={{ maxWidth: "320px" }}
          placeholder="Search Coupon..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

            <Table
        bordered
        hover
        responsive
        className="align-middle"
      >
        <thead className="table-dark">
          <tr>
            <th>Coupon Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Min Order</th>
            <th>Max Discount</th>
            <th>Used</th>
            <th>Expiry</th>
            <th>Status</th>
            <th style={{ width: "180px" }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredCoupons.length === 0 ? (
            <tr>
              <td
                colSpan="9"
                className="text-center py-5"
              >
                No coupons found.
              </td>
            </tr>
          ) : (
            filteredCoupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>
                  <strong>{coupon.code}</strong>
                </td>

                <td className="text-capitalize">
                  {coupon.discountType}
                </td>

                <td>
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`}
                </td>

                <td>
                  ₹
                  {coupon.minimumOrderAmount?.toLocaleString(
                    "en-IN"
                  )}
                </td>

                <td>
                  ₹
                  {coupon.maximumDiscount?.toLocaleString(
                    "en-IN"
                  )}
                </td>

                <td>
                  {coupon.usedCount} / {coupon.usageLimit}
                </td>

                <td>
                  {new Date(
                    coupon.expiresAt
                  ).toLocaleDateString("en-IN")}
                </td>

                <td>
                  {coupon.isActive ? (
                    <Badge bg="success">
                      Active
                    </Badge>
                  ) : (
                    <Badge bg="danger">
                      Inactive
                    </Badge>
                  )}
                </td>

                <td>

                  <div className="d-flex gap-2">

                    <Link
                      to={`/admin/coupons/edit/${coupon._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() =>
                        handleDelete(coupon._id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </td>

              </tr>
            ))
          )}
        </tbody>
      </Table>

    </div>
  );
}