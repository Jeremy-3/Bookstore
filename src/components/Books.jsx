import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
// const API_URL = import.meta.env.VITE_API_URL;

const Book = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem("session"));
    const fetchBook = async () => {
    const {access_token} = sessionData
      try {
        
        if (!sessionData) {
          throw new Error("User is not logged in.");
        }

        const res = await fetch(`/api/books/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Book not found.");
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
  }, [id]);

  return (
    <section className="book-detail">
      <div className="back-btn">
        <NavLink to="/Author">← Back to Author</NavLink>
      </div>

      {isLoading && <p>Loading book details...</p>}

      {error && <p className="error">{error}</p>}
      {book && (
        <div className="book-container">
          <img src={book.book_img} alt={book.title} className="book-image" />
          <div className="book-info">
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">Author ID: {book.author_id}</p>
            <p className="book-genre">Genre: {book.genre}</p>
            <p className="book-description">{book.description}</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Book;
