import React from "react";

function Header({ activePage, setActivePage }) {
  return (
    <header>
      <div className="nav-container">
        <button 
          onClick={() => setActivePage("home")} 
          className="logo"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          📚 SmartLib Entry
        </button>
        <nav className="nav-links">
          <button
            onClick={() => setActivePage("home")}
            className={`nav-link ${activePage === "home" ? "active" : ""}`}
          >
            Home
          </button>
          <button
            onClick={() => setActivePage("books")}
            className={`nav-link ${activePage === "books" ? "active" : ""}`}
          >
            Books
          </button>
          <button
            onClick={() => setActivePage("library")}
            className={`nav-link ${activePage === "library" ? "active" : ""}`}
          >
            My Library
          </button>
          <button
            onClick={() => setActivePage("transactions")}
            className={`nav-link ${activePage === "transactions" ? "active" : ""}`}
          >
            Transactions
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
