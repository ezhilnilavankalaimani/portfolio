import { useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { fadeIn } from "../utils/motion";

const focusAreas = [
  "Process Automation",
  "Data Analysis & Reporting",
  "Quality & Risk Controls",
  "Exception & Escalation Management",
  "Operational Efficiency",
];

const highlights = [
  {
    value: "99%",
    label: "Cheque processing automated (Symcor)",
    detail:
      "Moved the Symcor cheque process from manual handling to full automation: verification, Accept / Review / Reject, LOD tracking and daily reporting.",
  },
  {
    value: "100%",
    label: "Accuracy on RSP / TFSA processing",
    detail:
      "Maintained 100% accuracy on RSP / TFSA work and serve as a go-to escalation point for high-risk issues.",
  },
  {
    value: "Q2 2026",
    label: "TD Star Award recipient",
    detail:
      "Recognized with the Q2 2026 Star Award at TD for the Symcor cheque automation work.",
  },
];

const FlipCard = ({ h, index }) => {
  const [flipped, setFlipped] = useState(false);
  const face = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.2, 0.75)}
      initial='hidden'
      animate='show'
      className='sm:w-[250px] w-full'
      style={{ perspective: 1000 }}
    >
      <motion.button
        type='button'
        onClick={() => setFlipped((f) => !f)}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        aria-pressed={flipped}
        className='relative w-full h-[170px] text-left cursor-pointer'
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flipped ? "rotateY(180deg)" : "none",
        }}
      >
        <div
          style={face}
          className='bg-tertiary rounded-2xl px-6 py-5 border border-transparent hover:border-[#915EFF]'
        >
          <p className='text-white font-black sm:text-[34px] text-[28px]'>{h.value}</p>
          <p className='mt-1 text-secondary text-[14px]'>{h.label}</p>
          <p className='absolute bottom-3 right-4 text-[#915EFF] text-[12px] font-semibold'>
            Click for details &rarr;
          </p>
        </div>
        <div
          style={{ ...face, transform: "rotateY(180deg)" }}
          className='bg-[#915EFF] rounded-2xl px-6 py-5 flex items-center'
        >
          <p className='text-white text-[14px] leading-[22px]'>{h.detail}</p>
        </div>
      </motion.button>
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section className={`relative w-full mx-auto`}>
      <div
        className={`relative pt-[130px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}
      >
        <div className='flex flex-col justify-center items-center mt-5'>
          <div className='w-5 h-5 rounded-full bg-[#915EFF]' />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        <div className='pb-20'>
          <h1 className={`${styles.heroHeadText} text-white`}>
            <span className='text-[#915EFF]'>Ezhil Nilavan Kalaimani</span>
          </h1>
          <p className='mt-2 text-white sm:text-[28px] text-[20px] font-semibold'>
            Analyst | Toronto-Dominion Bank
          </p>
          <p
            className={`${styles.heroSubText} mt-4 text-white-100 max-w-3xl lg:text-[22px] sm:text-[20px] text-[16px] lg:leading-[34px]`}
          >
            I turn manual, high-volume operational work into accurate,
            automated and well-controlled processes, and turn the resulting
            data into reporting that supports sound business decisions.
          </p>

          <div className='mt-8 flex flex-wrap gap-3 max-w-3xl'>
            {focusAreas.map((area) => (
              <span
                key={area}
                className='px-4 py-2 rounded-full border border-[#915EFF] text-[#dfd9ff] sm:text-[15px] text-[13px]'
              >
                {area}
              </span>
            ))}
          </div>

          <div className='mt-10 flex flex-wrap gap-6'>
            {highlights.map((h, index) => (
              <FlipCard key={h.label} h={h} index={index} />
            ))}
          </div>

          <div className='mt-10 flex gap-4'>
            <a
              href='#work'
              className='bg-[#915EFF] text-white font-bold py-3 px-8 rounded-xl'
            >
              View Experience
            </a>
            <a
              href='#contact'
              className='border border-[#915EFF] text-white font-bold py-3 px-8 rounded-xl'
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
