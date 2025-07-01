import { ChevronDown } from 'lucide-react';
import React from 'react';

interface FaqItemProps {
  item: {
    id: string;
    question: string;
    answer: string;
  };
  isExpanded: boolean;
  onClick: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, isExpanded, onClick }) => (
  <div className="rounded-lg border border-gray-200 bg-base-white">
    <button className="flex w-full items-center justify-between p-3 text-left sm:p-4" onClick={onClick}>
      <span className="text-sm font-semibold sm:text-base">{item.question}</span>
      <ChevronDown
        className={`h-4 w-4 text-gray-500 transition-transform sm:h-5 sm:w-5 ${isExpanded ? 'rotate-180' : ''}`}
      />
    </button>
    {isExpanded && <div className="px-3 pb-3 text-xs text-base-gray sm:px-4 sm:pb-4 sm:text-sm">{item.answer}</div>}
  </div>
);

export default FaqItem;
