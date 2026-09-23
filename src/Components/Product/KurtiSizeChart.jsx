import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

const sizeData = [
    {
        size: 36,
        brandSize: "S",
        bust: "38",
        waist: "34",
        hip: "40",
        shoulder: "14",
        length: "44",
    },
    {
        size: 38,
        brandSize: "M",
        bust: "40",
        waist: "36",
        hip: "42",
        shoulder: "14.5",
        length: "44",
    },
    {
        size: 40,
        brandSize: "L",
        bust: "42",
        waist: "38",
        hip: "44",
        shoulder: "15",
        length: "44",
    },
    {
        size: 42,
        brandSize: "XL",
        bust: "44",
        waist: "40",
        hip: "46",
        shoulder: "15.5",
        length: "45",
    },
    {
        size: 44,
        brandSize: "XXL",
        bust: "46",
        waist: "42",
        hip: "48",
        shoulder: "16",
        length: "45",
    },
    {
        size: 46,
        brandSize: "3XL",
        bust: "48",
        waist: "44",
        hip: "50",
        shoulder: "16.5",
        length: "46",
    },
    {
        size: 48,
        brandSize: "4XL",
        bust: "50",
        waist: "46",
        hip: "52",
        shoulder: "17",
        length: "46",
    },
];

const KurtiSizeChart = ({ isOpen, onClose, productSizes = [] }) => {
    const [activeTab, setActiveTab] = useState("chart");

    if (!isOpen) {
        return null;
    }

    const availableSizes = productSizes.map((item) =>
        Number(
            typeof item === "object"
                ? item.size
                : item
        )
    );

    const isAvailable = (size) => {
        if (!availableSizes.length) {
            return true;
        }

        return availableSizes.includes(size);
    };

    return (
        <div
            className="souk-size-modal-overlay"
            onClick={onClose}
        >
            <div
                className="souk-size-modal"
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                <button
                    type="button"
                    className="souk-size-modal-close"
                    onClick={onClose}
                    aria-label="Close size chart"
                >
                    <FaTimes />
                </button>

                <div className="souk-size-modal-header">
                    <h2>Size Guide</h2>

                    <p>
                        Find your perfect fit
                    </p>
                </div>

                <div className="souk-size-tabs">
                    <button
                        type="button"
                        className={
                            activeTab === "chart"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("chart")
                        }
                    >
                        Size Chart
                    </button>

                    <button
                        type="button"
                        className={
                            activeTab === "measure"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActiveTab("measure")
                        }
                    >
                        How to Measure
                    </button>
                </div>

                {activeTab === "chart" && (
                    <div className="souk-size-chart-content">
                        <div className="souk-size-unit">
                            <span className="active">
                                in
                            </span>

                            <span>cm</span>
                        </div>

                        <div className="souk-size-table-wrapper">
                            <table className="souk-size-table">
                                <thead>
                                    <tr>
                                        <th>Size</th>
                                        <th>
                                            Brand Size
                                        </th>
                                        <th>
                                            Bust (in)
                                        </th>
                                        <th>
                                            Waist (in)
                                        </th>
                                        <th>
                                            Hip (in)
                                        </th>
                                        <th>
                                            Shoulder (in)
                                        </th>
                                        <th>
                                            Length (in)
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sizeData.map(
                                        (item) => {
                                            const available =
                                                isAvailable(
                                                    item.size
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        item.size
                                                    }
                                                    className={
                                                        available
                                                            ? ""
                                                            : "unavailable"
                                                    }
                                                >
                                                    <td>
                                                        <span
                                                            className={`souk-size-radio ${
                                                                available
                                                                    ? ""
                                                                    : "disabled"
                                                            }`}
                                                        />
                                                        {
                                                            item.size
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.brandSize
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.bust
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.waist
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.hip
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.shoulder
                                                        }
                                                    </td>

                                                    <td>
                                                        {
                                                            item.length
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="souk-size-note">
                            * Garment measurements are in inches
                        </div>

                        <div className="souk-size-help">
                            <strong>
                                Tip:
                            </strong>

                            <span>
                                If you are between two
                                sizes, choose the larger
                                size for a more comfortable
                                fit.
                            </span>
                        </div>
                    </div>
                )}

                {activeTab === "measure" && (
                    <div className="souk-measure-content">
                        <h3>
                            How to Measure
                        </h3>

                        <div className="souk-measure-item">
                            <div className="souk-measure-number">
                                1
                            </div>

                            <div>
                                <strong>
                                    Bust
                                </strong>

                                <p>
                                    Measure around the
                                    fullest part of your
                                    bust while keeping the
                                    measuring tape horizontal.
                                </p>
                            </div>
                        </div>

                        <div className="souk-measure-item">
                            <div className="souk-measure-number">
                                2
                            </div>

                            <div>
                                <strong>
                                    Waist
                                </strong>

                                <p>
                                    Measure around the
                                    narrowest part of your
                                    waist without pulling
                                    the tape too tight.
                                </p>
                            </div>
                        </div>

                        <div className="souk-measure-item">
                            <div className="souk-measure-number">
                                3
                            </div>

                            <div>
                                <strong>
                                    Hip
                                </strong>

                                <p>
                                    Measure around the
                                    fullest part of your
                                    hips.
                                </p>
                            </div>
                        </div>

                        <div className="souk-measure-item">
                            <div className="souk-measure-number">
                                4
                            </div>

                            <div>
                                <strong>
                                    Shoulder
                                </strong>

                                <p>
                                    Measure from one shoulder
                                    edge to the other across
                                    the back.
                                </p>
                            </div>
                        </div>

                        <div className="souk-measure-item">
                            <div className="souk-measure-number">
                                5
                            </div>

                            <div>
                                <strong>
                                    Kurti Length
                                </strong>

                                <p>
                                    Measure from the highest
                                    point of the shoulder
                                    down to the bottom hem.
                                </p>
                            </div>
                        </div>

                        <div className="souk-measure-tip">
                            For the best fit, compare these
                            measurements with a kurti that
                            fits you well.
                        </div>
                    </div>
                )}

                <div className="souk-size-modal-footer">
                    <span>
                        Need help choosing a size?
                    </span>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        CLOSE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KurtiSizeChart;