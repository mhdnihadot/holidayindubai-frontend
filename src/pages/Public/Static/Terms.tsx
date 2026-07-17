import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const termsData = {
  intro: 'By accessing and using this website, you accept and agree to be bound by the terms and provisions of this agreement. In addition, when using this website\'s particular services, you shall be subject to any posted guidelines or rules applicable to such services.',
  sections: [
    {
      title: '1. Description of Service',
      content: [
        'Holiday In Dubai provides users with access to a rich collection of resources regarding tourist experiences, tours, events, and related services in Dubai and the wider UAE. This includes various communication tools, booking services, and related offerings.'
      ]
    },
    {
      title: '2. Accuracy of Information',
      content: [
        'While we strive to ensure that all information on the website is accurate, complete, and up-to-date, we do not guarantee the accuracy or completeness of any information provided. Tour prices, availability, and specifications are subject to change without notice.'
      ]
    },
    {
      title: '3. Booking and Payments',
      content: [
        'All bookings made through the site are subject to availability and our confirmation. Payments must be made in full at the time of booking unless otherwise stated. We reserve the right to cancel any booking if payment is not received or is flagged as fraudulent.'
      ]
    },
    {
      title: '4. Intellectual Property',
      content: [
        'All content included on this site, such as text, graphics, logos, button icons, images, and software, is the property of Holiday In Dubai or its content suppliers and protected by international copyright laws.'
      ]
    },
    {
      title: '5. Limitation of Liability',
      content: [
        'Holiday In Dubai shall not be liable for any direct, indirect, incidental, special or consequential damages, resulting from the use or the inability to use the service, or for cost of procurement of substitute goods and services.'
      ]
    },
    {
      title: '6. Governing Law',
      content: [
        'These Terms shall be governed and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions.'
      ]
    }
  ]
};

const Terms: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-poppins">
      <div className="max-w-[1400px] mx-auto bg-white p-8 md:p-12">
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center pb-3">Terms and Conditions</h1>

        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-8">{termsData.intro}</p>

          {termsData.sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 pb-3">{section.title}</h2>
              {section.content.map((paragraph, pIndex) => (
                <p key={pIndex} className="mb-3 text-md text-gray-600 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
