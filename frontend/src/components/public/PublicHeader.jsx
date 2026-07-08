import { Link } from "react-router";
import { ChevronDown } from "lucide-react";

export default function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 h-18 border-b border-outline-variant bg-white flex items-center justify-between px-lg md:px-margin-desktop">
      <Link
        to="/"
        className="text-title-lg text-primary-container font-semibold"
      >
        Systematic Integrity
      </Link>
      <nav className="flex items-center gap-lg">
        {/* Services Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1 text-body-sm text-primary-container font-medium hover:opacity-80 transition-opacity cursor-pointer py-2">
            Services
            <ChevronDown size={16} className="transition-transform group-hover:rotate-180" />
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-outline-variant rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
            <Link
              to="/"
              className="block px-4 py-3 text-body-sm text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors"
            >
              Submit Request
            </Link>
            <div className="h-px bg-outline-variant opacity-50"></div>
            <Link
              to="/track"
              className="block px-4 py-3 text-body-sm text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors"
            >
              Track Request
            </Link>
          </div>
        </div>

        <Link to="/login">
          <button className="bg-primary-container text-white text-body-sm font-medium px-md py-sm rounded-md hover:bg-primary transition-colors">
            Admin Login
          </button>
        </Link>
      </nav>
    </header>
  );
}
