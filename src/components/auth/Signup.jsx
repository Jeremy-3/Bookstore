import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const payload = {
      username,
      email,
      password,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setUsername("");
        setEmail("");
        setPassword("");

        console.log("Registration successful. Navigating to login page...");
        navigate("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(
          errorData.message || "Registration failed. Please try again later."
        );
      }
    } catch (error) {
      setErrorMessage("Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const handleNavigate = () => {
    navigate("/login");
  };
  return (
    <div className="register">
      <form className="form" onSubmit={handleSignUp}>
        <p className="title">Register </p>
        <p className="message">Signup now and get full access to our app. </p>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <div className="flex">
          <label>
            <input
              required
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <span>Username</span>
          </label>
        </div>

        <label>
          <input
            required
            type="text"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>

        <label>
          <input
            required
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>
        <button className="submit" disabled={loading} onChange={handleNavigate}>
          {" "}
          {loading ? "Registering...." : "Register"}
        </button>
        <p className="signin">
          Already have an account ? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
