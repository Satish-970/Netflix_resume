'use client';

import React, { ChangeEvent, useState } from 'react';
import { FiFile, FiUpload } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { extractResumeData } from '../lib/resumeParser';
import type { ResumeData } from '../store/portfolioStore';

interface ResumeUploadProps {
  onResumeProcessed: (data: ResumeData) => void;
}

export default function ResumeUpload({ onResumeProcessed }: ResumeUploadProps) {
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file?: File) => {
    if (!file) return;
    setFileName(file.name);
    setError('');
    setIsLoading(true);

    try {
      const extracted = await extractResumeData(file);
      if (!extracted.fullName && !extracted.summary) {
        throw new Error('We could not find readable resume text. Try a text-based PDF or TXT file.');
      }
      onResumeProcessed({
        fullName: extracted.fullName || 'Your Name',
        email: extracted.email || '',
        phone: extracted.phone || '',
        headline: extracted.headline || 'Professional',
        summary: extracted.summary || '',
        experience: extracted.experience || [],
        skills: extracted.skills || [],
        education: extracted.education || [],
        projects: extracted.projects || [],
        socialLinks: extracted.socialLinks || {},
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to read this resume.');
    } finally {
      setIsLoading(false);
    }
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    void handleFile(event.target.files?.[0]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold mb-4">Build Your <span className="text-gradient">Portfolio</span></h1>
        <p className="text-xl text-gray-400 mb-10">
          Upload your resume. We will extract your information, then you can edit the text directly in the portfolio.
        </p>
        <label className="glass-effect rounded-lg border-2 border-dashed border-netflix-red/50 hover:border-netflix-red cursor-pointer transition p-12 block">
          {isLoading ? <FiFile className="mx-auto text-netflix-red text-5xl mb-4 animate-pulse" /> : <FiUpload className="mx-auto text-netflix-red text-5xl mb-4" />}
          <h2 className="text-2xl font-semibold mb-2">{isLoading ? 'Reading your resume...' : 'Choose your resume'}</h2>
          <p className="text-gray-400 mb-3">{fileName || 'PDF or TXT files are supported'}</p>
          <p className="text-sm text-gray-500">Your resume stays in your browser and is not uploaded to a server.</p>
          <input type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={onInputChange} className="hidden" disabled={isLoading} />
        </label>
        {error && <p className="mt-4 p-4 rounded bg-red-500/20 border border-red-500 text-red-300">{error}</p>}
      </motion.div>
    </div>
  );
}
