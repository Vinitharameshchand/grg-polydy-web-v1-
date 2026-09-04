import { useEffect } from 'react';

/**
 * Sets the document title and meta description per route.
 * Client-side only — for crawler-visible metadata this site would need
 * prerendering (see README).
 */
export default function usePageMeta(title, description) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
