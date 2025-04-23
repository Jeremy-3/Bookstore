import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// import { IoMdSearch } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import { FaTwitter } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
const Home = () => {
  const [books, setBooks] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      const fetchBooks = async () => {
        try {
          const res = await fetch("/api/books", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Network response was not okay ");
          }
          const data = await res.json();
          console.log(data);
          setBooks(data);
        } catch (error) {
          console.error("Error ,Could not fetch books", error);
        }
      };
      fetchBooks();
    }
  }, []);
  const filteredBooks = books
    .filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) 
    .filter((book) => (selectedGenre ? book.genre === selectedGenre : true)); 

  return (
    <>
      <section className="home-top">
        <div className="home-btn">
          <button>
            <NavLink to="/author">Authors</NavLink>
          </button>
          <button>
            <NavLink to="/bookstores">Bookstores</NavLink>
          </button>
        </div>
        <div className="search-text">
          <input type="text" placeholder="Search for books" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          {/* <button><IoMdSearch /></button> */}
        </div>

        <div className="home-icons">
          <NavLink to="/users">
            <IoPersonCircle className="person" />
          </NavLink>
          <a href="#">
            <FaTwitter className="twit" />
          </a>
          <a href="#">
            <FaWhatsapp className="whats" />
          </a>
          <a href="#">
            <FaInstagram className="insta" />
          </a>
        </div>
      </section>

      {/* drop down menu section */}
      <div className="dropdown-container">
        <label htmlFor="genre">Filter by Genre:</label>
        <select
          id="genre"
          className="dropdown"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="Action">Action</option>
          <option value="Mystery">Mystery</option>
          <option value="Fiction">Fiction</option>
          <option value="Drama">Drama</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Fantasy">Fantasy</option>
        </select>
      </div>

      <section className="home-two">
        {isLoggedIn ? (
          filteredBooks && filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div key={book.id} className="book">
                <img
                  src={book.book_img}
                  alt={book.title}
                  className="book-img"
                />
                <h3 className="book-title book-overlay">{book.title}</h3>
                <p className="book-desc">{book.description}</p>
              </div>
            ))
          ) : (
            <p>No books for this Search or Genre is available</p>
          )
        ) : (
          <p>Please log in to view books</p>
        )}
      </section>
    </>
  );
};

export default Home;
