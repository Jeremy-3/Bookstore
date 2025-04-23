import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Bookstores = () => {
  const [bookstores, setBookstores] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch bookstores from the API
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      const fetchBookstores = async () => {
        try {
          const res = await fetch("/api/bookstores", {
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
          setBookstores(data);
        } catch (error) {
          console.error("Error: Could not fetch bookstores", error);
        }
      };
      fetchBookstores();
    }
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter bookstores based on search query
  const filteredBookstores = bookstores.filter((store) =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="bookstore-top">
      <div className="bs-btn">
        <button className="btn-b">
          <NavLink to="/home">Books</NavLink>
        </button>
        <button className="btn-b">
          <NavLink to="/author">Author</NavLink>
        </button>
      </div>
         
      
      <div className="search-text-b">
        <input
          type="text"
          placeholder="Search for bookstores"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      
      <div className="bookstore-grid">
        {isLoggedIn ? (
          filteredBookstores && filteredBookstores.length > 0 ? (
            filteredBookstores.map((store) => (
              <div key={store.id} className="bookstore-card">
                {/* Store Info */}
                <div className="store-info">
                  <h2 className="store-name">{store.name}</h2>
                  <p className="store-location">📍 {store.location}</p>
                  <p className="store-date">📅 Established: {formatDate(store.established_date)}</p>
                </div>

                {/* Inventory Section */}
                <div className="store-inventory">
                  <h3>📚 Inventory</h3>
                  <ul className="inventory-list">
                    {store.inventory.map((item) => (
                      <li key={item.book_id} className="inventory-item">
                        <NavLink to={`/books/${item.book_id}`} className="book-title">
                          Book ID: {item.book_id}
                        </NavLink>
                        <span className="price">💰 ${item.price.toFixed(2)}</span>
                        <span className="stock">
                          {item.stock > 0 ? `📦 In Stock (${item.stock})` : "❌ Out of Stock"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          ) : (
            <p>No bookstores found for this search.</p>
          )
        ) : (
          <p>Please log in to view bookstores.</p>
        )}
      </div>
    </section>
  );
};

export default Bookstores;