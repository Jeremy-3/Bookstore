import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookstoresPanel = () => {
  const [bookstores, setBookstores] = useState([]);
  const [error, setError] = useState(null);
  const [editingBookstore, setEditingBookstore] = useState(null); 
  const [editFormData, setEditFormData] = useState({
    name: "",
    location: "",
    established_date: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false); 
  const navigate = useNavigate();

  // Fetch bookstores
  useEffect(() => {
    const fetchBookstores = async () => {
      try {
        const sessionData = JSON.parse(localStorage.getItem("session"));
        if (!sessionData) {
          throw new Error("User is not logged in.");
        }

        const { access_token } = sessionData;

        const res = await fetch("/api/bookstores", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch bookstores.");
        }

        const data = await res.json();
        console.log("Fetched bookstores:", data); 
        setBookstores(data);
      } catch (err) {
        console.error("Error fetching bookstores:", err);
        setError(err.message);
      }
    };

    fetchBookstores();
  }, []);

  // Handle input changes in the edit/create form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open the edit form and populate it with the selected bookstore's data
  const handleEditClick = (store) => {
    console.log("Editing bookstore:", store); 
    setEditingBookstore(store.id);
    setEditFormData({
      name: store.name || "",
      location: store.location || "",
      established_date: store.established_date || "",
    });
  };

  // Close the edit/create form
  const handleCancelEdit = () => {
    setEditingBookstore(null);
    setShowCreateForm(false);
    setEditFormData({
      name: "",
      location: "",
      established_date: "",
    });
  };

  // Update a bookstore using PATCH
  const handleUpdateBookstore = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }

      const { access_token } = sessionData;

      const res = await fetch(`/api/bookstores/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        throw new Error("Failed to update bookstore.");
      }

      const updatedBookstore = await res.json();
      console.log("Updated bookstore:", updatedBookstore); 

      setBookstores((prevBookstores) =>
        prevBookstores.map((store) => (store.id === id ? updatedBookstore : store))
      );
      handleCancelEdit(); // Reset the edit form
    } catch (err) {
      console.error("Error updating bookstore:", err);
      setError(err.message);
    }
  };

  // Create a new bookstore using POST
  const handleCreateBookstore = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      const {name,location,established_date} = editFormData;
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      if (!name || !location || !established_date) {
        throw new Error("Please fill in all fields.");
      }
      const { access_token } = sessionData;

      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(established_date)) {
        setError("Invalid date format. Use YYYY-MM-DD.");
        return;
      }
     

      const res = await fetch("/api/bookstores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        throw new Error("Failed to create bookstore.");
      }

      const newBookstore = await res.json();
      console.log("Created bookstore:", newBookstore); 

      setBookstores((prevBookstores) => [...prevBookstores, newBookstore]);
      handleCancelEdit(); // Reset the create form
    } catch (err) {
      console.error("Error creating bookstore:", err);
      setError(err.message);
    }
  };

  // Delete a bookstore
  const handleDeleteBookstore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bookstore?")) return;
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }

      const { access_token } = sessionData;

      const res = await fetch(`/api/bookstores/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete bookstore.");
      }

      setBookstores(bookstores.filter((store) => store.id !== id));
    } catch (err) {
      console.error("Error deleting bookstore:", err);
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h3>Bookstores</h3>
      {error && <p className="error-message">{error}</p>}
      <button
        className="admin-btn"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? "Cancel" : "Add Bookstore"}
      </button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookstores.map((store) => (
            <tr key={store.id}>
              <td>{store.id}</td>
              <td>{store.name}</td>
              <td>{store.location}</td>
              <td>
                <button
                  className="admin-btn"
                  onClick={() => handleEditClick(store)}
                >
                  Edit
                </button>
                <button
                  className="admin-btn"
                  onClick={() => handleDeleteBookstore(store.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Bookstore Form */}
      {showCreateForm && (
        <div className="edit-form-container">
          <h4>Add New Bookstore</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="form-label">
              Name:
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Location:
              <input
                type="text"
                name="location"
                value={editFormData.location}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Established Date:
              <input
                type="date"
                name="established_date"
                value={editFormData.established_date}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={handleCreateBookstore}
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

      {/* Edit Bookstore Form */}
      {editingBookstore && (
        <div className="edit-form-container">
          <h4>Edit Bookstore</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="form-label">
              Name:
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Location:
              <input
                type="text"
                name="location"
                value={editFormData.location}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Established Date:
              <input
                type="date"
                name="established_date"
                value={editFormData.established_date}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={() => handleUpdateBookstore(editingBookstore)}
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

export default BookstoresPanel;