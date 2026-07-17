import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms: React.FC = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Terms and Conditions</h1>
        <p className="text-gray-500 mb-12 border-b border-gray-100 pb-8 text-[15px]">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        
        <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed text-[15px]">
          <h2 className="text-2xl mt-12 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
          </p>

          <h2 className="text-2xl mt-12 mb-4">2. Description of Service</h2>
          <p>
            Holiday In Dubai provides users with access to a rich collection of resources regarding tourist experiences, tours, events, and related services in Dubai and the wider UAE. This includes various communication tools, property listings, and related services.
          </p>

          <h2 className="text-2xl mt-12 mb-4">3. Accuracy of Information</h2>
          <p>
            While we strive to ensure that all information on the website is accurate, complete, and up-to-date, we do not guarantee the accuracy or completeness of any information provided. Tour prices, availability, and specifications are subject to change without notice.
          </p>

          <h2 className="text-2xl mt-12 mb-4">4. Intellectual Property</h2>
          <p>
            All content included on this site, such as text, graphics, logos, button icons, images, and software, is the property of Holiday In Dubai or its content suppliers and protected by international copyright laws.
          </p>

          <h2 className="text-2xl mt-12 mb-4">5. Limitation of Liability</h2>
          <p>
            Holiday In Dubai shall not be liable for any direct, indirect, incidental, special or consequential damages, resulting from the use or the inability to use the service or for cost of procurement of substitute goods and services.
          </p>
          
          <h2 className="text-2xl mt-12 mb-4">6. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
