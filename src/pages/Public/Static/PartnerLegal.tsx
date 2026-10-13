import React from 'react';
import { useSeo } from '@/hooks/useSeo';
import { partnerPrivacy, partnerTerms } from './partnerLegalContent';

// /partner/privacy and /partner/terms — HID PARTNER app legal pages
const PartnerLegal: React.FC<{ page: 'privacy' | 'terms' }> = ({ page }) => {
  const doc = page === 'privacy' ? partnerPrivacy : partnerTerms;
  useSeo({ title: doc.title, path: `/partner/${page}` });
  return (
    <div className="bg-white min-h-screen font-poppins">
      <div className="max-w-[1400px] mx-auto  bg-white p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center pb-3">{doc.title}</h1>

        <div className="prose prose-blue max-w-none text-gray-600">
          <p className="mb-8">{doc.intro}</p>

          {doc.sections.map((section, index) => (
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

export default PartnerLegal;
