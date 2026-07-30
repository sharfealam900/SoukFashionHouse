import React, { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    Shield,
    Calendar,
    MapPin,
    Camera,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

import { updateProfile } from "../features/auth/authApi";
import { setUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(user?.avatar?.url || "");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
    });




    useEffect(() => {
        setPreview(user?.avatar?.url || "");
    }, [user]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [user]);

    if (!user) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setAvatar(file);

        setPreview(URL.createObjectURL(file));
    };



    const handleCancel = () => {
        setEditing(false);

        setAvatar(null);
        setPreview(user?.avatar?.url || "");

        setFormData({
            name: user.name || "",
            phone: user.phone || "",
            address: user.address || "",
        });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const profileData = new FormData();

            profileData.append("name", formData.name);
            profileData.append("phone", formData.phone);
            profileData.append("address", formData.address);

            if (avatar) {
                profileData.append("avatar", avatar);
            }

            const { data } = await updateProfile(profileData);

            dispatch(setUser(data.user));

            setAvatar(null);
            setPreview(data.user.avatar?.url || "");

            setEditing(false);

            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <section className="profile-page">
                <div className="profile-card">

                    <div className="profile-header">

                        <div className="profile-avatar">

                            {preview ? (
                                <img
                                    src={preview}
                                    alt={user.name}
                                />
                            ) : (
                                <div className="avatar-placeholder">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {editing && (
                                <>
                                    <label
                                        htmlFor="avatar"
                                        className="camera-btn"
                                    >
                                        <Camera size={18} />
                                    </label>

                                    <input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleImageChange}
                                    />
                                </>
                            )}

                        </div>
                        <div>
                            <h2>{user.name}</h2>

                            <p>
                                {user.role === "admin"
                                    ? "Administrator"
                                    : "Customer"}
                            </p>
                        </div>
                    </div>

                    <div>

                        {/* Name */}

                        <div className="info-row">
                            <User size={18} />

                            {editing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{user.name}</span>
                            )}
                        </div>

                        {/* Email */}

                        <div className="info-row">
                            <Mail size={18} />

                            <span>{user.email}</span>
                        </div>

                        {/* Phone */}

                        <div className="info-row">
                            <Phone size={18} />

                            {editing ? (
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="address-display">
                                    {user.phone || "Not added"}
                                </p>
                            )}
                        </div>

                        {/* Address Field */}

                        <div className="info-row">
                            <MapPin size={18} />

                            {editing ? (
                                <textarea
                                    name="address"
                                    rows={4}
                                    placeholder="Enter your complete address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="address-textarea"
                                />
                            ) : (
                                <p className="address-display">
                                    {user.address || "No address added"}
                                </p>
                            )}
                        </div>



                        {/* Role */}

                        <div className="info-row">
                            <Shield size={18} />

                            <span>{user.role}</span>
                        </div>

                        {/* Joined */}

                        <div className="info-row">
                            <Calendar size={18} />

                            <span>
                                Joined{" "}
                                {new Date(
                                    user.createdAt
                                ).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="profile-actions">

                            {!editing ? (
                                <>
                                    <button
                                        type="button"
                                        className="btn-dark"
                                        onClick={() => {
                                            setEditing(true);
                                        }}
                                    >
                                        Edit Profile
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-outline"
                                        onClick={() => navigate("/change-password")}
                                    >
                                        Change Password
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        className="btn-dark"
                                        onClick={handleSubmit}
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>

                                    <button
                                        type="button"
                                        className="btn-outline"
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}

                        </div>

                    </div>

                </div>
            </section>

            <Footer />
        </>
    );
}