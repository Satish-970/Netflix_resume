'use client';

import React, { FormEvent, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import type { ResumeData } from '../store/portfolioStore';

interface ResumeUploadProps {
  onResumeProcessed: (data: ResumeData) => void;
}

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  headline: '',
  summary: '',
  company: '',
  position: '',
  duration: '',
  experienceDescription: '',
  skills: '',
  school: '',
  degree: '',
  field: '',
  year: '',
  projectTitle: '',
  projectDescription: '',
  projectLink: '',
  github: '',
  linkedin: '',
  portfolio: '',
};

export default function ResumeUpload({ onResumeProcessed }: ResumeUploadProps) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const update = (key: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const inputClass =
    'w-full bg-netflix-darker border border-netflix-lighter rounded px-3 py-2 text-white placeholder-gray-600 focus:border-netflix-red outline-none';

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!form.fullName.trim() || !form.email.trim() || !form.headline.trim() || !form.summary.trim()) {
      setError('Please complete your name, email, headline, and professional summary.');
      return;
    }

    const data: ResumeData = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      headline: form.headline.trim(),
      summary: form.summary.trim(),
      experience: form.company.trim()
        ? [{
            company: form.company.trim(),
            position: form.position.trim(),
            duration: form.duration.trim(),
            description: form.experienceDescription.trim(),
          }]
        : [],
      skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      education: form.school.trim()
        ? [{
            school: form.school.trim(),
            degree: form.degree.trim(),
            field: form.field.trim(),
            year: form.year.trim(),
          }]
        : [],
      projects: form.projectTitle.trim()
        ? [{
            title: form.projectTitle.trim(),
            description: form.projectDescription.trim(),
            link: form.projectLink.trim(),
            image: '',
          }]
        : [],
      socialLinks: {
        github: form.github.trim() || undefined,
        linkedin: form.linkedin.trim() || undefined,
        portfolio: form.portfolio.trim() || undefined,
      },
    };

    onResumeProcessed(data);
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4">
            Build Your <span className="text-gradient">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-400">
            Tell us about yourself. We will turn your answers into a downloadable HTML portfolio.
          </p>
        </div>

        <div className="glass-effect rounded-lg p-6 md:p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">About you</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full name *" value={form.fullName} onChange={(v) => update('fullName', v)} className={inputClass} />
              <Field label="Email *" type="email" value={form.email} onChange={(v) => update('email', v)} className={inputClass} />
              <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} className={inputClass} />
              <Field label="Professional headline *" value={form.headline} onChange={(v) => update('headline', v)} className={inputClass} placeholder="e.g. Frontend Developer" />
            </div>
            <label className="block text-sm text-gray-400 mt-4">Professional summary *</label>
            <textarea value={form.summary} onChange={(e) => update('summary', e.target.value)} rows={4} className={`${inputClass} mt-2`} placeholder="What do you do best? What makes your work valuable?" />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Company" value={form.company} onChange={(v) => update('company', v)} className={inputClass} />
              <Field label="Job title" value={form.position} onChange={(v) => update('position', v)} className={inputClass} />
              <Field label="Duration" value={form.duration} onChange={(v) => update('duration', v)} className={inputClass} placeholder="2022 - Present" />
            </div>
            <label className="block text-sm text-gray-400 mt-4">What did you accomplish?</label>
            <textarea value={form.experienceDescription} onChange={(e) => update('experienceDescription', e.target.value)} rows={3} className={`${inputClass} mt-2`} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Skills and education</h2>
            <Field label="Skills (comma separated)" value={form.skills} onChange={(v) => update('skills', v)} className={inputClass} placeholder="React, TypeScript, Node.js" />
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Field label="School or university" value={form.school} onChange={(v) => update('school', v)} className={inputClass} />
              <Field label="Degree" value={form.degree} onChange={(v) => update('degree', v)} className={inputClass} />
              <Field label="Field of study" value={form.field} onChange={(v) => update('field', v)} className={inputClass} />
              <Field label="Graduation year" value={form.year} onChange={(v) => update('year', v)} className={inputClass} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Featured project</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Project name" value={form.projectTitle} onChange={(v) => update('projectTitle', v)} className={inputClass} />
              <Field label="Project link" type="url" value={form.projectLink} onChange={(v) => update('projectLink', v)} className={inputClass} placeholder="https://" />
            </div>
            <label className="block text-sm text-gray-400 mt-4">Project description</label>
            <textarea value={form.projectDescription} onChange={(e) => update('projectDescription', e.target.value)} rows={3} className={`${inputClass} mt-2`} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Links</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Field label="GitHub URL" type="url" value={form.github} onChange={(v) => update('github', v)} className={inputClass} />
              <Field label="LinkedIn URL" type="url" value={form.linkedin} onChange={(v) => update('linkedin', v)} className={inputClass} />
              <Field label="Personal website" type="url" value={form.portfolio} onChange={(v) => update('portfolio', v)} className={inputClass} />
            </div>
          </section>

          {error && <p className="p-3 rounded bg-red-500/20 border border-red-500 text-red-300">{error}</p>}
          <button type="submit" className="button-netflix w-full py-3 rounded font-semibold flex items-center justify-center gap-2">
            Review my portfolio <FiArrowRight />
          </button>
        </div>
      </motion.form>
    </div>
  );
}

function Field({ label, value, onChange, className, type = 'text', placeholder = '' }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  className: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm text-gray-400">
      {label}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={`${className} mt-2`} placeholder={placeholder} />
    </label>
  );
}
