import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthorsPanel from "./AuthorsPanel";
import BooksPanel from "./BooksPanel";
import BookstoresPanel from "./BookstoresPanel";
import FeedbacksPanel from "./FeedbacksPanel";
import BookstoreInventoryPanel from "./BookstoreInventoryPanel";
import UserPanel from "./UserPanel";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("authors");
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "authors":
        return <AuthorsPanel />;
      case "books":
        return <BooksPanel />;
      case "bookstores":
        return <BookstoresPanel />;
      case "bookstore-inventory":
        return <BookstoreInventoryPanel />;
      case "feedbacks":
        return <FeedbacksPanel />;
      case "users":
        return <UserPanel />  
      default:
        return null;
    }
  };
  // const handleLogout = () => {
  //   try {
  //     localStorage.removeItem("session");
  //     alert("You have been logged out successfully.");

  //     navigate("/login");
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //     alert("An error occurred during logout. Please try again.");
  //   }
  // };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => handleTabChange("authors")}>Authors</li>
          <li onClick={() => handleTabChange("books")}>Books</li>
          <li onClick={() => handleTabChange("bookstores")}>Bookstores</li>
          <li onClick={() => handleTabChange("bookstore-inventory")}>
            Bookstore Inventory
          </li>
          <li onClick={() => handleTabChange("feedbacks")}>Feedbacks</li>
          <li onClick={() => handleTabChange("users")}>Users</li>
          {/* <li onClick={handleLogout}>Log Out</li> */}
        </ul>
      </div>
      {/* Main Content */}
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

export default Admin;
