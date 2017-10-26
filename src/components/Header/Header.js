import React from 'react';
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Header.css';

import logoUrl from './img/logo.png';
import logoExploreFocus from './img/navExplore-active.png';
import logoProfileFocus from './img/navPersonal-active.png';
import logoWalletFocus from './img/navWallet-active.png';

import logoExplore from './img/navExplore.png';
import logoProfile from './img/navPersonal.png';
import logoWallet from './img/navWallet.jpg';
import logoAddCampaign from './img/add-circle.png';

class Header extends React.Component {
  render() {
    return (
      <nav className={s.container}>
        <Row>
          <Col sm={2}>
            <a href="/feed">
              <img className={s.logo} src={logoUrl} alt="logo" />
            </a>
          </Col>
          <Col sm={3}>
            <ul>
              <li className={s.navItem}>
                <a className={s.navLink} href="/campaign/create">
                  <i className="fa fa-plus" /> Create Campaign
                </a>
              </li>
              <li className={s.navItem}>
                <a className={s.navLink} href="/issues">
                  <i className="fa fa-bullhorn" /> Issues
                </a>
              </li>
            </ul>
          </Col>

          <Col sm={4} smOffset={3}>
            <ul>
              <li className={s.navItem}>
                <a className={s.navLink} href="/profile/me">
                  <i className="fa fa-user" /> Profile
                </a>
              </li>
              <li className={s.navItem}>
                <a className={s.navLink} href="/wallet">
                  <img
                    alt="wallet"
                    className={s.navLogo}
                    src={logoWalletFocus}
                  />Wallet
                </a>
              </li>

              <li className={s.navItem}>
                <a className={s.navLink} href="/login?action=login">
                  <i className="fa fa-sign-out" /> Log-out
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </nav>
    );
  }
}

export default withStyles(s)(Header);
