import { useEffect } from 'react';

// Adds the "in" class to every .reveal element inside `root` once it scrolls into view.
export default function useReveal(root) {
  useEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const nodes = el.querySelectorAll('.reveal');
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [root]);
}
