import React, { useState } from "react";
import { NavLink,useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("User logged in :");

    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);

        const { access_token } = data;
        localStorage.setItem("access_token", access_token);

        navigate("/home");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error", error);
      setError("An error occurred while trying to log in. Please try again.");
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="container">
      <form className="content__form" onSubmit={handleSubmit}>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <div className="content__inputs">
          <label>
            <input
              required
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email</span>
          </label>
          <label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
          </label>
        </div>
        <button>
          Log In
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <NavLink to="/signup" className="text-yellow-200 hover:underline">
            Register here
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;
