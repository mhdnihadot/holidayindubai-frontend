import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PARTNER_SUPPORT } from './partnerLegalContent';

// /partner/support — Support URL for the HID PARTNER app's App Store listing
const FAQ = [
  {
    q: 'I forgot my password',
    a: 'Contact us from the email address or phone number on your account and we will set a new password for you. For your security, all your devices are signed out when the password is reset.',
  },
  {
    q: 'I registered but I see no activities',
    a: 'After you sign up, the Holiday In Dubai team links your activities to your account. Contact us with your business name and the activities you run, and they will appear in the app.',
  },
  {
    q: 'How are views and clicks counted?',
    a: 'A view is counted when someone opens your activity on the Holiday In Dubai website or app. Website, WhatsApp and Call clicks are counted when they tap those buttons. Repeated views from the same person within 30 minutes and automated traffic are not counted. "Unique" counts each visitor once.',
  },
  {
    q: 'How do I change my activity details?',
    a: 'Open the activity in the app and tap "Request change". The team updates the listing and replies in the app.',
  },
  {
    q: 'How do I delete my account?',
    a: 'In the app, go to Account → Delete account and confirm with your password. Your personal details are removed permanently.',
  },
];

const PartnerSupport: React.FC = () => {
  useSeo({ title: 'HID PARTNER Support', path: '/partner/support' });
  const digits = PARTNER_SUPPORT.phone.replace(/\D/g, '');
  const contacts = [
    { label: 'Email', value: PARTNER_SUPPORT.email, href: `mailto:${PARTNER_SUPPORT.email}?subject=HID%20PARTNER%20support`, Icon: Mail },
    { label: 'WhatsApp', value: PARTNER_SUPPORT.phone, href: `https://wa.me/${digits}`, Icon: MessageCircle },
    { label: 'Call', value: PARTNER_SUPPORT.phone, href: `tel:+${digits}`, Icon: Phone },
  ];
  return (
    <div className="bg-white min-h-screen font-poppins">
      <div className="max-w-[900px] mx-auto bg-white p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">HID PARTNER Support</h1>
        <p className="text-center text-gray-600 mb-10">
          Help for businesses using the HID PARTNER app to see how their Holiday In Dubai activities perform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 pb-4">Contact the partner team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
          {contacts.map(({ label, value, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <Icon className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="min-w-0">
                <span className="block text-xs text-gray-500">{label}</span>
                <span className="block text-sm font-semibold text-gray-900 break-words">{value}</span>
              </span>
            </a>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 pb-4">Common questions</h2>
        <div className="space-y-6 mb-12">
          {FAQ.map(item => (
            <div key={item.q}>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.q}</h3>
              <p className="text-gray-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500">
          See also the <Link to="/partner/privacy" className="underline">Privacy Policy</Link> and{' '}
          <Link to="/partner/terms" className="underline">Terms of Use</Link>.
        </p>
      </div>
    </div>
  );
};

export default PartnerSupport;
