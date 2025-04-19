import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer id="footer" className=" bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary">GCOEA</span>
              <span className="text-2xl font-bold text-white ml-1">
                Placements
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Connecting talented students with leading companies for a brighter
              future.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#about"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Login
                </Link>
              </li>
              
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Students</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Student Login
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Recruiters Login
                </Link>
              </li>
              <li>
                <a
                  href="/faqs"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Placement FAQs
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>

          <div id="contact">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="mr-2 h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-gray-400">
                Government College Of Engineering Amravati, Maharashtra, India
                  - 444601
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary shrink-0" />
                <span className="text-gray-400">+91 0721-253L930</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary shrink-0" />
                <a
                  href="mailto:placements@gca.edu"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  principal@gcoea.ac.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Government of Engineering College
            Amravati Placement Portal. All rights reserved.
          </p>
          {/* <p className="text-gray-500 text-sm">
            Developed with ❤️ by Yash Mishra
          </p> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
