import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";


export default function AdminUsers() {


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const getUsers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        `/users/admin/all?page=${page}&limit=10`
      );

      setUsers(data.users);
      setTotalPages(data.totalPages);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    getUsers();
  }, [page]);


  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      (user.name || "").toLowerCase().includes(keyword) ||
      (user.email || "").toLowerCase().includes(keyword);

    const matchesRole =
      roleFilter === "" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "" ||
      (statusFilter === "active" && !user.isBlocked) ||
      (statusFilter === "blocked" && user.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });



  const updateUser = async () => {

    try {

      await api.put(
        `/users/admin/${selectedUser._id}`,
        selectedUser
      );

      setShowEditModal(false);

      getUsers();

    } catch (error) {
      console.error(error);
    }

  };


  const deleteUser = (id) => {
    toast((t) => (
      <div className="d-flex flex-column gap-2">
        <span>Delete this user?</span>

        <div className="d-flex gap-2">
          <button
            className="btn btn-danger btn-sm"
            onClick={async () => {
              try {
                const { data } = await api.delete(`/users/admin/${id}`);

                toast.dismiss(t.id);
                toast.success(data.message);

                getUsers();
              } catch (error) {
                toast.dismiss(t.id);
                toast.error(
                  error.response?.data?.message || "Delete failed"
                );
              }
            }}
          >
            Delete
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };





  const toggleBlockUser = async (id) => {
    try {

      const { data } = await api.patch(
        `/users/admin/${id}/block`
      );

      toast.success(data.message);

      getUsers();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );

    }
  };


  return (
    <div className="admin-users">

      <div className="page-header">
        <div>
          <span className="breadcrumb">
            Dashboard / Users
          </span>

          <h2>Users Management</h2>

          <p>
            Manage customers and administrators.
          </p>
        </div>

        <div className="header-actions">
          <button className="btn-outline">
            Export
          </button>

          <button className="btn-primary">
            + Add User
          </button>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h5>Total Users</h5>
          <h2>{users.length}</h2>
          <span>No users</span>
        </div>

        <div className="stat-card">
          <h5>Customers</h5>
          <h2>{users.filter(user => user.role === "customer").length}</h2>
          <span>Registered</span>
        </div>
        <div className="stat-card">
          <h5>Admins</h5>
          <h2>{users.filter(user => user.role === "admin").length}</h2>
          <span>System Admin</span>
        </div>

        <div className="stat-card">
          <h5>Active</h5>
          <h2>
            {
              users.filter(user => user.isBlocked === false).length
            }
          </h2>
          <span>Online</span>
        </div>

      </div>

      <div className="toolbar">

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>

      </div>

      <div className="table-card">

        <table>

          <thead>

            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {
              loading ? (

                <tr>
                  <td colSpan="7" className="text-center py-5">
                    Loading users...
                  </td>
                </tr>

              ) :

                filteredUsers.length === 0 ? (

                  <tr>

                    <td colSpan="7">

                      <div className="empty-users">

                        <h3>No Users Found</h3>

                        <p>
                          Registered users will appear here.
                        </p>

                      </div>

                    </td>

                  </tr>

                ) :

                  filteredUsers.map((user) => (

                    <tr key={user._id}>

                      <td>

                        <div className="user-cell">

                          <img
                            src={user.avatar?.url || "/default-avatar.png"}
                            alt={user.name}
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />

                          <div>

                            <h6>{user.name}</h6>

                            <p>{user.email}</p>

                          </div>

                        </div>

                      </td>

                      <td>{user.email}</td>

                      <td>{user.phone}</td>

                      <td>

                        <span
                          className={
                            user.role === "admin"
                              ?
                              "badge-admin"
                              :
                              "badge-user"
                          }
                        >

                          {user.role}

                        </span>

                      </td>

                      <td>

                        <span
                          className={
                            user.isBlocked
                              ?
                              "badge-block"
                              :
                              "badge-active"
                          }
                        >

                          {
                            user.isBlocked
                              ?
                              "Blocked"
                              :
                              "Active"
                          }

                        </span>

                      </td>

                      <td>

                        {
                          new Date(user.createdAt)
                            .toLocaleDateString()
                        }

                      </td>

                      <td>

                        <button
                          className="icon-btn"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                        >
                          ✏️
                        </button>



                        <button
                          className="icon-btn delete"
                          onClick={() => deleteUser(user._id)}
                        >
                          🗑
                        </button>




                        <button
                          className={
                            user.isBlocked
                              ? "btn-success"
                              : "btn-warning"
                          }
                          onClick={() => toggleBlockUser(user._id)}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>

                      </td>

                    </tr>

                  ))

            }

          </tbody>

        </table>


        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>

      </div>
      {showEditModal && selectedUser && (
        <div className="modal-overlay">
          <div className="edit-modal">

            <h2>Edit User</h2>

            <input
              value={selectedUser.name}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  name: e.target.value,
                })
              }
            />

            <input
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  email: e.target.value,
                })
              }
            />

            <input
              value={selectedUser.phone}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  phone: e.target.value,
                })
              }
            />

            <select
              value={selectedUser.role}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  role: e.target.value,
                })
              }
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>

            <div className="modal-buttons">

              <button
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>

              <button onClick={updateUser}>
                Save Changes
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}