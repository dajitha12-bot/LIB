import React, { useState, useEffect } from "react";

function BookForm({ isOpen, onClose, onSubmit, bookToEdit, categories }) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    author: "",
    category: ""
  });
  const [error, setError] = useState("");

  // Initialize or reset form when bookToEdit changes
  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        id: bookToEdit.id,
        name: bookToEdit.name,
        author: bookToEdit.author,
        category: bookToEdit.category
      });
    } else {
      setFormData({
        id: "",
        name: "",
        author: "",
        category: ""
      });
    }
    setError("");
  }, [bookToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Simple validation
    if (
      !formData.id.trim() ||
      !formData.name.trim() ||
      !formData.author.trim() ||
      !formData.category.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{bookToEdit ? "✏️ Edit Book" : "➕ Add Book"}</h3>
          <button onClick={onClose} className="modal-close">
            &times;
          </button>
        </div>
        <form onSubmit={handleFormSubmit}>
          <div className="modal-body">
            {error && <div className="form-error">⚠️ {error}</div>}

            <div className="form-group">
              <label htmlFor="id">Book ID *</label>
              <input
                type="text"
                id="id"
                name="id"
                className="input-control"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g. B001"
                disabled={!!bookToEdit} // Read-only during Edit
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="name">Book Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="input-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter book name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author">Author *</label>
              <input
                type="text"
                id="author"
                name="author"
                className="input-control"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                className="input-control"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {bookToEdit ? "Save Changes" : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BookForm;
