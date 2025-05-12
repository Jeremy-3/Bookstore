import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookstoreInventoryPanel = () => {
  const [bookstores, setBookstores] = useState([]);
  const [books, setBooks] = useState([]); 
  const [error, setError] = useState(null);
  const [assignFormData, setAssignFormData] = useState({
    bookstore_id: "",
    book_id: "",
    stock: 0,
    price: 0,
  });
  const navigate = useNavigate();

  // Fetch all bookstores and their assigned books
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

        // Fetch books for each bookstore
        const bookstoresWithBooks = await Promise.all(
          data.map(async (store) => {
            const bookRes = await fetch(`/api/bookstores/${store.id}/books`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${access_token}`,
              },
            });

            if (!bookRes.ok) {
              throw new Error(`Failed to fetch books for bookstore ${store.id}`);
            }

            const bookData = await bookRes.json();
            return {
              ...store,
              books: bookData.map((item) => ({
                id: item.book.id,
                title: item.book.title,
                stock: item.stock,
                price: item.price,
              })),
            };
          })
        );

        setBookstores(bookstoresWithBooks);
      } catch (err) {
        console.error("Error fetching bookstores:", err);
        setError(err.message);
      }
    };

    fetchBookstores();
  }, []);

  // Fetch all books for assignment
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
        console.log("Fetched books:", data);
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError(err.message);
      }
    };

    fetchBooks();
  }, []);

  // Handle input changes in the assign form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAssignFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Assign a book to a bookstore
  const handleAssignBook = async (e) => {
    e.preventDefault();
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      const { access_token } = sessionData;

      const res = await fetch(`/api/bookstores/${assignFormData.bookstore_id}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          book_id: assignFormData.book_id,
          stock: parseInt(assignFormData.stock),
          price: parseFloat(assignFormData.price),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to assign book to bookstore.");
      }

      alert("Book successfully assigned to bookstore!");
      setAssignFormData({ bookstore_id: "", book_id: "", stock: 0, price: 0 });


      const updatedRes = await fetch("/api/bookstores", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!updatedRes.ok) {
        throw new Error("Failed to refetch bookstores.");
      }

      const updatedData = await updatedRes.json();
      const updatedBookstores = await Promise.all(
        updatedData.map(async (store) => {
          const bookRes = await fetch(`/api/bookstores/${store.id}/books`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (!bookRes.ok) {
            throw new Error(`Failed to fetch books for bookstore ${store.id}`);
          }

          const bookData = await bookRes.json();
          return {
            ...store,
            books: bookData.map((item) => ({
              id: item.book.id,
              title: item.book.title,
              stock: item.stock,
              price: item.price,
            })),
          };
        })
      );

      setBookstores(updatedBookstores);
    } catch (err) {
      console.error("Error assigning book:", err);
      setError(err.message);
    }
  };

 
  const handleUpdateBook = async (bookstore_id, book_id, updatedData) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      const { access_token } = sessionData;

      const res = await fetch(`/api/bookstores/${bookstore_id}/books/${book_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update book details.");
      }

      const updatedBook = await res.json();
      setBookstores((prev) =>
        prev.map((store) =>
          store.id === bookstore_id
            ? {
                ...store,
                books: store.books.map((book) =>
                  book.id === book_id
                    ? {
                        ...book,
                        stock: updatedBook.stock,
                        price: updatedBook.price,
                      }
                    : book
                ),
              }
            : store
        )
      );
      alert("Book details updated successfully!");
    } catch (err) {
      console.error("Error updating book:", err);
      setError(err.message);
    }
  };


  const handleDeleteBook = async (bookstore_id, book_id) => {
    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }
      const { access_token } = sessionData;

      const res = await fetch(`/api/bookstores/${bookstore_id}/books/${book_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete book from bookstore.");
      }

      setBookstores((prev) =>
        prev.map((store) =>
          store.id === bookstore_id
            ? { ...store, books: store.books.filter((book) => book.id !== book_id) }
            : store
        )
      );
      alert("Book successfully removed from bookstore!");
    } catch (err) {
      console.error("Error deleting book:", err);
      setError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <h3>Bookstore Inventory</h3>
      {error && <p className="error-message">{error}</p>}
      {/* Assign Book Form */}
      <div className="edit-form-container">
        <h4>Assign Book to Bookstore</h4>
        <form onSubmit={handleAssignBook}>
          <label className="form-label">
            Bookstore ID:
            <input
              type="number"
              name="bookstore_id"
              value={assignFormData.bookstore_id}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </label>
          <label className="form-label">
            Book:
            <select
              name="book_id"
              value={assignFormData.book_id}
              onChange={handleInputChange}
              required
              className="form-input"
            >
              <option value="">Select a book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>
          <label className="form-label">
            Stock:
            <input
              type="number"
              name="stock"
              value={assignFormData.stock}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </label>
          <label className="form-label">
            Price:
            <input
              type="number"
              step="0.01"
              name="price"
              value={assignFormData.price}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </label>
          <button type="submit" className="submit-btn">
            Assign Book
          </button>
        </form>
      </div>
      {/* Table of Bookstore-Book Relationships */}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Bookstore ID</th>
            <th>Book Title</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookstores.flatMap((store) =>
            store.books.map((book) => (
              <tr key={`${store.id}-${book.id}`}>
                <td>{store.id}</td>
                <td>{book.title}</td>
                <td>{book.stock}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button
                    className="admin-btn"
                    onClick={() =>
                      handleUpdateBook(store.id, book.id, {
                        stock: prompt("Enter new stock:", book.stock),
                        price: prompt("Enter new price:", book.price),
                      })
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="admin-btn"
                    onClick={() => handleDeleteBook(store.id, book.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookstoreInventoryPanel;