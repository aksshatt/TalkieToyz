import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className="fixed bottom-24 right-5 z-40 w-11 h-11 rounded-full bg-teal text-white shadow-soft-lg hover:bg-teal-dark transition-all hover:scale-110"
    >
      <ArrowUp className="w-5 h-5 mx-auto" />
    </button>
  );
};

export default ScrollToTopButton;
