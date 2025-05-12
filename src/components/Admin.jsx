import React, { useState } from "react";
import AuthorsPanel from "./AuthorsPanel";
import BooksPanel from "./BooksPanel";
import BookstoresPanel from "./BookstoresPanel";
import FeedbacksPanel from "./FeedbacksPanel";
import BookstoreInventoryPanel from "./BookstoreInventoryPanel";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("authors");

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
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li onClick={() => handleTabChange("authors")}>Authors</li>
          <li onClick={() => handleTabChange("books")}>Books</li>
          <li onClick={() => handleTabChange("bookstores")}>Bookstores</li>
          <li onClick={() => handleTabChange("bookstore-inventory")}>Bookstore Inventory</li>
          <li onClick={() => handleTabChange("feedbacks")}>Feedbacks</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="admin-content">{renderContent()}</div>
    </div>
  );
};

export default Admin;