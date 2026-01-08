import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("User logged in :");

    setError(null);

    // const handleLogout = ()
    //     localStorage.removeItem('access_token')
    //     setIsLoggedIn(false)
    //   }

    try {
      setSubmitting(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        setError(errorData.Message);
      }
      const data = await response.json();
      const { access_token, role } = data;
      localStorage.setItem("session", JSON.stringify(data));

      if (role == "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setSubmitting(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="container">
      <form className="content__form">
        <p className="title">Login </p>
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

        <button type="button" onClick={(e) => handleSubmit(e)}>
          {submitting ? "Loading" : "Login"}
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <NavLink to="/signup" className=" text-amber-600 hover:underline">
            Register here
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;
