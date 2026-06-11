'use client';

export default function ResumePreview({ formValues, userName, id, isPdf }) {
  const {
    contactInfo = {},
    summary,
    skills,
    experience = [],
    education = [],
    projects = [],
    customSections = [],
  } = formValues || {};

  const skillLines = skills
    ? skills
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      id={id}
      className={`w-full max-w-[8.5in] mx-auto bg-white text-black text-[13pt] leading-tight ${isPdf ? 'px-0 py-0' : 'px-10 py-6'}`}
      style={{ fontFamily: "'Tinos', serif" }}
    >
      <header className="text-center mb-3 pb-1">
        <h1 className="text-4xl font-light tracking-wide uppercase text-center">
          {userName || 'Your Name'}
        </h1>
        <div className="mt-1">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-black">
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-black underline underline-offset-4 flex items-center gap-1"
              >
                {contactInfo.email}
              </a>
            )}
            {contactInfo.email &&
              (contactInfo.mobile ||
                contactInfo.linkedin ||
                contactInfo.github ||
                contactInfo.portfolio ||
                contactInfo.codingProfile) && (
                <span className="text-gray-400">|</span>
              )}
            {contactInfo.mobile && (
              <span className="flex items-center gap-1">
                {contactInfo.mobile}
              </span>
            )}
            {contactInfo.mobile &&
              (contactInfo.linkedin ||
                contactInfo.github ||
                contactInfo.portfolio ||
                contactInfo.codingProfile) && (
                <span className="text-gray-400">|</span>
              )}
            {contactInfo.linkedin && (
              <a
                href={contactInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline underline-offset-4 flex items-center gap-1"
              >
                {contactInfo.linkedin.replace(/^https?:\/\//, '')}
              </a>
            )}
            {contactInfo.linkedin &&
              (contactInfo.github ||
                contactInfo.portfolio ||
                contactInfo.codingProfile) && (
                <span className="text-gray-400">|</span>
              )}
            {contactInfo.github && (
              <a
                href={contactInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline underline-offset-4 flex items-center gap-1"
              >
                {contactInfo.github.replace(/^https?:\/\//, '')}
              </a>
            )}
            {contactInfo.github &&
              (contactInfo.portfolio || contactInfo.codingProfile) && (
                <span className="text-gray-400">|</span>
              )}
            {contactInfo.portfolio && (
              <a
                href={contactInfo.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline underline-offset-4 flex items-center gap-1"
              >
                {contactInfo.portfolio.replace(/^https?:\/\//, '')}
              </a>
            )}
            {contactInfo.portfolio && contactInfo.codingProfile && (
              <span className="text-gray-400">|</span>
            )}
            {contactInfo.codingProfile && (
              <a
                href={contactInfo.codingProfile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black underline underline-offset-4 flex items-center gap-1"
              >
                {contactInfo.codingProfile.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </header>

      {summary && (
        <section className="mb-3">
          <h2 className="text-[11pt] font-semibold uppercase tracking-wide border-b border-gray-900 mb-2 pb-1">
            Professional Summary
          </h2>
          <p className="text-[10pt]">{summary}</p>
        </section>
      )}

      {education.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11pt] font-semibold uppercase tracking-wide border-b border-gray-900 mb-2 pb-1">
            Education
          </h2>
          {education.map((entry, i) => (
            <EntryBlock key={i} entry={entry} />
          ))}
        </section>
      )}

      {experience.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11pt] font-semibold uppercase tracking-wide border-b border-gray-900 mb-2 pb-1">
            Experience
          </h2>
          {experience.map((entry, i) => (
            <EntryBlock key={i} entry={entry} />
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11pt] font-semibold uppercase tracking-wide border-b border-gray-900 mb-2 pb-1">
            Projects
          </h2>
          {projects.map((entry, i) => (
            <ProjectBlock key={i} entry={entry} />
          ))}
        </section>
      )}

      {customSections.length > 0 &&
        customSections.map((section, i) => (
          <section key={i} className="mb-3">
            <h2 className="text-[11pt] font-semibold uppercase tracking-wide border-b border-gray-900 mb-2 pb-1">
              {section.heading}
            </h2>
            <div className="mb-2">
              <div className="flex justify-between text-[11pt]">
                <span className="font-semibold">{section.title}</span>
                {section.date && (
                  <span className="text-gray-700">{section.date}</span>
                )}
              </div>
              {section.link && (
                <div className="text-[10pt]">
                  <span className="font-medium">link: </span>
                  <a
                    href={section.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black underline underline-offset-4"
                  >
                    {section.link.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {section.description && (
                <p className="text-[10pt] mt-1">{section.description}</p>
              )}
            </div>
          </section>
        ))}

      {skillLines.length > 0 && (
        <section className="mb-3">
          <h2 className="text-[11pt] font-semibold uppercase tracking-wide border-b border-gray-900 mb-2 pb-1">
            Technical Skills
          </h2>
          <div className="text-[10pt] space-y-0.5">
            {skillLines.map((line, i) => {
              const [label, ...rest] = line.split(':');
              const value = rest.join(':').trim();
              return value ? (
                <div key={i}>
                  <span className="font-semibold">{label.trim()}: </span>
                  {value}
                </div>
              ) : (
                <div key={i}>{line}</div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function dateRange(entry) {
  if (entry.current) return `${entry.startDate} – Present`;
  return `${entry.startDate}${entry.endDate ? ` – ${entry.endDate}` : ''}`;
}

function parseBullets(description = '') {
  return description
    .split('\n')
    .map((l) => l.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function EntryBlock({ entry }) {
  const bullets = parseBullets(entry.description);
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[11pt]">
        <span className="font-semibold">{entry.organization}</span>
        <span className="text-gray-700">{dateRange(entry)}</span>
      </div>
      <div className="flex justify-between text-[10pt] italic">
        <span>{entry.title}</span>
        {entry.location && (
          <span className="text-gray-600">{entry.location}</span>
        )}
      </div>
      {bullets.length > 0 && (
        <ul className="list-disc list-outside ml-4 mt-1 text-[10pt] space-y-0.5">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProjectBlock({ entry }) {
  const bullets = parseBullets(entry.description);
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[11pt]">
        <span>
          <span className="font-semibold">{entry.title}</span>
          {entry.organization && (
            <span className="text-[10pt] text-gray-500 ml-2">
              | {entry.organization}
            </span>
          )}
        </span>
        <span className="text-gray-700 text-[10pt]">{dateRange(entry)}</span>
      </div>
      {bullets.length > 0 && (
        <ul className="list-disc list-outside ml-4 mt-1 text-[10pt] space-y-0.5">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
