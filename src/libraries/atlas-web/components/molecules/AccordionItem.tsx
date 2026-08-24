import React, { useState } from 'react';
import { Icon } from '../atoms';

export interface AccordionItemProps {
  question: string;
  answer: React.ReactNode;
  /** Uncontrolled initial state. */
  defaultOpen?: boolean;
  /** Controlled state — overrides internal state when provided. */
  open?: boolean;
  onToggle?: (open: boolean) => void;
}

/** Expandable FAQ row — question, rotating chevron, answer. */
export function AccordionItem({
  question,
  answer,
  defaultOpen = false,
  open,
  onToggle,
}: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = open ?? internalOpen;

  const toggle = () => {
    if (open === undefined) setInternalOpen(!isOpen);
    onToggle?.(!isOpen);
  };

  return (
    <div className={`atlas-accordion${isOpen ? ' atlas-accordion--open' : ''}`}>
      <button
        type="button"
        className="atlas-accordion__trigger"
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <span className="atlas-accordion__question">{question}</span>
        <Icon name="chevron-down" size={18} className="atlas-accordion__chevron" />
      </button>
      {isOpen && <div className="atlas-accordion__answer">{answer}</div>}
    </div>
  );
}
