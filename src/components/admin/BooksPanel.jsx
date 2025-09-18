import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BooksPanel = () => {
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null); 
  const [editFormData, setEditFormData] = useState({
    title: "",
    genre: "",
    publication_date: "",
    description: "",
    author_id: null,
  });
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const sessionData = JSON.parse(localStorage.getItem("session"));
        if (!sessionData) {
          throw new Error("User is not logged in.");
        }

        const { access_token } = sessionData;

        const res = await fetch("/api/books", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch books.");
        }

        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message);
      }
    };

    fetchBooks();
  }, []);


  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleEditClick = (book) => {
    setEditingBook(book.id);
    setEditFormData({
      title: book.title || "",
      genre: book.genre || "",
      publication_date: book.publication_date || "",
      description: book.description || "",
      author_id: book.author_id || null,
    });
  };


  const handleCancelEdit = () => {
    setEditingBook(null);
    setEditFormData({
      title: "",
      genre: "",
      publication_date: "",
      description: "",
      author_id: null,
    });
  };

  // Update a book using PATCH
  const handleUpdateBook = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }

      const { access_token } = sessionData;

      const res = await fetch(`/api/books/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        throw new Error("Failed to update book.");
      }

      const updatedBook = await res.json();
      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === id ? updatedBook : book))
      );
      handleCancelEdit(); 
    } catch (err) {
      console.error("Error updating book:", err);
      setError(err.message);
    }
  };


  const handleDeleteBook = async (id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }

      const { access_token } = sessionData;

      const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete book.");
      }

      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h3>Books</h3>
      {error && <p className="error-message">{error}</p>}
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Author ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.title}</td>
              <td>{book.genre}</td>
              <td>{book.author_id || "N/A"}</td>
              <td>
                <button
                  className="admin-btn"
                  onClick={() => handleEditClick(book)}
                >
                  Edit
                </button>
                <button
                  className="admin-btn"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Book Form */}
      {editingBook && (
        <div className="edit-form-container">
          <h4>Edit Book</h4>
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="form-label">
              Title:
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Genre:
              <input
                type="text"
                name="genre"
                value={editFormData.genre}
                onChange={handleEditChange}
                required
                className="form-input"
              />
            </label>
            <label className="form-label">
              Publication Date:
              <input
                type="date"
                name="publication_date"
                value={editFormData.publication_date}
                onChange={handleEditChange}
                className="form-input"
              />
            </label>
            <label className="form-label">
              Description:
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                className="form-textarea"
              />
            </label>
            <label className="form-label">
              Author ID:
              <input
                type="number"
                name="author_id"
                value={editFormData.author_id || ""}
                onChange={handleEditChange}
                className="form-input"
              />
            </label>
            <div className="form-actions">
              <button
                className="submit-btn"
                onClick={() => handleUpdateBook(editingBook)}
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

export default BooksPanel;