import React from 'react';
import { ChevronDown } from 'lucide-react';

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
  <div className="bg-base-white border border-gray-200 rounded-lg">
    <button className="w-full flex items-center justify-between p-4 text-left" onClick={onClick}>
      <span className="font-semibold">{item.question}</span>
      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
    </button>
    {isExpanded && (
      <div className="px-4 pb-4 text-base-gray text-sm">
        {item.answer}
      </div>
    )}
  </div>
);

export default FaqItem;