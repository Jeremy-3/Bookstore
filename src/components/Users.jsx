import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [showAuthorForm, setShowAuthorForm] = useState(false); 
  const [isAuthor, setIsAuthor] = useState(false);
  const [authorFormData, setAuthorFormData] = useState({
    first_name: "",
    second_name: "",
    email: "",
    nationality: "",
    bio: "",
  });
  const [bookFormData, setBookFormData] = useState({
    title: "",
    genre: "",
    description: "",
    book_img: "",
    publication_date: "",
    author_id: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem("session"));

    if (sessionData) {
      const { access_token } = sessionData;
      setIsLoggedIn(true);

      const fetchProfile = async () => {
        try {
          const res = await fetch("/api/profile", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          if (!res.ok) {
            throw new Error("Failed to fetch profile.");
          }

          const data = await res.json();
          console.log(data);
          setProfile(data);

          
          if (data.is_author) {
            setIsAuthor(true);
            setBookFormData((prev) => ({ ...prev, author_id: data.id }));
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
          setError(err.message);
        }
      };

      fetchProfile();
    }
  }, []);

  const handleAuthorChange = (e) => {
    const { name, value } = e.target;
    setAuthorFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookChange = (e) => {
    const { name, value } = e.target;
    setBookFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBecomeAuthor = async (e) => {
    e.preventDefault();

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
        body: JSON.stringify(authorFormData),
      });

      if (!res.ok) {
        throw new Error("Failed to become an author.");
      }

      const data = await res.json();
      alert("You are now an author!");
      setIsAuthor(true);
      setBookFormData((prev) => ({ ...prev, author_id: data.author_id }));
      setShowAuthorForm(false);
    } catch (err) {
      console.error("Error becoming an author:", err);
      setError(err.message);
    }
  };

  const handleSubmitBook = async (e) => {
    e.preventDefault();

    try {
      const sessionData = JSON.parse(localStorage.getItem("session"));
      if (!sessionData) {
        throw new Error("User is not logged in.");
      }

      const { access_token } = sessionData;

      const formattedData = {
        ...bookFormData,
        publication_date: bookFormData.publication_date || "",
      };

      const res = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        throw new Error("Failed to create the book.");
      }
      console.log(res);
      const data = await res.json();
      alert("Book created successfully!");
      navigate(`/books/${data.id}`);
    } catch (err) {
      console.error("Error creating book:", err);
      setError(err.message);
    }
  };

  return (
    <div className="users-container">
      {!isLoggedIn ? (
        <p className="login-message">Please log in to view your profile.</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : !profile ? (
        <p className="loading-message">Loading profile...</p>
      ) : (
        <div className="profile-section">
          <h2 className="profile-title">User Profile</h2>
          <div className="profile-details">
            <p>
              <strong>Username:</strong> {profile.username}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p>
          </div>

          {/* Become an Author Button */}
          {!isAuthor && (
            <button
              className="become-author-btn"
              onClick={() => setShowAuthorForm(!showAuthorForm)}
            >
              {showAuthorForm ? "Cancel" : "Become an Author"}
            </button>
          )}

          {/* Become an Author Form */}
          {!isAuthor && showAuthorForm && (
            <form onSubmit={handleBecomeAuthor} className="book-form">
              <h3 className="form-title">Become an Author</h3>

              <label className="form-label">
                First Name:
                <input
                  type="text"
                  name="first_name"
                  value={authorFormData.first_name}
                  onChange={handleAuthorChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="form-label">
                Second Name:
                <input
                  type="text"
                  name="second_name"
                  value={authorFormData.second_name}
                  onChange={handleAuthorChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="form-label">
                Email:
                <input
                  type="email"
                  name="email"
                  value={authorFormData.email}
                  onChange={handleAuthorChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="form-label">
                Nationality:
                <input
                  type="text"
                  name="nationality"
                  value={authorFormData.nationality}
                  onChange={handleAuthorChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="form-label">
                Bio (Optional):
                <textarea
                  name="bio"
                  value={authorFormData.bio}
                  onChange={handleAuthorChange}
                  className="form-textarea"
                />
              </label>

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          )}

          {/* Create Book Form */}
          {isAuthor && (
            <form onSubmit={handleSubmitBook} className="book-form">
              <h3 className="form-title">Create a New Book</h3>

              <label className="form-label">
                Title:
                <input
                  type="text"
                  name="title"
                  value={bookFormData.title}
                  onChange={handleBookChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="form-label">
                Genre:
                <input
                  type="text"
                  name="genre"
                  value={bookFormData.genre}
                  onChange={handleBookChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="form-label">
                Description:
                <textarea
                  name="description"
                  value={bookFormData.description}
                  onChange={handleBookChange}
                  required
                  className="form-textarea"
                />
              </label>

              <label className="form-label">
                Book Image URL:
                <input
                  type="url"
                  name="book_img"
                  value={bookFormData.book_img}
                  onChange={handleBookChange}
                  required
                  className="form-input"
                />
              </label>

              <label className="form-label">
                Book Publication Date:
                <input
                  type="date"
                  name="publication_date"
                  value={bookFormData.publication_date}
                  onChange={handleBookChange}
                  required
                  className="form-input"
                />
              </label>

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Users;