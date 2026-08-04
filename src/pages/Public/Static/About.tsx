import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="bg-white max-w-[1200px] px-4 sm:px-0 mx-auto min-h-screen py-12 text-gray-800 selection:bg-gray-100">
      <div className="w-full mx-auto">
        {/* Header section */}
        <div className="mb-5">
          <span className="text-sm font-semibold uppercase  text-black block mb-3">
            About Holiday in Dubai
          </span>
          <h1 className="text-3xl  font-semibold text-gray-900 max-w-[660px] leading-tight mb-6">
            Curating extraordinary journeys and tailored experiences across the United Arab Emirates.
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed font-normal mt-3">
            Welcome to <span className="font-semibold text-gray-900">Holiday in Dubai</span>, your premier destination for discovering exceptional tourism activities and vacations. Whether you seek exhilarating adventures, luxury maritime escapes, or peaceful cultural retreats, we simplify travel planning with curated packages and trusted expert advice.
          </p>
        </div>


        {/* Mission and Vision Grid */}
        <div className="grid sm:grid-cols-2 gap-8 my-0">
          <div className="bg-gray-50/80 border border-gray-200/60 p-6 rounded-2xl transition-all">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To make planning your Dubai vacation effortless and transparent by offering handpicked tourism activities, honest local advice, and seamlessly organized itineraries tailored to your schedule and preferences.
            </p>
          </div>

          <div className="bg-gray-50/80 border border-gray-200/60 p-6 rounded-2xl transition-all">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To be the most respected and dependable tourism advisory in the UAE, celebrated for our commitment to quality, deep destination knowledge, and dedication to memorable traveler satisfaction.
            </p>
          </div>
        </div>

        {/* Why Dubai Section */}
        <div className="space-y-6 my-8">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Why Dubai?</h2>
          <p className="text-gray-600 text-sm leading-relaxed mt-2">
            Dubai is a vibrant crossroads where innovative future architecture meets rich Arabian hospitality. Featuring world-renowned landmarks, pristine beaches, high-end shopping, and year-round sunshine, Dubai presents endless possibilities for exploration, family relaxation, and once-in-a-lifetime experiences.
          </p>
        </div>

        {/* Our Expertise Section */}
        <div className="space-y-6 my-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">What We Offer</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex items-start gap-3 mt-2">
              <span className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900 font-semibold">Curated City Attractions:</strong> Seamless tickets and packages for iconic destinations like Burj Khalifa, Dubai Fountain exhibits, and modern museum exhibits.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900 font-semibold">Desert & Coastline Adventures:</strong> Authentic sunset dune safaris, starlit Arabian camping, and private luxury yacht cruising along Dubai Marina.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900 font-semibold">Bespoke Travel Itineraries:</strong> Custom schedules crafted specifically around your individual pacing, group dimensions, and personal comfort.
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-black mt-2 flex-shrink-0" />
              <div>
                <strong className="text-gray-900 font-semibold">Dedicated Local Guidance:</strong> Direct communication with knowledgeable Dubai tourism specialists available to support your journey from arrival to departure.
              </div>
            </div>
          </div>
        </div>


        {/* Minimal Call to Action */}
        <div className="bg-gray-50 border border-gray-200/70 rounded-2xl p-8 text-center mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to plan your Dubai experience?</h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto pt-2 mb-5">
            Browse our curated selection of tours or reach out to our team directly for tailored advice and custom group arrangements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors shadow-sm"
            >
              Explore Experiences
            </Link>
            <Link
              to="/contact"
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium transition-colors shadow-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
