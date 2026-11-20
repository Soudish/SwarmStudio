import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FaqItem {
  id: string;
  num: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'what-is',
    num: '01',
    question: 'What is SwarmStudio?',
    answer: 'Turns one premise into a script, world lore, art direction, soundtrack notes and a quality review using five AI agents.',
  },
  {
    id: 'need-ollama',
    num: '02',
    question: 'Do I need Ollama?',
    answer: 'Not required. With Ollama it runs local models; without it, a built-in offline engine still generates a full draft.',
  },
  {
    id: 'can-edit',
    num: '03',
    question: 'Can I edit the results?',
    answer: 'Yes. Edit scenes inline, regenerate any section with notes, and rename the project.',
  },
  {
    id: 'export-formats',
    num: '04',
    question: 'What can I export?',
    answer: 'PDF, print-to-PDF and Markdown.',
  },
  {
    id: 'supported-formats',
    num: '05',
    question: 'What formats are supported?',
    answer: 'Film, game narrative and audio podcast.',
  },
  {
    id: 'privacy',
    num: '06',
    question: 'Is my work private?',
    answer: 'Projects are stored locally; concept art is generated through an online image service.',
  },
  {
    id: 'account',
    num: '07',
    question: 'Do I need an account?',
    answer: 'No, guest mode has full features. An account lets you sign in with saved projects.',
  },
];

export const Faq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-14">
        <span className="font-landing-mono text-xs uppercase tracking-wider text-text3 font-medium block mb-2">
          FAQ
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.04em] text-text1">
          Questions.
        </h2>
      </div>

      {/* Large-type Accordion */}
      <div className="border-t border-border divide-y divide-border">
        {FAQS.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="py-6 sm:py-8 group">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex items-start justify-between text-left gap-4 outline-none select-none"
              >
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="font-landing-mono text-xs sm:text-sm text-text3 group-hover:text-accent transition-colors font-medium">
                    {item.num}
                  </span>
                  <h3 className="text-lg sm:text-2xl font-medium tracking-tight text-text1 group-hover:text-accent transition-colors">
                    {item.question}
                  </h3>
                </div>

                <div className="pt-1 shrink-0">
                  <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text2 group-hover:text-text1 group-hover:border-border-hover transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pl-8 sm:pl-12 pr-4 pt-3 text-sm sm:text-base text-text2 leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
