import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import logo from "../images/logo1.png";
import { useAuth } from "@/context/AuthContext"; // Import the auth context

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Get auth state and logout function

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Features", path: "/#features" },
    { name: "FAQs", path: "/faqs" },
    { name: "Contact Us", path: "/contactus" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Call the logout function from auth context
    navigate("/"); // Redirect to home after logout
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg"
          : "bg-gradient-to-r from-indigo-500 to-purple-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="GCA Placements Logo"
                className="h-10 w-auto mr-2 rounded-3xl"
              />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-sky-400 via-slate-100 to-indigo-400 bg-clip-text text-transparent mb-1">
                GCOEA
              </span>
              <span className="text-2xl font-extrabold ml-2 bg-gradient-to-r from-indigo-400 via-slate-100 to-sky-500 bg-clip-text text-transparent mb-1">
                Placements
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className={`relative px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    location.pathname === link.path
                      ? "text-white after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-white after:left-0 after:bottom-0"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {!currentUser ? (
                <Link to="/login">
                  <Button
                    className={`mr-2 transition-all ${
                      location.pathname === "/login"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-indigo-600"
                    }`}
                  >
                    Login
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleLogout}
                  className="border border-red-600 text-red-600 bg-white hover:bg-red-500 hover:text-white transition-all"
                >
                  Logout
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-screen opacity-100 visible"
            : "max-h-0 opacity-0 invisible"
        } overflow-hidden bg-gradient-to-b from-indigo-600 to-purple-600`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? "text-white bg-white/20"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="pt-4 flex flex-col space-y-2">
            {!currentUser ? (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button
                  className={`w-full transition-all ${
                    location.pathname === "/login"
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-indigo-600"
                  }`}
                >
                  Login
                </Button>
              </Link>
            ) : (
              <Button
                onClick={handleLogout}
                className="w-full border border-red-600 text-red-600 bg-white hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;