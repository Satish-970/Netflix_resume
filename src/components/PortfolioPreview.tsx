'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';
import type { ResumeData } from '../store/portfolioStore';
import { downloadPortfolioHtml } from '../lib/exportHtml';

interface PortfolioPreviewProps {
  initialData: ResumeData;
  isPreviewMode?: boolean;
  onComplete?: (data: ResumeData) => void;
}

export default function PortfolioPreview({ 
  initialData, 
  isPreviewMode = false,
  onComplete 
}: PortfolioPreviewProps) {
  const [data, setData] = useState<ResumeData>(initialData);
  const handleSave = () => {
    if (onComplete) {
      onComplete(data);
    }
  };

  const updateSection = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    setData((prev: ResumeData) => ({ ...prev, [key]: value }));
  };

  const updateDetectedSection = (sectionIndex: number, entryIndex: number, value: string) => {
    const sections = data.sections.map((section, currentSectionIndex) => {
      if (currentSectionIndex !== sectionIndex) return section;
      const entries = section.entries.map((entry, currentEntryIndex) =>
        currentEntryIndex === entryIndex ? value : entry
      );
      return { ...section, entries };
    });
    updateSection('sections', sections);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Editor Panel */}
      {!isPreviewMode && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="glass-effect rounded-lg p-6 sticky top-20">
            <h3 className="text-lg font-bold mb-4">Edit your portfolio</h3>
            <p className="text-gray-400 text-sm mb-6">
              Your resume information is shown on the right. Click any highlighted text to edit it directly.
            </p>
            <button
              onClick={handleSave}
              className="w-full button-netflix py-3 rounded font-semibold transition"
            >
              Save edits and preview
            </button>
          </div>
        </motion.div>
      )}

      {/* Preview Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={isPreviewMode ? 'lg:col-span-3' : 'lg:col-span-2'}
      >
        {isPreviewMode && (
          <button
            onClick={() => downloadPortfolioHtml(data)}
            className="button-netflix mb-6 px-5 py-3 rounded font-semibold flex items-center gap-2"
          >
            <FiDownload /> Download portfolio HTML
          </button>
        )}
        {/* Hero Section */}
        <motion.section className="glass-effect rounded-lg overflow-hidden mb-8">
          <div className="relative h-80 bg-gradient-to-br from-netflix-red to-netflix-lighter flex items-end p-8">
            <div className="relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-bold mb-2"
              >
                <EditableText value={data.fullName} onChange={(value) => updateSection('fullName', value)} />
              </motion.h1>
              <p className="text-xl text-gray-200 mb-4"><EditableText value={data.headline} onChange={(value) => updateSection('headline', value)} /></p>
              <div className="flex gap-4">
                <a href={`mailto:${data.email}`} className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition font-semibold">
                  Contact Me
                </a>
                {data.socialLinks?.github && (
                  <a href={data.socialLinks.github} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border border-white rounded hover:bg-white/20 transition">
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-8 border-t border-netflix-lighter">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <EditableText value={data.summary} onChange={(value) => updateSection('summary', value)} multiline className="text-gray-300 leading-relaxed" />
          </div>
        </motion.section>

        {data.sections.map((section, sectionIndex) => (
          <motion.section key={`${section.title}-${sectionIndex}`} className="glass-effect rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              <EditableText
                value={section.title}
                onChange={(value) => {
                  const sections = [...data.sections];
                  sections[sectionIndex] = { ...sections[sectionIndex], title: value };
                  updateSection('sections', sections);
                }}
              />
            </h2>
            <div className="space-y-3">
              {section.entries.map((entry, entryIndex) => (
                <EditableText
                  key={`${sectionIndex}-${entryIndex}`}
                  value={entry}
                  onChange={(value) => updateDetectedSection(sectionIndex, entryIndex, value)}
                  className="block text-gray-300 leading-relaxed"
                  multiline
                />
              ))}
            </div>
          </motion.section>
        ))}

      </motion.div>
    </div>
  );
}

function EditableText({ value, onChange, className = '', multiline = false }: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  return (
    <span
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      className={`editable-text ${className}`}
      onBlur={(event) => onChange(event.currentTarget.textContent?.trim() || '')}
      onKeyDown={(event) => {
        if (!multiline && event.key === 'Enter') {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
    >
      {value}
    </span>
  );
}
