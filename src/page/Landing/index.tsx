import React from 'react';
import logo from '../../assets/logo_vertical.png';
import diagram from '../../assets/homepage_diagram.svg';
import { globalConfig } from '../../page/globalConfig';
import twitterSvg from '../../assets/twitter.svg';
import inviteSvg from '../../assets/invite.svg';
import { DocsButton, LaunchAppButton } from '../../components/Btns';
import styles from './index.module.less';
import partner1logo from '../../assets/partners/1.png';
import partner2logo from '../../assets/partners/2.png';
import partner3logo from '../../assets/partners/3.png';
import partner4logo from '../../assets/partners/4.png';
const { twitterHref, discordHref } = globalConfig;

const LandingPage = () => {
  return (
    <div>
      <div className={styles.logo_wrapper}>
        <div>
          <img src={logo} alt="" />
        </div>
        <DocsButton
          onClick={() => {
            window.open('https://docs.agilitylsd.com/', '_blank');
          }}
        />
      </div>
      <div className={styles.content}>
        <div className="contents">
          <div className={'titles'}>
            <div className="title">The world&apos;s first LSD Liquidity Layer.</div>
            <div className="subtitle">
              Our vision is to unlock liquidity for LSD holders and explore more LSD trading scenarios, as well as
              provide deep liquidity for other LSD-relative protocols.
            </div>
          </div>
          <div className="diagram">
            <img src={diagram} alt="" />
          </div>
        </div>
        <div>
          <LaunchAppButton />
        </div>
        <div
          className="title"
          style={{
            marginTop: '30px',
            marginBottom: '12px',
            fontSize: 24,
          }}
        >
          Partnership
        </div>
        <div className="partners">
          <a href={'https://twitter.com/StaFi_Protocol'} target="_blank" rel="noreferrer">
            <img src={partner1logo} alt="" />
          </a>
          <a href={'https://twitter.com/ankrstaking'} target="_blank" rel="noreferrer">
            <img src={partner2logo} alt="" />
          </a>
          <a href={'https://twitter.com/okx'} target="_blank" rel="noreferrer">
            <img src={partner3logo} alt="" />
          </a>
          <a href={'https://twitter.com/Balancer'} target="_blank" rel="noreferrer">
            <img src={partner4logo} alt="" />
          </a>
        </div>
      </div>
      <div className={styles.footerLinks}>
        <a href={twitterHref} className={styles.icon_href} target="_blank" rel="noreferrer">
          <img src={twitterSvg} alt="twitter" />
        </a>
        <a href={discordHref} className={styles.icon_href} target="_blank" rel="noreferrer" style={{ display: 'none' }}>
          <img src={inviteSvg} alt="invite" />
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
