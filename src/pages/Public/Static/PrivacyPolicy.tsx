import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Privacy Policy</h1>
        
        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>
            At PropertySeller, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a request on our website.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Personal Information We Collect</h2>
          <p>
            When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
          </p>
          <p>
            Additionally, when you make an inquiry or register interest in a property through the Site, we collect certain information from you, including your name, email address, and phone number.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. How Do We Use Your Personal Information?</h2>
          <p>
            We use the inquiry information that we collect generally to fulfill any requests placed through the Site (including contacting you with property details). Additionally, we use this information to:
          </p>
          <ul>
            <li>Communicate with you;</li>
            <li>Screen our requests for potential risk or fraud; and</li>
            <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Sharing Your Personal Information</h2>
          <p>
            We share your Personal Information with third parties to help us use your Personal Information, as described above. We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Your Rights</h2>
          <p>
            If you are a resident of certain jurisdictions, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
          <p>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at privacy@propertyseller.example.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
