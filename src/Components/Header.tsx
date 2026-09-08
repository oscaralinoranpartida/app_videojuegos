import { useRef } from "react";
import "../styles.css";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  onSearch: (query: string) => void;
  onSearchEnter: (query: string) => void;
}

const Header = ({ onSearch, onSearchEnter }: HeaderProps) => {
  const { pathname } = useLocation();
  const isActive = (path: string) => {
    return pathname === path;
  };
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchClick = () => {
    if (inputRef.current) {
      onSearchEnter(inputRef.current.value);
    }
  };

  return (
    <>
      <style>
        {`
          .navegacion .item {
            padding: 0.5rem 1rem;
            transition: all 0.2s ease;
            text-decoration: none;
            color: inherit;
          }
          .navegacion .item.activo { 
            background-color: #E0E0E0; 
            color: #000; 
            font-weight: 600; 
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
          }
        `}
      </style>

      <div className="header">
        <h1>Arcade</h1>
        <div className="contenedor-busqueda">
          <button
            type="button"
            className="boton-buscar"
            aria-label="Buscar"
            onClick={handleSearchClick}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for anything"
            className="buscador"
            onChange={(e) => {
              onSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchEnter(e.currentTarget.value);
              }
            }}
          />
        </div>

        <nav className="navegacion">
          <Link to="/" className={`item ${isActive("/") ? "activo" : ""}`}>
            Inicio
          </Link>
          <Link
            to="/PlayStation"
            className={`item ${isActive("/PlayStation") ? "activo" : ""}`}
          >
            PlayStation
          </Link>
          <Link
            to="/xbox"
            className={`item ${isActive("/xbox") ? "activo" : ""}`}
          >
            Xbox
          </Link>
          <Link
            to="/nintendo"
            className={`item ${isActive("/nintendo") ? "activo" : ""}`}
          >
            Nintendo
          </Link>
          <Link
            to="/favoritos"
            className={`item ${isActive("/favoritos") ? "activo" : ""}`}
          >
            Mis favoritos
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
