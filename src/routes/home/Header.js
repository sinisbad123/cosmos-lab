import React from 'react';
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import logoUrl from './img/logo.png';

class Header extends React.Component {
  render() {
    return (
      <nav>
        <Row>
          <Col sm={6}>
            <a href="/login">
              <img className={s.logo} src={logoUrl} alt="CosmosLab" />
            </a>
          </Col>

          <Col sm={6}>
            <ul>
              <li className={s.navItem}>
                <a className={s.navLink} href="#">
                  Home
                </a>
              </li>
              <li className={s.navItem}>
                <a className={s.navLink} href="#">
                  About
                </a>
              </li>
              <li className={s.navItem}>
                <a className={s.navLink} href="#">
                  Features
                </a>
              </li>
              <li className={s.navItem}>
                <a className={s.navLink} href="#">
                  How It Works
                </a>
              </li>
              <li className={s.navItem}>
                <a className={s.signUpLink} href="#">
                  Sign Up
                </a>
              </li>
              <li className={s.navItem}>
                <a className={s.navLink} href="/login">
                  Log In
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
