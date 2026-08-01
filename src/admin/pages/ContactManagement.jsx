import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../api/axios";

export default function ContactManagement() {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const getMessages = async () => {

        try {

            const { data } = await api.get("/contact/admin");

            setMessages(data.messages);

        } catch (error) {

            toast.error(error.response?.data?.message);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getMessages();

    }, []);

    const deleteMessage = async (id) => {

        if (!window.confirm("Delete this message?"))
            return;

        try {

            const { data } = await api.delete(
                `/contact/admin/${id}`
            );

            toast.success(data.message);

            getMessages();

        } catch (error) {

            toast.error(error.response?.data?.message);

        }

    };

    return (

        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h3>
                    Contact Messages
                </h3>

            </div>

            <div className="table-responsive">

                <table className="table table-bordered align-middle">

                    <thead className="table-dark">

                        <tr>

                            <th>#</th>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Phone</th>

                            <th>Subject</th>

                            <th>Status</th>

                            <th>Date</th>

                            <th>Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            loading ?

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center"
                                    >

                                        Loading...

                                    </td>

                                </tr>

                                :

                                messages.length === 0 ?

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="text-center"
                                        >

                                            No Messages

                                        </td>

                                    </tr>

                                    :

                                    messages.map((item, index) => (

                                        <tr key={item._id}>

                                            <td>

                                                {index + 1}

                                            </td>

                                            <td>

                                                {item.name}

                                            </td>

                                            <td>

                                                {item.email}

                                            </td>

                                            <td>

                                                {item.phone}

                                            </td>

                                            <td>

                                                {item.subject}

                                            </td>

                                            <td>

                                                <span
                                                    className={`badge ${item.status === "New"
                                                            ? "bg-danger"
                                                            : item.status === "Read"
                                                                ? "bg-warning text-dark"
                                                                : "bg-success"
                                                        }`}
                                                >

                                                    {item.status}

                                                </span>

                                            </td>

                                            <td>

                                                {
                                                    new Date(
                                                        item.createdAt
                                                    ).toLocaleDateString()
                                                }

                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-primary btn-sm me-2"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        deleteMessage(item._id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}