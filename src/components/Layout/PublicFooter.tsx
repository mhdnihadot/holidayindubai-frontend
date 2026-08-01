import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../../assets/logo-1.png';

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-white pt-10 sm:pt-12 pb-6 border-t border-gray-100 font-sans">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-8 gap-x-6 sm:gap-8 mb-10">
          {/* Brand & Apps */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-start pb-6 lg:pb-0 border-b border-gray-100 lg:border-b-0">
            <Link to="/" className="mb-5 block focus:outline-none">
              <img src={logo1} alt="Holiday InDubai" className="h-10 sm:h-12 w-auto object-contain" />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mb-6">
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#FF1645]/10 text-[#FF1645] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#FF1645]/10 text-[#FF1645] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-[#FF1645]/10 text-[#FF1645] flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto justify-start">
              <a href="#" className="w-[135px] sm:w-[140px] hover:opacity-90 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="w-full" />
              </a>
              <a href="#" className="w-[135px] sm:w-[140px] hover:opacity-90 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="w-full" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="col-span-1">
            <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">Explore</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 font-normal">
              <li><Link to="/" className="hover:text-gray-900 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
              <li><Link to="/news" className="hover:text-gray-900 transition-colors">News</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1">
            <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">Connect</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 font-normal">
              <li><Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
              <li><Link to="/list-with-us" className="hover:text-gray-900 transition-colors">List with Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1">
            <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">Legal</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 font-normal">
              <li><Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gray-900 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/refund-policy" className="hover:text-gray-900 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">Categories</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 font-normal">
              <li><Link to="/projects?category=top-must-do" className="hover:text-gray-900 transition-colors block">Top & Must-Do Experiences</Link></li>
              <li><Link to="/projects?category=landmarks" className="hover:text-gray-900 transition-colors block">Landmarks & Sightseeing</Link></li>
              <li><Link to="/projects?category=desert-nature" className="hover:text-gray-900 transition-colors block">Desert & Nature Experiences</Link></li>
              <li><Link to="/projects" className="hover:text-gray-900 transition-colors mt-3 inline-block text-black font-semibold">View All →</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="pt-6 pb-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} Holiday In Dubai. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Made with precision for explorers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
