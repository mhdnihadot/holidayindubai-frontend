import { useEffect } from 'react';

export const SITE_NAME = 'HolidayInDubai';
export const SITE_URL = 'https://www.holidayindubai.com';
const DEFAULT_TITLE = `${SITE_NAME} – Dubai Attractions, Tours & Experiences`;
const DEFAULT_DESCRIPTION =
  'HolidayInDubai helps you discover the best things to do in Dubai and the UAE – attractions, sightseeing, desert safaris, museums, wildlife parks and family experiences.';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;

interface SeoOptions {
  /** Page-specific part of the title; " | HolidayInDubai" is appended. Omit for the default title. */
  title?: string;
  description?: string;
  /** Path for the canonical URL, e.g. "/projects/123". Defaults to the current path. */
  path?: string;
  image?: string;
  type?: 'website' | 'article';
}

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const clip = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
};

/**
 * Per-page title / description / canonical / share tags for the public site.
 * The site is client-rendered, so these update after load (Google renders JS and picks them up).
 */
export const useSeo = ({ title, description, path, image, type = 'website' }: SeoOptions = {}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = clip(description || DEFAULT_DESCRIPTION);
    const url = `${SITE_URL}${path ?? window.location.pathname + window.location.search}`;
    const img = image || DEFAULT_IMAGE;

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setCanonical(url);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:type', type);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', img);
  }, [title, description, path, image, type]);
};
