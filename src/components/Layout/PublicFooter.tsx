import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '../../assets/logo-1.png';

const footerGroups: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: 'Explore',
    links: [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/blog', label: 'Blog' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { to: '/contact', label: 'Contact' },
      { to: '/list-with-us', label: 'List with Us' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms & Conditions' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { to: '/projects?category=Sightseeing%20%26%20Adventure', label: 'Sightseeing & Adventure' },
      { to: '/projects?category=Museum%20%26%20Culture', label: 'Museum & Culture' },
    ],
  },
];

const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-white pt-6 sm:pt-12 pb-6 border-t border-gray-100 font-sans">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 xl:px-0">
        {/* Mobile footer: compact header row, store badges, collapsible link groups */}
        <div className="md:hidden mb-6">
          <div className="flex items-center justify-between gap-4 pb-5">
            <Link to="/" className="block focus:outline-none">
              <img src={logo1} alt="Holiday InDubai" className="h-9 w-auto object-contain" />
            </Link>
            <div className="flex items-center gap-2">
          <a href="https://www.youtube.com/@holidayindubaiapp" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </a>
          <a href="https://www.instagram.com/holidayindubai.app/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
            </div>
          </div>

          <div className="flex gap-2.5 pb-5">
            <a href="#" className="w-[120px] hover:opacity-90 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="w-full" />
            </a>
            <a href="#" className="w-[120px] hover:opacity-90 transition-opacity">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="w-full" />
            </a>
          </div>

          {/* Link groups — plain 2-column listing */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-6 pt-2">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">{group.title}</h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link to={link.to} className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet & desktop footer */}
        <div className="hidden md:flex flex-col lg:flex-row lg:justify-between gap-10 mb-10">
          {/* Brand & Apps */}
          <div className="flex flex-col items-start shrink-0 pb-6 lg:pb-0 border-b border-gray-100 lg:border-b-0">
            <Link to="/" className="mb-5 block focus:outline-none">
              <img src={logo1} alt="Holiday InDubai" className="h-10 sm:h-12 w-auto object-contain" />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 mb-6">
              <a href="https://www.youtube.com/@holidayindubaiapp" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/holidayindubai.app/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-900 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-row items-center gap-2.5 w-full sm:w-auto justify-start">
              <a href="#" className="w-[125px] hover:opacity-90 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="w-full" />
              </a>
              <a href="#" className="w-[125px] hover:opacity-90 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="Download on the App Store" className="w-full" />
              </a>
            </div>
          </div>

          {/* Link groups — grouped together so spacing stays even */}
          <div className="grid grid-cols-4 gap-x-10 lg:gap-x-16 gap-y-8">
          {/* Explore */}
          <div className="col-span-1 text-left">
            <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">Explore</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 font-normal">
              <li><Link to="/" className="hover:text-gray-900 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-gray-900 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="col-span-1 text-left">
            <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">Connect</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 font-normal">
              <li><Link to="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
              <li><Link to="/list-with-us" className="hover:text-gray-900 transition-colors">List with Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-1 text-left">
            <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">Legal</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 font-normal">
              <li><Link to="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gray-900 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1 text-left">
            <h4 className="text-[15px] font-semibold text-gray-900 pb-2.5">Categories</h4>
            <ul className="space-y-2.5 text-xs text-gray-500 font-normal">
              <li><Link to="/projects?category=Sightseeing%20%26%20Adventure" className="hover:text-gray-900 transition-colors block">Sightseeing & Adventure</Link></li>
              <li><Link to="/projects?category=Museum%20%26%20Culture" className="hover:text-gray-900 transition-colors block">Museum & Culture</Link></li>
            </ul>
          </div>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div className="pt-6 pb-2 border-t border-gray-100 flex flex-row items-center justify-between text-[11px] sm:text-xs text-gray-400 gap-3">
          <p className="whitespace-nowrap">© {new Date().getFullYear()} holidayindubai.com<span className="hidden sm:inline">. All rights reserved.</span></p>
          <div className="flex items-center gap-4 shrink-0">
            <span className="whitespace-nowrap">
              Powered by{' '}
              <a
                href="https://www.emiraaz.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold hover:underline underline-offset-2"
              >
                EMIRAAZ.COM
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
