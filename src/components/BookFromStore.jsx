import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";

const BookFromStore = () => {
  const { storeId, bookId } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not logged in.");
        }

        const res = await fetch(`/api/bookstores/${storeId}/books/${bookId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Book not found in this bookstore.");
        }

        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [storeId, bookId]);

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  return (
    <section className="book-detail">
      <div className="back-btn">
        <NavLink to="/bookstores">← Back to Bookstore</NavLink>
      </div>

      {isLoading && <p>Loading book details...</p>}

      {error && <p className="error">{error}</p>}

      {book && (
        <div className="book-container">
          <img
            src={book.book.book_img}
            alt={book.book.title}
            className="book-image"
          />

          <div className="book-info">
            <h1 className="book-title">{book.book.title}</h1>
            <p className="book-author">Author ID: {book.book.author_id}</p>
            <p className="book-genre">Genre: {book.book.genre}</p>
            <p className="book-price">Price: {formatPrice(book.price)}</p>
            <p className="book-stock">
              Stock:{" "}
              {book.stock > 0 ? `In Stock (${book.stock})` : "Out of Stock"}
            </p>
            <p className="book-description">{book.book.description}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookFromStore;
