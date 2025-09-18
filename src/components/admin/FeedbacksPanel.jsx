import React, { useState, useEffect } from "react";

const FeedbacksPanel = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null); 

  // Fetch feedbacks from the backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const sessionData = JSON.parse(localStorage.getItem("session"));
        if (!sessionData) {
          throw new Error("User is not logged in.");
        }

        const { access_token } = sessionData;
        const res = await fetch("/api/feedback", { 
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch feedbacks.");
        }

        const data = await res.json();
        console.log("Fetched feedbacks:", data);
        setFeedbacks(data); 
      } catch (err) {
        console.error("Error fetching feedbacks:", err);
        setError(err.message);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="feedbacks-panel">
      <h3>Feedbacks</h3>
      {error && <p className="error-message">{error}</p>}
      {feedbacks.length === 0 ? (
        <p className="no-feedback">No feedbacks available.</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.id}</td>
                <td>{feedback.name}</td>
                <td>{feedback.email}</td>
                <td>{feedback.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FeedbacksPanel;