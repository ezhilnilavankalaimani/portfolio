import React from 'react';
import zion from '../assets/apple/logo_zion.png';
import anna from '../assets/apple/logo_anna.png';
import conestoga from '../assets/apple/logo_conestoga.png';

const SCHOOLS = [
  { logo: zion, alt: 'Zion Matriculation Higher Secondary School logo', yr: '2000 - 2014', h: 'Primary and Secondary Education', small: 'Zion Matriculation Higher Secondary School, Selaiyur', marks: [['86.2%', 'Grade 10'], ['85.2%', 'Grade 12']], p: 'English-medium schooling, finishing Grade 12 with Physics, Chemistry, Biology and Mathematics before moving on to engineering.' },
  { logo: anna, alt: 'Anna University logo', yr: '2014 - 2018', h: 'B.E. Computer Science and Engineering', small: 'Anna University, Chennai · GPA 3.70', p: 'General Secretary of the CSI Student Chapter, and chess in activities. 2nd place of 25 teams in the IIT Bombay Android workshop. Won 1st place with the Smart Irrigation paper at Sri Sai Ram, a Tamil Nadu-wide competition, and also presented it at SRM and MIT.' },
  { logo: conestoga, alt: 'Conestoga College logo', yr: '2021 - 2022', h: 'Postgraduate, IT Business Analysis', small: 'Conestoga College, Ontario · GPA 3.84, Distinction and course topper', p: 'Advanced Data Analytics, Requirements Modeling and Visualization, Business Process Flow Analysis, Service Management, ERP, UI/UX and more, while working part-time.' },
];

const CERTS = [
  ['Certified ScrumMaster', 'Scrum Alliance, May 2025'],
  ['Python Bronze', 'HackerRank, Feb 2024'],
  ['WES verified qualifications', 'Sep 2024'],
  ['Lean Six Sigma White Belt', 'MSI, Oct 2021'],
  ['Microsoft Excel 2019', 'Pearson, Oct 2021'],
  ['SQL for Data Science', 'Coursera, Jun 2021'],
  ['Analytics Using Python', 'Be10x, May 2021'],
  ['Google Analytics for Beginners', ''],
];

const ApStudies = () => (
  <section className='sec soft' id='studies'>
    <div className='eyebrow'>The studies.</div>
    <h2 className='reveal'>Learning, on purpose.</h2>
    <p className='sub'>From school in Chennai to a B.E. in Computer Science and a postgraduate in IT Business Analysis, with certifications alongside.</p>
    <div className='tl'>
      {SCHOOLS.map((s) => (
        <div className='tli lg reveal' key={s.h}>
          <img src={s.logo} alt={s.alt} width={72} height={72} />
          <span className='yr'>{s.yr}</span>
          <h3>{s.h}</h3>
          <small>{s.small}</small>
          {s.marks && (
            <div className='marks'>
              {s.marks.map(([v, l]) => <span key={l}><b>{v}</b>{l}</span>)}
            </div>
          )}
          {s.p && <p>{s.p}</p>}
        </div>
      ))}
      <div className='tli reveal'>
        <span className='yr'>2021 - 2025</span>
        <h3>Courses &amp; certifications</h3>
        <small>Self-paced learning and credentials</small>
        <div className='certs'>
          {CERTS.map(([n, d]) => <span key={n}>{n}{d && <> <em>{d}</em></>}</span>)}
        </div>
      </div>
    </div>
  </section>
);

export default ApStudies;
