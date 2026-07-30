import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Spinner,
    Table,
    Form,
} from "react-bootstrap";

import toast from "react-hot-toast";

import {
    getSubscribers,
    deleteSubscriber,
    exportSubscribers,
} from "../services/subscriberApi";

export default function Subscribers() {
    const [subscribers, setSubscribers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const fetchSubscribers = async () => {
        try {
            setLoading(true);

            const { data } =
                await getSubscribers();

            setSubscribers(
                data.subscribers || []
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to fetch subscribers."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const filteredSubscribers =
        useMemo(() => {
            const keyword =
                search.toLowerCase();

            return subscribers.filter(
                (subscriber) =>
                    subscriber.email
                        .toLowerCase()
                        .includes(keyword)
            );
        }, [search, subscribers]);

    const deleteHandler = async (id) => {
        const confirmDelete =
            window.confirm(
                "Delete this subscriber?"
            );

        if (!confirmDelete) return;

        try {
            await deleteSubscriber(id);

            toast.success(
                "Subscriber deleted."
            );

            fetchSubscribers();
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Unable to delete."
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
                        Newsletter Subscribers
                    </h2>

                    <p className="text-muted mb-0">
                        Total Subscribers :
                        {" "}
                        {subscribers.length}
                    </p>

                </div>

                <button
                    className="btn btn-success"
                    onClick={exportSubscribers}
                >
                    Export CSV
                </button>

            </div>

            <div className="row mb-4">

                <div className="col-md-4">

                    <Form.Control
                        placeholder="Search email..."
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

                        <th>Email</th>

                        <th>
                            Subscription Date
                        </th>

                        <th>
                            Action
                        </th>

                    </tr>

                </thead>

                <tbody>
                    {filteredSubscribers.length === 0 ? (

                        <tr>

                            <td
                                colSpan="4"
                                className="text-center py-5"
                            >
                                No subscribers found.
                            </td>

                        </tr>

                    ) : (

                        filteredSubscribers.map(
                            (subscriber, index) => (

                                <tr key={subscriber._id}>

                                    <td>{index + 1}</td>

                                    <td>
                                        {subscriber.email}
                                    </td>

                                    <td>
                                        {new Date(
                                            subscriber.createdAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </td>

                                    <td>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteHandler(
                                                    subscriber._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

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