import React, { useEffect, useRef } from 'react';
import './apple.css';
import ApNav from './ApNav';
import ApHero from './ApHero';
import ApHighlights from './ApHighlights';
import ApWork from './ApWork';
import ApStudies from './ApStudies';
import ApRest from './ApRest';
import useReveal from './useReveal';

// Apple-style scroll site. Built stage by stage; shown with ?apple=1 until every stage is in.
const AppleSite = ({ onGame }) => {
  const root = useRef(null);
  useReveal(root);
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = 'smooth';
    return () => { el.style.scrollBehavior = prev; };
  }, []);
  return (
    <div className='ap' ref={root}>
      <ApNav onGame={onGame} />
      <ApHero onGame={onGame} />
      <ApHighlights />
      <ApWork />
      <ApStudies />
      <ApRest onGame={onGame} />
    </div>
  );
};

export default AppleSite;
