import React, { useState } from "react";
import BookTable from "./BookTable";
import BookForm from "./BookForm";

function Books({ books, setBooks, onIssueClick, onAddBook, onEditBook, onDeleteBook }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Book Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const categories = [
    "Programming",
    "Database",
    "AI",
    "Novel",
    "Science",
    "Other"
  ];

  // Search and filter logic
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || book.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Deletion logic
  const handleDeleteBook = (book) => {
    if (book.status === "Issued") {
      alert("⚠️ Cannot delete a currently issued book. You must return it first!");
      return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to delete the book "${book.name}" (ID: ${book.id})?`);
    if (isConfirmed) {
      onDeleteBook(book.id);
    }
  };

  // Open form modal for adding
  const handleAddClick = () => {
    setEditingBook(null);
    setIsFormOpen(true);
  };

  // Open form modal for editing
  const handleEditClick = (book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  // Handle submit from BookForm (Both add and edit)
  const handleFormSubmit = (formData) => {
    if (editingBook) {
      onEditBook({
        id: editingBook.id,
        name: formData.name.trim(),
        author: formData.author.trim(),
        category: formData.category
      });
      setIsFormOpen(false);
    } else {
      // Check for duplicate Book ID locally first to prevent redundant API errors
      const exists = books.some((b) => b.id.toLowerCase() === formData.id.toLowerCase().trim());
      if (exists) {
        alert(`⚠️ Book ID "${formData.id}" already exists! Please use a unique Book ID.`);
        return;
      }

      onAddBook({
        id: formData.id.trim(),
        name: formData.name.trim(),
        author: formData.author.trim(),
        category: formData.category,
        status: "Available",
        studentId: "",
        studentName: "",
        issueDate: "",
        dueDate: ""
      });
      setIsFormOpen(false);
    }
  };

  return (
    <div className="books-page card" style={{ padding: "1.5rem" }}>
      <h2 className="card-title">📚 Book Register</h2>
      
      {/* Search and Filters Bar */}
      <div className="controls-bar">
        <div className="search-filter-group">
          <input
            type="text"
            className="input-control"
            placeholder="🔍 Search by Book ID, Name, Author, or Category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            className="input-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleAddClick} className="btn btn-primary">
          ➕ Add Book
        </button>
      </div>

      {/* Book Register Table */}
      <BookTable
        books={filteredBooks}
        onEdit={handleEditClick}
        onDelete={handleDeleteBook}
        onIssue={onIssueClick}
      />

      {/* Add / Edit Form Modal */}
      <BookForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        bookToEdit={editingBook}
        categories={categories}
      />
    </div>
  );
}

export default Books;
