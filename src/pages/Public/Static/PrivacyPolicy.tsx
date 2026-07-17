import React from 'react';

const privacyData = {
  lastUpdated: new Date().toLocaleDateString(),
  intro: 'At Holiday In Dubai, we take your privacy seriously. This Privacy Policy describes how your personal information is collected, used, processed, and shared when you visit, use our services, or make a booking on our platform (the "Site"). By accessing or using our services, you agree to the terms outlined in this policy.',
  sections: [
    {
      title: '1. Personal Information We Collect',
      content: [
        'When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. As you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site.',
        'Additionally, when you make a booking, purchase a ticket, or register your interest in a tour through the Site, we collect certain information from you, including your name, billing address, email address, phone number, and payment information. We refer to this information as "Order Information".'
      ]
    },
    {
      title: '2. How Do We Use Your Personal Information?',
      content: [
        'We use the Order Information that we collect generally to fulfill any bookings or ticket purchases placed through the Site (including processing your payment information, arranging for tour confirmations, and providing you with invoices and/or booking confirmations).',
        'Additionally, we use this Order Information to:',
        '• Communicate with you regarding your bookings or inquiries;',
        '• Screen our orders for potential risk or fraud; and',
        '• When in line with the preferences you have shared with us, provide you with information or advertising relating to our holiday packages, tours, and services.'
      ]
    },
    {
      title: '3. Sharing Your Personal Information',
      content: [
        'We share your Personal Information with trusted third parties to help us use your Personal Information, as described above. For example, we use third-party payment processors to securely handle your transactions. We also share information with our tour operators and partners strictly for the purpose of fulfilling your bookings.',
        'We may also share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.'
      ]
    },
    {
      title: '4. Data Retention and Security',
      content: [
        'When you place an order or make a booking through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information. We implement a variety of security measures, including encryption and secure server hosting, to maintain the safety of your personal information.'
      ]
    },
    {
      title: '5. Your Rights',
      content: [
        'If you are a resident of certain jurisdictions (such as the EEA), you have the right to access the personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.',
        'Additionally, we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make a booking through the Site), or otherwise to pursue our legitimate business interests listed above.'
      ]
    },
    {
      title: '6. Changes to This Privacy Policy',
      content: [
        'We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. The updated version will be indicated by an updated "Last updated" date and the updated version will be effective as soon as it is accessible.'
      ]
    },
    {
      title: '7. Contact Us',
      content: [
        'For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at hellow@propertyseller.com or by mail using the details provided on our Contact page.'
      ]
    }
  ]
};

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-poppins">
      <div className="max-w-[1400px] mx-auto  bg-white p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center pb-3">Privacy Policy</h1>

        <div className="prose prose-blue max-w-none text-gray-600">
          {/* <p className="mb-6 font-medium">Last updated: {privacyData.lastUpdated}</p> */}

          <p className="mb-8">{privacyData.intro}</p>

          {privacyData.sections.map((section, index) => (
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

export default PrivacyPolicy;
