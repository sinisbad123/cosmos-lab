/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';
import Header from './Header';

class Home extends React.Component {
  render() {
    return (
      <div>
        <div className={s.upperContainer}>
          <Header />

          <section className={s.introductionSection}>
            <Row>
              <Col sm={12}>
                <h3 className={s.lightText}>A community built on</h3>

                <h1 className={s.headerText}>COLLABORATION</h1>

                <button className={`${s.startButton} center-block`}>
                  START A CAMPAIGN
                </button>
              </Col>
            </Row>
          </section>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);
