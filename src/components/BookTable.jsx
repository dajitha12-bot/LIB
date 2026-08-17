import React from "react";

function BookTable({ books, onEdit, onDelete, onIssue }) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📚</div>
        <p>No books found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Book Name</th>
            <th>Author</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td data-label="Book ID" style={{ fontWeight: 600 }}>{book.id}</td>
              <td data-label="Book Name" style={{ fontWeight: 600 }}>{book.name}</td>
              <td data-label="Author">{book.author}</td>
              <td data-label="Category">{book.category}</td>
              <td data-label="Status">
                {book.status === "Available" ? (
                  <span className="badge badge-success">🟢 Available</span>
                ) : (
                  <span className="badge badge-danger">🔴 Issued</span>
                )}
              </td>
              <td data-label="Actions">
                <div className="actions-cell">
                  <button
                    onClick={() => onEdit(book)}
                    className="btn btn-secondary btn-action"
                    title="Edit Book"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => onDelete(book)}
                    className="btn btn-danger btn-action"
                    title="Delete Book"
                  >
                    🗑️ Delete
                  </button>
                  {book.status === "Available" && (
                    <button
                      onClick={() => onIssue(book)}
                      className="btn btn-primary btn-action"
                      title="Issue Book"
                    >
                      📖 Issue
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookTable;
