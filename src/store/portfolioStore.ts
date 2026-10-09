'use client';

import { create } from 'zustand';

export interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  headline: string;
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  education: Array<{
    school: string;
    degree: string;
    field: string;
    year: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    link: string;
    image: string;
  }>;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
  };
}

interface PortfolioStore {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData) => void;
  updateResumeData: (data: Partial<ResumeData>) => void;
  clearResumeData: () => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  resumeData: null,
  setResumeData: (data) => set({ resumeData: data }),
  updateResumeData: (data) =>
    set((state) => ({
      resumeData: state.resumeData ? { ...state.resumeData, ...data } : null,
    })),
  clearResumeData: () => set({ resumeData: null }),
}));
