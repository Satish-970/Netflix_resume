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
            <h3 className="text-lg font-bold mb-4">Edit Portfolio</h3>

            {/* Basic Info */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Full Name</label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => updateSection('fullName', e.target.value)}
                  className="w-full bg-netflix-darker border border-netflix-lighter rounded px-3 py-2 text-white focus:border-netflix-red outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateSection('email', e.target.value)}
                  className="w-full bg-netflix-darker border border-netflix-lighter rounded px-3 py-2 text-white focus:border-netflix-red outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Headline</label>
                <input
                  type="text"
                  value={data.headline}
                  onChange={(e) => updateSection('headline', e.target.value)}
                  className="w-full bg-netflix-darker border border-netflix-lighter rounded px-3 py-2 text-white focus:border-netflix-red outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full button-netflix py-3 rounded font-semibold transition"
            >
              Preview Portfolio
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
                {data.fullName}
              </motion.h1>
              <p className="text-xl text-gray-200 mb-4">{data.headline}</p>
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
            <p className="text-gray-300 leading-relaxed">{data.summary}</p>
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section className="glass-effect rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Skills</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.skills?.map((skill: string, i: number) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-lg p-4 text-center hover:border-netflix-red border border-netflix-lighter transition"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section className="glass-effect rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Experience</h2>
          <div className="space-y-6">
            {data.experience?.map((exp: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-l-4 border-netflix-red pl-6"
              >
                <h3 className="text-xl font-bold">{exp.position}</h3>
                <p className="text-netflix-red">{exp.company}</p>
                <p className="text-sm text-gray-400 mb-2">{exp.duration}</p>
                <p className="text-gray-300">{exp.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Projects Section */}
        {data.projects && data.projects.length > 0 && (
          <motion.section className="glass-effect rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((project: any, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="glass-effect rounded-lg overflow-hidden hover:border-netflix-red border border-netflix-lighter transition"
                >
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-netflix-red hover:text-netflix-red/80 transition"
                    >
                      View Project →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Section */}
        {data.education && data.education.length > 0 && (
          <motion.section className="glass-effect rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Education</h2>
            <div className="space-y-6">
              {data.education.map((edu: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-l-4 border-netflix-red pl-6"
                >
                  <h3 className="text-xl font-bold">{edu.degree}</h3>
                  <p className="text-netflix-red">{edu.school}</p>
                  <p className="text-sm text-gray-400">{edu.field} • {edu.year}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </motion.div>
    </div>
  );
}
