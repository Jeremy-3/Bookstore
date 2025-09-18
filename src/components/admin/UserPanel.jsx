import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
    role: "",
    password_hash: "",
    is_banned: false,
  });
  const [showCreateForm, setShowCreateForm] = useState(false); 
  const navigate = useNavigate();

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const sessionData = JSON.parse(localStorage.getItem("session"));
        if (!sessionData) {
          throw new Error("User is not logged in.");
        }
        const { access_token } = sessionData;
        const res = await fetch("/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await res.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message);
      }
    };
    fetchUsers();
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  
  const handleEditClick = (user) => {
    console.log("Editing user:", user); 
    setEditingUser(user.id);
    setEditFormData({
      username: user.username || "",
      email: user.email || "",
      role: user.role || "",
      is_banned: user.is_banned || false,
    });
  };

  
  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowCreateForm(false);
    setEditFormData({
      username: "",
      email: "",
      role: "",
      password_hash: "",
      is_banned: false,
    });
  };

  // Create a new user using POST
  const handleCreateUser = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      const { access_token } = sessionData;
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(editFormData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create user.");
      }
      const newUser = await res.json();
      console.log("Created user:", newUser); 
      setUsers([...users, newUser]);
      handleCancelEdit(); 
    } catch (err) {
      console.error("Error creating user:", err);
      setError(err.message);
    }
  };

  // Update a user using PATCH
  const handleUpdateUser = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      const { access_token } = sessionData;

      // Remove empty password_hash field to avoid overwriting
      const updatedData = { ...editFormData };
      if (!updatedData.password_hash) {
        delete updatedData.password_hash;
      }

      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update user.");
      }
      const updatedUser = await res.json();
      console.log("Updated user:", updatedUser); 
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? updatedUser : user))
      );
      handleCancelEdit(); 
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err.message);
    }
  };
  // Delete a user
  const handleDeleteUser = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      const { access_token } = sessionData;
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete user.");
      }
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError(err.message);
    }
  }; const handleBanUser = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      const { access_token } = sessionData;
      const res = await fetch(`/api/users/${id}/ban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to ban user.");
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_banned: true } : user
        )
      );
      alert("User banned successfully!");
    } catch (err) {
      console.error("Error banning user:", err);
      setError(err.message);
    }
  };

  // Un-ban a user
  const handleUnbanUser = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      const { access_token } = sessionData;
      const res = await fetch(`/api/users/${id}/un-ban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to unban user.");
      }
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, is_banned: false } : user
        )
      );
      alert("User unbanned successfully!");
    } catch (err) {
      console.error("Error unbanning user:", err);
      setError(err.message);
    }
  };


  return (
    <div className="admin-panel">
      <h3>Users</h3>
      {error && <p className="error-message">{error}</p>}
      {/* Add User Button */}
      <button
        className="admin-btn"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? "Cancel" : "Add User"}
      </button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Banned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.is_banned ? "Yes" : "No"}</td>
              <td>
                <button
                  className="admin-btn"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="admin-btn"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
                {user.is_banned ? (
                  <button
                    className="admin-btn"
                    onClick={() => handleUnbanUser(user.id)}
                  >
                    Un-ban
                  </button>
                ) : (
                  <button
                    className="admin-btn"
                    onClick={() => handleBanUser(user.id)}
                  >
                    Ban
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add User Form */}
      {showCreateForm && (
        <div className="edit-form-container">
          <h4>Add New User</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="form-label">
              Username:
              <input
                type="text"
                name="username"
                value={editFormData.username}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Email:
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Password:
              <input
                type="password"
                name="password_hash" 
                value={editFormData.password_hash}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Role:
              <select
                name="role"
                value={editFormData.role}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="">Select a role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={handleCreateUser}
              >
                Save
              </button>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Edit User Form */}
      {editingUser && (
        <div className="edit-form-container">
          <h4>Edit User</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="form-label">
              Username:
              <input
                type="text"
                name="username"
                value={editFormData.username}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Email:
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Password (Optional):
              <input
                type="password"
                name="password_hash" 
                value={editFormData.password_hash}
                onChange={handleInputChange}
                placeholder="Leave blank to keep current password"
                className="form-input"
              />
            </label>
            <label className="form-label">
              Role:
              <select
                name="role"
                value={editFormData.role}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={() => handleUpdateUser(editingUser)}
              >
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersPanel;