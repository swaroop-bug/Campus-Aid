import React, { useState } from "react";

function Navbar({ onLogout, userName }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const driveLink =
    "https://drive.google.com/drive/folders/1qS68ZAD6Po_6uzhyIB2k-R3TTazpfZ8Z?usp=sharing";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img
            src="/assets/logo2.png"
            alt="Campus Aid Logo"
            className="logo-image"
          />
          <span className="logo-text">Campus Aid</span>
        </div>

        <div className={`navbar-menu ${menuOpen ? "active" : ""}`}>
          
          {/* Notes */}
          <a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            📖 Notes
          </a>

          {/* Syllabus */}
          <a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            📚 Syllabus
          </a>

          <a href="/quiz" className="nav-link">✏️ Quiz</a>
          <a href="/lostfound" className="nav-link">🔍 Lost & Found</a>

          {/* program badge removed */}
          <div className="user-info">{userName}</div>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
    </nav>
  );
}

export default Navbar;