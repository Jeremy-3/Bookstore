import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthorsPanel = () => {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState(null);
  const [editingAuthor, setEditingAuthor] = useState(null); 
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    second_name: "",
    email: "",
    nationality: "",
  });
  const [showCreateForm, setShowCreateForm] = useState(false); 
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const sessionData = JSON.parse(localStorage.getItem("session"));
        if (!sessionData) {
          throw new Error("User is not logged in.");
        }

        const { access_token } = sessionData;

        const res = await fetch("/api/authors", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch authors.");
        }

        const data = await res.json();
        console.log("Fetched authors:", data); 
        setAuthors(data);
      } catch (err) {
        console.error("Error fetching authors:", err);
        setError(err.message);
      }
    };

    fetchAuthors();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleEditClick = (author) => {
    console.log("Editing author:", author); 
    setEditingAuthor(author.id);
    setEditFormData({
      first_name: author.first_name || "",
      second_name: author.second_name || "",
      email: author.email || "",
      nationality: author.nationality || "",
    });
  };

 
  const handleCancelEdit = () => {
    setEditingAuthor(null);
    setShowCreateForm(false);
    setEditFormData({
      first_name: "",
      second_name: "",
      email: "",
      nationality: "",
    });
  };

  // Update an author using PATCH
  const handleUpdateAuthor = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }

      const { access_token } = sessionData;

      const res = await fetch(`/api/authors/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        throw new Error("Failed to update author.");
      }

      const updatedAuthor = await res.json();
      console.log("Updated author:", updatedAuthor);

      setAuthors((prevAuthors) =>
        prevAuthors.map((author) => (author.id === id ? updatedAuthor : author))
      );
      handleCancelEdit();
    } catch (err) {
      console.error("Error updating author:", err);
      setError(err.message);
    }
  };

  // Create a new author using POST
  const handleCreateAuthor = async () => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }

      const { access_token } = sessionData;

      const res = await fetch("/api/authors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        throw new Error("Failed to create author.");
      }

      const newAuthor = await res.json();
      console.log("Created author:", newAuthor); 

      setAuthors((prevAuthors) => [...prevAuthors, newAuthor]);
      handleCancelEdit(); 
    } catch (err) {
      console.error("Error creating author:", err);
      setError(err.message);
    }
  };

  const handleDeleteAuthor = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }

      const { access_token } = sessionData;

      const res = await fetch(`/api/authors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete author.");
      }

      setAuthors(authors.filter((author) => author.id !== id));
    } catch (err) {
      console.error("Error deleting author:", err);
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h3>Authors</h3>
      {error && <p className="error-message">{error}</p>}
      {/* Add Author Button */}
      <button
        className="admin-btn"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? "Cancel" : "Add Author"}
      </button>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Nationality</th>
            <th>Is User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td>{author.id}</td>
              <td>{`${author.first_name} ${author.second_name}`}</td>
              <td>{author.email}</td>
              <td>{author.nationality}</td>
              <td>{author.user_id ? "Yes" : "No"}</td>
              <td>
                <button
                  className="admin-btn"
                  onClick={() => handleEditClick(author)}
                >
                  Edit
                </button>
                <button
                  className="admin-btn"
                  onClick={() => handleDeleteAuthor(author.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Author Form */}
      {showCreateForm && (
        <div className="edit-form-container">
          <h4>Add New Author</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="form-label">
              First Name:
              <input
                type="text"
                name="first_name"
                value={editFormData.first_name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Second Name:
              <input
                type="text"
                name="second_name"
                value={editFormData.second_name}
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
              Nationality:
              <input
                type="text"
                name="nationality"
                value={editFormData.nationality}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={handleCreateAuthor}
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

      {/* Edit Author Form */}
      {editingAuthor && (
        <div className="edit-form-container">
          <h4>Edit Author</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="form-label">
              First Name:
              <input
                type="text"
                name="first_name"
                value={editFormData.first_name}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Second Name:
              <input
                type="text"
                name="second_name"
                value={editFormData.second_name}
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
              Nationality:
              <input
                type="text"
                name="nationality"
                value={editFormData.nationality}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </label>
            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={() => handleUpdateAuthor(editingAuthor)}
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

export default AuthorsPanel;