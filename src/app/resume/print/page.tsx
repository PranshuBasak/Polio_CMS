'use client';

import { useResumeStore } from '@/lib/stores';
import { Briefcase, Calendar, GraduationCap, Mail, MapPin, Phone } from 'lucide-react';

/**
 * Print-Optimized Resume Page
 *
 * Usage:
 * 1. Visit /resume/print in browser
 * 2. Press Cmd/Ctrl + P
 * 3. Save as PDF: "Pranshu_Basak_Resume.pdf"
 * 4. Move to /public folder
 */
export default function ResumePrintPage() {
  const resumeData = useResumeStore((state) => state.resumeData);

  return (
    <div className="print-resume">
      {/* Print Instructions Box - Hidden when printing */}
      <div className="no-print fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg max-w-sm z-50">
        <h3 className="font-bold mb-2">📄 Generate PDF</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Press <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs">Cmd/Ctrl + P</kbd></li>
          <li>Select &quot;Save as PDF&quot;</li>
          <li>Save as <code className="bg-white/20 px-1 rounded text-xs">Pranshu_Basak_Resume.pdf</code></li>
          <li>Move to <code className="bg-white/20 px-1 rounded text-xs">/public</code> folder</li>
        </ol>
      </div>

      {/* Resume Content */}
      <header className="resume-header">
        <h1 className="resume-name">Pranshu Basak</h1>
        <p className="resume-title">Backend Developer & System Design Enthusiast</p>
        <div className="resume-contact">
          <span className="contact-item">
            <Mail className="w-3 h-3" />
            pranshubasak@gmail.com
          </span>
          <span className="contact-item">
            <Phone className="w-3 h-3" />
            +880 1521-459459
          </span>
          <span className="contact-item">
            <MapPin className="w-3 h-3" />
            Dhaka, Bangladesh
          </span>
        </div>
      </header>

      {/* Professional Summary */}
      <section className="section">
        <p className="item-description" style={{ marginBottom: 0, textAlign: 'justify' }}>
          Passionate backend developer specializing in TypeScript, Java, and scalable system architecture.
          Experienced in building robust APIs, microservices, and database systems. Strong advocate for
          clean code, test-driven development, and continuous learning. Active open-source contributor
          with 724+ GitHub contributions and multiple achievements.
        </p>
      </section>

      {/* Experience */}
      <section className="section">
        <h2 className="section-title">
          <Briefcase className="w-4 h-4" />
          Professional Experience
        </h2>
        {resumeData.experiences.map((exp) => (
          <div key={exp.id} className="experience-item">
            <div className="item-header">
              <div>
                <div className="item-title">{exp.title}</div>
                <div className="item-company">{exp.company} • {exp.location}</div>
              </div>
              <div className="item-date">
                {exp.startDate} - {exp.endDate || 'Present'}
              </div>
            </div>
            {exp.description && (
              <p className="item-description">{exp.description}</p>
            )}
            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="achievements">
                {exp.achievements.slice(0, 3).map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="section">
        <h2 className="section-title">
          <GraduationCap className="w-4 h-4" />
          Education
        </h2>
        {resumeData.education.map((edu) => (
          <div key={edu.id} className="education-item">
            <div className="item-header">
              <div>
                <div className="item-title">{edu.degree}</div>
                <div className="item-company">{edu.institution} • {edu.location}</div>
              </div>
              <div className="item-date">
                {edu.startDate} - {edu.endDate}
              </div>
            </div>
            {edu.description && (
              <p className="item-description">{edu.description}</p>
            )}
          </div>
        ))}
      </section>

      {/* Skills */}
      <section className="section">
        <h2 className="section-title">Technical Skills</h2>
        <div className="skills-grid">
          {resumeData.skills.slice(0, 6).map((skillGroup, idx) => (
            <div key={`skill-${idx}`} className="skill-category">
              <div className="skill-category-name">{skillGroup.category}</div>
              <div className="skill-items">
                {skillGroup.items.slice(0, 5).map((s) => s.name).join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <section className="section">
          <h2 className="section-title">Certifications</h2>
          <div className="certifications">
            {resumeData.certifications.slice(0, 4).map((cert) => (
              <div key={cert.id} className="cert-item">
                <div>
                  <div className="cert-name">{cert.name}</div>
                  <div className="cert-issuer">{cert.issuer}</div>
                </div>
                <div className="item-date">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {cert.date}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Print-Optimized Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }

          .print-resume {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm 20mm;
            margin: 0;
            background: white;
            box-shadow: none;
          }

          .no-print {
            display: none !important;
          }

          .section {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }

        @media screen {
          body {
            background: #f3f4f6;
          }

          .print-resume {
            width: 210mm;
            min-height: 297mm;
            padding: 15mm 20mm;
            margin: 20px auto;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }

        .print-resume {
          font-family: system-ui, -apple-system, sans-serif;
          color: #1f2937;
          line-height: 1.5;
        }

        .resume-header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .resume-name {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .resume-title {
          font-size: 1.125rem;
          color: #4b5563;
          margin-bottom: 0.75rem;
        }

        .resume-contact {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .section {
          margin-bottom: 1.25rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
          padding-bottom: 0.25rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .experience-item, .education-item {
          margin-bottom: 1rem;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .item-title {
          font-weight: 600;
          color: #111827;
          font-size: 0.9375rem;
        }

        .item-company {
          color: #4b5563;
          font-size: 0.875rem;
        }

        .item-date {
          color: #6b7280;
          font-size: 0.8125rem;
          white-space: nowrap;
        }

        .item-description {
          font-size: 0.875rem;
          color: #4b5563;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .achievements {
          font-size: 0.8125rem;
          color: #4b5563;
          padding-left: 1.25rem;
          margin: 0;
        }

        .achievements li {
          margin-bottom: 0.25rem;
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        .skill-category {
          margin-bottom: 0.5rem;
        }

        .skill-category-name {
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .skill-items {
          color: #4b5563;
          line-height: 1.4;
        }

        .certifications {
          font-size: 0.875rem;
        }

        .cert-item {
          margin-bottom: 0.5rem;
          display: flex;
          justify-between;
        }

        .cert-name {
          font-weight: 600;
          color: #111827;
        }

        .cert-issuer {
          color: #6b7280;
          font-size: 0.8125rem;
        }

        kbd, code {
          font-family: monospace;
        }
      `}</style>
    </div>
  );
}
