import React from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/About.css';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-page">
      <section className="about-header">
        <h1>{t('about.header')}</h1>
        <p>{t('about.missionText')}</p>
      </section>
      <section className="about-content">
        <div>
          <h2>{t('about.mission')}</h2>
          <p>{t('about.missionText')}</p>
        </div>

        <div>
          <h2>{t('about.vision')}</h2>
          <p>{t('about.visionText')}</p>
        </div>
       
        <div>
          <h2>{t('about.howItWorks')}</h2>
          <p>{t('about.howItWorksText')}</p>
        </div>

        <div>
          <h2>{t('about.joinUs')}</h2>
          <p>{t('about.joinUsText')}</p>
        </div>
      </section>
    </div>
  );
};

export default About;
