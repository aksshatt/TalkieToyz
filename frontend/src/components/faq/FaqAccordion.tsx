import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Faq } from '../../types/faq';

interface FaqAccordionProps {
  faq: Faq;
}

const FaqAccordion: React.FC<FaqAccordionProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card-talkie mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between text-left p-4"
      >
        <span className="font-bold text-lg text-warmgray-800 pr-4">
          {faq.question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-teal flex-shrink-0 mt-1" />
        ) : (
          <ChevronDown className="h-5 w-5 text-teal flex-shrink-0 mt-1" />
        )}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-2 border-t border-warmgray-200 animate-slide-in">
          <p className="text-warmgray-700 leading-relaxed whitespace-pre-line">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default FaqAccordion;
