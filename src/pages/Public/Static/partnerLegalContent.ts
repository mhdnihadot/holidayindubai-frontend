// HID PARTNER app — Privacy Policy and Terms (linked from the app and its store listings).
// Partner support contact (also in the HID PARTNER app: src/config.ts SUPPORT)
export const PARTNER_SUPPORT = {
  email: 'holidayindubaihid@gmail.com',
  phone: '+971 54 287 7328',
};

const contactLine = () => {
  const parts = [
    PARTNER_SUPPORT.email && `e-mail ${PARTNER_SUPPORT.email}`,
    PARTNER_SUPPORT.phone && `phone/WhatsApp ${PARTNER_SUPPORT.phone}`,
  ].filter(Boolean);
  return parts.length
    ? `Contact the Holiday In Dubai partner team by ${parts.join(' or ')}.`
    : 'Contact the Holiday In Dubai partner team using the Support option in the HID PARTNER app.';
};

export type LegalSection = { title: string; content: string[] };

export const partnerPrivacy = {
  title: 'HID PARTNER Privacy Policy',
  intro:
    'This Privacy Policy explains how Holiday In Dubai ("we", "us") collects, uses and protects information when you use the HID PARTNER mobile app (the "App"). The App is for businesses that list activities on Holiday In Dubai and want to see how those activities perform.',
  sections: [
    {
      title: '1. Information We Collect',
      content: [
        'Account information you provide when you register: your name, business name, e-mail address, phone number and password. Passwords are stored only in hashed form; we cannot read them.',
        'Account activity: when you log in and the requests you send to us (for example change requests about your activities).',
        'The App does not use advertising identifiers, does not track you across other apps or websites, and does not collect your location, contacts or photos.',
      ],
    },
    {
      title: '2. Information Shown to You in the App',
      content: [
        'For activities assigned to your account, the App shows statistics about how visitors interact with those activities on the Holiday In Dubai website and app: page views and clicks on the Website, WhatsApp and Call buttons, split by source (iOS app, Android app, mobile web, desktop web). These statistics are aggregated counts; they do not identify individual visitors.',
      ],
    },
    {
      title: '3. How We Use Your Information',
      content: [
        '• To create and secure your account and let you log in;',
        '• To connect your account with the activities assigned to you by our team;',
        '• To show you statistics for those activities;',
        '• To handle your change requests and contact you about your account or activities.',
        'We do not sell your personal information.',
      ],
    },
    {
      title: '4. Sharing',
      content: [
        'Your account information is visible to the Holiday In Dubai team that manages partner accounts. We may share information with service providers that host our servers, strictly to operate the App, or when required by law.',
      ],
    },
    {
      title: '5. Retention and Account Deletion',
      content: [
        'You can delete your account at any time in the App under Account → Delete account. When you do, your name, business name, e-mail address and phone number are permanently removed, your login stops working, and your activities are unassigned from your account. Aggregated activity statistics are not personal data and are kept.',
        'If you no longer have access to the App, you can ask us to delete your account using the contact details below.',
      ],
    },
    {
      title: '6. Security',
      content: [
        'Data is sent over encrypted connections (HTTPS). Login sessions expire, can be ended by logging out, and are ended on all devices when your password is changed or reset.',
      ],
    },
    {
      title: '7. Children',
      content: ['The App is for businesses and is not intended for anyone under 18.'],
    },
    {
      title: '8. Changes',
      content: [
        'We may update this policy. The updated version applies as soon as it is published on this page.',
      ],
    },
    {
      title: '9. Contact Us',
      content: [contactLine()],
    },
  ] as LegalSection[],
};

export const partnerTerms = {
  title: 'HID PARTNER Terms of Use',
  intro:
    'These Terms apply to your use of the HID PARTNER mobile app (the "App") provided by Holiday In Dubai. By creating an account or using the App you agree to these Terms.',
  sections: [
    {
      title: '1. Who Can Use the App',
      content: [
        'The App is for businesses and their authorised representatives that offer activities listed on Holiday In Dubai. You must be at least 18 and provide accurate account information.',
      ],
    },
    {
      title: '2. Your Account',
      content: [
        'You are responsible for keeping your password confidential and for all use of your account. Tell us promptly if you think your account has been accessed without permission.',
      ],
    },
    {
      title: '3. Activities and Statistics',
      content: [
        'Activities are added to Holiday In Dubai and assigned to partner accounts by our team, at our discretion. Registering an account does not guarantee that an activity will be listed or assigned to you.',
        'Statistics are provided for information only. We filter automated traffic and repeated clicks, so the numbers are estimates and may differ from other tools. Counting starts from when tracking was enabled for an activity.',
      ],
    },
    {
      title: '4. Change Requests',
      content: [
        'You can ask us to change the details of your activities through the App. We review each request but may decline or edit it, for example to keep listings accurate and consistent.',
      ],
    },
    {
      title: '5. Acceptable Use',
      content: [
        'You must not misuse the App, try to access data that is not yours, interfere with its operation, or generate artificial views or clicks.',
      ],
    },
    {
      title: '6. Suspension and Termination',
      content: [
        'We may suspend or deactivate an account that breaches these Terms or is used to harm customers or Holiday In Dubai. You can stop using the App and delete your account at any time from the Account screen.',
      ],
    },
    {
      title: '7. Disclaimer and Liability',
      content: [
        'The App is provided "as is". To the extent permitted by law, Holiday In Dubai is not liable for indirect or consequential losses, or for business decisions made based on the statistics shown in the App.',
      ],
    },
    {
      title: '8. Governing Law',
      content: ['These Terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Dubai.'],
    },
    {
      title: '9. Changes and Contact',
      content: [
        'We may update these Terms. The updated version applies as soon as it is published on this page.',
        contactLine(),
      ],
    },
  ] as LegalSection[],
};
