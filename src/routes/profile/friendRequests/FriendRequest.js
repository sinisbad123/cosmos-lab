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
import s from '../Profile.css';

class FriendRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requesterData: null,
    };
  }

  componentDidMount() {
    if (this.props.data) {
      const request = this.props.data;
      const requesterId = request.user_id;
      const url = `http://52.198.83.248/user/${requesterId}`;
      const token = localStorage.getItem('user_token');
      const currentState = this.state;

      if (!token) {
        window.location.href = '/login?action=login';
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      return axios
        .get(url, config)
        .then(response => {
          const userData = response.data;
          currentState.requesterData = userData;
          this.setState(currentState);
        })
        .catch(err => {
          console.log(err);
        });
    }

    return null;
  }

  onAcceptRequest() {
    if (this.props.onAccept && this.props.data) {
      const request = this.props.data;
      const requestId = request.id;
      this.props.onAccept(requestId);
    }
  }
  onDeclineRequest() {
    if (this.props.onDecline && this.props.data) {
      const request = this.props.data;
      const requestId = request.id;
      this.props.onDecline(requestId);
    }
  }

  renderRequest() {
    const requesterData = this.state.requesterData;
    if (requesterData) {
      return (
        <Row>
          <Col sm={12}>
            <Row>
              <Col sm={6}>
                <p
                  className={s.userRequesting}
                >{`${requesterData.first_name} ${requesterData.last_name}`}</p>
              </Col>

              <Col sm={6}>
                <button
                  className={s.acceptButton}
                  onClick={this.onAcceptRequest.bind(this)}
                >
                  Accept
                </button>
                <button
                  className={s.declineButton}
                  onClick={this.onAcceptRequest.bind(this)}
                >
                  Decline
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }

    return null;
  }

  render() {
    return (
      <Row>
        <Col sm={12}>
          {this.renderRequest()}
        </Col>
      </Row>
    );
  }
}

export default withStyles(s)(FriendRequest);
