import React, { useEffect, useState } from 'react';
import { partnerService, type PartnerItem } from '@/services/partner.service';

interface PartnerSelectInputProps {
  value: string;
  onChange: (value: string) => void;
}

// HID PARTNER account that owns this activity ('' = not assigned)
export const PartnerSelectInput: React.FC<PartnerSelectInputProps> = ({ value, onChange }) => {
  const [partners, setPartners] = useState<PartnerItem[]>([]);

  useEffect(() => {
    partnerService.list().then(setPartners).catch((error) => console.error('Failed to fetch partners:', error));
  }, []);

  // 'custom' fields render bare in FormField, so this draws its own label/help text
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black dark:text-gray-300 mb-1.5">HID PARTNER</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white shadow-xs dark:bg-[#0f172a] text-black dark:text-white border border-border-subtle dark:border-gray-700 rounded px-4 py-3 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all outline-none"
      >
        <option value="">Not assigned</option>
        {partners.map((p) => (
          <option key={p.id} value={p.id}>
            {p.businessName} — {p.name}{p.status === 'deactivated' ? ' (deactivated)' : ''}
          </option>
        ))}
      </select>
      <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
        Partner who sees this activity's stats and enquiries in the HID PARTNER app.
      </p>
    </div>
  );
};
