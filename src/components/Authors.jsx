import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      const fetchAuthors = async () => {
        try {
          const res = await fetch("/api/authors", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Network response was not okay");
          }
          const data = await res.json();
          console.log(data);
          setAuthors(data);
        } catch (error) {
          console.error("Error: Could not fetch authors", error);
        }
      };
      fetchAuthors();
    }
  }, []);


  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const filteredAuthors = authors.filter(
    (author) =>
      author.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.second_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="auth-top">
      <div className="auth-btn">
        <button className="btn">
          <NavLink to="/home">Books</NavLink>
        </button>
        <button className="btn">
          <NavLink to="/bookstores">BookStores</NavLink>
        </button>
      </div>

      <div className="search-text-a">
        <input
          type="text"
          placeholder="Search for authors"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="author-grid">
        {isLoggedIn ? (
          filteredAuthors && filteredAuthors.length > 0 ? (
            filteredAuthors.map((author) => (
              <div key={author.id} className="author-card">
                <div className="author-info">
                  <h2 className="author-name">
                    {`${author.first_name} ${author.second_name}`}
                  </h2>
                  <p className="author-nationality">Nationality: {author.nationality}</p>
                  <p className="author-date">Added on: {formatDate(author.created_at)}</p>
                  <p className="author-bio">{author.bio}</p>
                </div>

                
                <div className="author-books">
                  <h3>Books by {author.first_name}</h3>
                  <ul className="book-list">
                    {author.books.map((book) => (
                      <li key={book.id} className="book-item">
                        <NavLink to={`/books/${book.id}`} className="book-title">
                          {book.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No authors found for this search.</p>
          )
        ) : (
          <p>Please log in to view authors.</p>
        )}
      </div>
    </section>
  );
};

export default Authors;