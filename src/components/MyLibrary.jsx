import React, { useState } from "react";

function MyLibrary({ books, onReturnClick }) {
  const [statusFilter, setStatusFilter] = useState("All");

  // Get only issued books
  const issuedBooks = books.filter((b) => b.status === "Issued");

  // Helper to determine if a book is overdue
  const isOverdue = (dueDateStr) => {
    if (!dueDateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dDate = new Date(dueDateStr);
    dDate.setHours(0, 0, 0, 0);
    return dDate < today;
  };

  // Filter books by Status filter (All, On Time, Overdue)
  const filteredIssuedBooks = issuedBooks.filter((book) => {
    const overdue = isOverdue(book.dueDate);
    if (statusFilter === "On Time") {
      return !overdue;
    }
    if (statusFilter === "Overdue") {
      return overdue;
    }
    return true;
  });

  return (
    <div className="library-page card" style={{ padding: "1.5rem" }}>
      <h2 className="card-title">📋 Active Checkouts (My Library)</h2>
      
      {/* Filters Bar */}
      <div className="controls-bar" style={{ marginBottom: "1.5rem" }}>
        <div className="search-filter-group">
          <select
            className="input-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="All">All Statuses</option>
            <option value="On Time">On Time</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {filteredIssuedBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p>No books currently issued.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Book Name</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssuedBooks.map((book) => {
                const overdue = isOverdue(book.dueDate);
                return (
                  <tr key={book.id}>
                    <td data-label="Book ID" style={{ fontWeight: 600 }}>{book.id}</td>
                    <td data-label="Book Name" style={{ fontWeight: 600 }}>{book.name}</td>
                    <td data-label="Student ID">{book.studentId}</td>
                    <td data-label="Student Name" style={{ fontWeight: 600 }}>{book.studentName}</td>
                    <td data-label="Issue Date">{book.issueDate}</td>
                    <td data-label="Due Date">{book.dueDate}</td>
                    <td data-label="Status">
                      {overdue ? (
                        <span className="badge badge-danger">🔴 Overdue</span>
                      ) : (
                        <span className="badge badge-success">🟢 On Time</span>
                      )}
                    </td>
                    <td data-label="Action">
                      <button
                        onClick={() => onReturnClick(book)}
                        className="btn btn-secondary btn-action"
                        title="Return Book"
                      >
                        ↩️ Return Book
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyLibrary;
