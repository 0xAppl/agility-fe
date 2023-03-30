import React from 'react';
import logo from '../../assets/logo_vertical.png';
import diagram from '../../assets/homepage_diagram.svg';
import { globalConfig } from '../../page/globalConfig';
import twitterSvg from '../../assets/twitter.svg';
import inviteSvg from '../../assets/invite.svg';
import { DocsButton, LaunchAppButton } from '../../components/Btns';
import styles from './index.module.less';
const { twitterHref, inviteHref } = globalConfig;

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
        <div className="title">The world&apos;s first LSD Liquidity Layer.</div>
        <div className="subtitle">
          Our vision is to unlock liquidity for LSD holders and explore more LSD trading scenarios, as well as provide
          deep liquidity for other LSD-relative protocols.
        </div>
        <div className="diagram">
          <img src={diagram} alt="" />
        </div>
        <div>
          <LaunchAppButton />
        </div>
      </div>
      <div className={styles.footerLinks}>
        <a href={inviteHref} className={styles.icon_href} target="_blank" rel="noreferrer">
          <img src={twitterSvg} alt="twitter" />
        </a>
        <a href={twitterHref} className={styles.icon_href} target="_blank" rel="noreferrer">
          <img src={inviteSvg} alt="invite" />
        </a>
      </div>
    </div>
  );
};

export default LandingPage;
