import type { ResumeData } from '../store/portfolioStore';

export async function extractResumeData(file: File): Promise<Partial<ResumeData>> {
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return parseResumeText(await extractPdfText(file));
  }
  if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
    return parseResumeText(await file.text());
  }
  throw new Error('This version supports PDF and TXT resumes. Please export your DOCX as PDF and try again.');
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist/build/pdf');
  // PDF.js 3 exposes this browser worker entry without TypeScript declarations.
  // @ts-expect-error The worker entry registers itself on window.pdfjsWorker.
  await import('pdfjs-dist/build/pdf.worker.entry');
  const document = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    const page = await document.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join('\n'));
  }
  return pages.join('\n');
}

function parseResumeText(text: string): Partial<ResumeData> {
  const lines = text.split(/\r?\n/).map((line) => line.replace(/^[•\-*]\s*/, '').trim()).filter(Boolean);
  const sections = getSections(text);
  const contactText = lines.slice(0, 12).join(' ');
  const experience = parseExperience(sections.experience);
  const education = parseEducation(sections.education);
  const skills = splitItems(sections.skills);
  const projects = parseProjects(sections.projects);

  return {
    fullName: lines[0] || '',
    email: contactText.match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0] || '',
    phone: contactText.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0] || '',
    headline: lines[1] || '',
    summary: sections.summary || '',
    experience,
    skills,
    education,
    projects,
    socialLinks: {
      github: contactText.match(/https?:\/\/(?:www\.)?github\.com\/\S+/i)?.[0],
      linkedin: contactText.match(/https?:\/\/(?:www\.)?linkedin\.com\/\S+/i)?.[0],
      portfolio: contactText.match(/https?:\/\/(?!github\.com|linkedin\.com)\S+/i)?.[0],
    },
  };
}

function getSections(text: string): Record<string, string> {
  const headings = /(?:^|\n)\s*(summary|profile|objective|experience|work experience|employment|skills|technical skills|education|projects|portfolio)\s*:?\s*(?:\n|$)/gi;
  const matches = [...text.matchAll(headings)];
  const result: Record<string, string> = {};
  matches.forEach((match, index) => {
    const name = match[1].toLowerCase();
    const start = (match.index || 0) + match[0].length;
    const end = matches[index + 1]?.index || text.length;
    const key = name.includes('summary') || name === 'profile' || name === 'objective' ? 'summary' : name.includes('experience') || name === 'employment' ? 'experience' : name.includes('skill') ? 'skills' : name === 'education' ? 'education' : 'projects';
    result[key] = `${result[key] ? `${result[key]}\n` : ''}${text.slice(start, end).trim()}`;
  });
  return result;
}

function splitItems(value = ''): string[] {
  return value.split(/\n|,|;/).map((item) => item.replace(/^[•\-*]\s*/, '').trim()).filter((item) => item && item.length < 80);
}

function parseExperience(value = ''): ResumeData['experience'] {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];
  return [{ company: lines[0] || '', position: lines[1] || '', duration: lines.find((line) => /\b(19|20)\d{2}\b/.test(line)) || '', description: lines.slice(2).join(' ') }];
}

function parseEducation(value = ''): ResumeData['education'] {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) return [];
  return [{ school: lines[0] || '', degree: lines[1] || '', field: lines[2] || '', year: lines.find((line) => /\b(19|20)\d{2}\b/.test(line)) || '' }];
}

function parseProjects(value = ''): ResumeData['projects'] {
  const lines = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.length ? [{ title: lines[0], description: lines.slice(1).join(' '), link: '', image: '' }] : [];
}
