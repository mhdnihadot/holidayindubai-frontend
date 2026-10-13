import apiClient from '@/services/apiClient';

// Activity page views + contact-button clicks, shown to the activity's HID PARTNER.
// Fire-and-forget: tracking must never block or break the page.

export type ActivityEventType = 'view' | 'website' | 'whatsapp' | 'call';

const VISITOR_KEY = 'hid_vid';
let memoryVisitorId: string | null = null;

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

// Anonymous per-browser id, used for the "unique" counts
const getVisitorId = (): string => {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = newId();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    memoryVisitorId = memoryVisitorId || newId();
    return memoryVisitorId;
  }
};

export const trackActivity = (projectId: string | undefined, type: ActivityEventType): void => {
  if (!projectId) return;
  try {
    const base = (apiClient.defaults.baseURL || '').replace(/\/$/, '');
    // keepalive lets the request finish even when the click navigates away (wa.me, tel:, external site)
    fetch(`${base}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, type, source: 'web', visitorId: getVisitorId() }),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {});
  } catch {
    // ignore
  }
};
