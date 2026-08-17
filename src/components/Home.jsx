import React from "react";
import StatsCard from "./StatsCard";

function Home({ books, activities, setActivePage, onAddBookClick, onIssueBookClick }) {
  // Calculate dynamic statistics
  const totalBooks = books.length;
  const availableBooks = books.filter((b) => b.status === "Available").length;
  const issuedBooks = books.filter((b) => b.status === "Issued").length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueBooks = books.filter((b) => {
    if (b.status !== "Issued" || !b.dueDate) return false;
    const dDate = new Date(b.dueDate);
    dDate.setHours(0, 0, 0, 0);
    return dDate < today;
  }).length;

  const todayStr = new Date().toISOString().split("T")[0];
  
  const todayIssued = activities.filter(
    (act) => act.action === "Issued" && act.date === todayStr
  ).length;

  const todayReturned = activities.filter(
    (act) => act.action === "Returned" && act.date === todayStr
  ).length;

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Get top 5 recent activities
  const recentActivities = activities.slice(0, 5);

  return (
    <div className="home-page">
      {/* Welcome Section */}
      <section className="welcome-section card">
        <h1 className="welcome-title">SmartLib Entry</h1>
        <p className="welcome-text">Library Receptionist Data Entry & Fine Collections Management (Next.js)</p>
        
        {/* Quick Actions Buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyCenter: "center", gap: "1rem", justifyContent: "center" }}>
          <button onClick={onAddBookClick} className="btn btn-primary">
            ➕ Add Book
          </button>
          <button onClick={onIssueBookClick} className="btn btn-success">
            📖 Issue Book
          </button>
          <button onClick={() => setActivePage("library")} className="btn btn-secondary">
            ↩️ Return Book
          </button>
          <button onClick={() => setActivePage("transactions")} className="btn btn-secondary">
            💸 View Transactions
          </button>
        </div>
      </section>

      {/* Dynamic Statistics cards */}
      <section className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        <StatsCard title="Total Books" value={totalBooks} icon="📚" iconColor="var(--primary-color)" />
        <StatsCard title="Available Books" value={availableBooks} icon="🟢" iconColor="var(--status-available)" />
        <StatsCard title="Issued Books" value={issuedBooks} icon="🔴" iconColor="var(--status-issued)" />
        <StatsCard title="Overdue Books" value={overdueBooks} icon="⚠️" iconColor="var(--status-issued)" />
        <StatsCard title="Today's Issued" value={todayIssued} icon="📤" iconColor="var(--primary-color)" />
        <StatsCard title="Today's Returned" value={todayReturned} icon="📥" iconColor="var(--status-available)" />
      </section>

      {/* Recent Activity Table */}
      <section className="card">
        <h2 className="card-title">🕒 Recent Activity</h2>
        {recentActivities.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1.5rem" }}>
            No recent activities recorded.
          </p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Student ID</th>
                  <th>Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentActivities.map((act, index) => (
                  <tr key={index}>
                    <td data-label="Book" style={{ fontWeight: 600 }}>{act.bookName}</td>
                    <td data-label="Student ID">{act.studentId}</td>
                    <td data-label="Action">
                      <span className={`badge ${act.action === "Issued" ? "badge-danger" : "badge-success"}`}>
                        {act.action === "Issued" ? "📤 Issued" : "📥 Returned"}
                      </span>
                    </td>
                    <td data-label="Date">{formatDate(act.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
