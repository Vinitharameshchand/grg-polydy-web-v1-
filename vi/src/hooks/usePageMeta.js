import { useEffect } from 'react';
import { metaFor } from '../data/meta';

/**
 * Keeps the document title and meta description in step with client-side
 * navigation. Values come from data/meta.js — the same source the prerender
 * step bakes into each HTML file — so hydration never changes them.
 */
export default function usePageMeta(pathname) {
  useEffect(() => {
    const { title, description } = metaFor(pathname);
    document.title = title;

    let tag = document.querySelector('meta[name="description"]');
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', 'description');
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', description);
  }, [pathname]);
}
