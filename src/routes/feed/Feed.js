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
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Feed.css';

import Header from '../../components/Header';
import CampaignCard from '../../components/CampaignCard';
import avatar from './img/avatar.png';
import loadingIcon from './img/loading.gif';

class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaigns: [],
    };
  }

  componentDidMount() {
    const url = `http://52.198.83.248/campaigns`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return axios
      .get(url, config)
      .then(response => {
        const campaigns = response.data;
        console.log(campaigns);
        const currentState = this.state;
        currentState.campaigns = campaigns;
        this.setState(currentState);
      })
      .catch(err => {
        if (err.response.status === 401) {
          window.location.href = '/login?action=expire';
        }
      });
  }

  renderCampaigns() {
    if (this.state.campaigns) {
      const campaigns = this.state.campaigns;

      return campaigns.map(campaign =>
        <CampaignCard key={campaign.id} data={campaign} />,
      );
    }

    return (
      <Row className={s.loadingMessageContainer}>
        <Col sm={1} smOffset={3}>
          <img className={s.loadingIcon} alt="loading" src={loadingIcon} />
        </Col>

        <Col sm={5}>
          <h2 className={s.loadingMessage}>Loading Campaigns...</h2>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <Row className={s.container}>
        <Col sm={12}>
          <Header />

          <Row>
            <Col sm={9} smOffset={1}>
              <h1>Some of the campaigns...</h1>
            </Col>
          </Row>

          <Row>
            <Col sm={10} smOffset={1}>
              {this.renderCampaigns()}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default withStyles(s)(Feed);
