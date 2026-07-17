import React from 'react';

const About: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About Us</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600 space-y-6">
          <p className="text-lg leading-relaxed">
            Welcome to <strong>PropertySeller</strong>, your premier destination for finding exceptional properties in Dubai. 
            We specialize in both off-plan investments and ready-to-move-in luxury homes, providing our clients with 
            unparalleled access to the city's most exclusive real estate opportunities.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-10">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Our Mission</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                To simplify the property buying process in Dubai by offering transparent, expert advice, and access to a curated portfolio of the finest developments. We aim to match every client with their perfect investment or dream home.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Our Vision</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                To become the most trusted and respected real estate advisory firm in the UAE, known for our integrity, market knowledge, and commitment to client success.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Dubai?</h2>
          <p>
            Dubai is a city of the future, offering world-class infrastructure, a tax-free environment, and a vibrant, cosmopolitan lifestyle. Whether you're looking for high rental yields, capital appreciation, or a luxurious place to live, Dubai's real estate market offers incredible potential.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Expertise</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Off-Plan Properties:</strong> Get early access to launches from top developers like Emaar, Damac, and Nakheel.</li>
            <li><strong>Luxury Villas & Apartments:</strong> Discover exclusive waterfront, golf-course, and downtown residences.</li>
            <li><strong>Investment Advisory:</strong> Data-driven insights to help you maximize your ROI.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
