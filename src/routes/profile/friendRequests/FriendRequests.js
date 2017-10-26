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
import * as _ from 'lodash';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Profile.css';

import FriendRequest from './FriendRequest';
import avatar from './img/avatar.png';
import loadingIcon from './img/loading.gif';

class FriendRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requesterData: null,
      requests: [],
    };
  }

  componentWillMount() {
    const currentState = this.state;
    currentState.requests = this.props.data;
    this.setState(currentState);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      const currentState = this.state;
      currentState.requests = nextProps.data;

      this.setState(currentState);
    }
  }

  onAcceptRequest(id) {
    if (!isNaN(id)) {
      const url = `http://52.198.83.248/friend-request/${id}/accept`;
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
        .put(url, {}, config)
        .then(() => {
          _.remove(currentState.requests, { id });
          this.setState(currentState);
        })
        .catch(err => {
          console.log(err);
        });
    }

    return null;
  }

  onDeclineRequest(id) {
    if (!isNaN(id)) {
      const url = `http://52.198.83.248/friend-request/${id}/decline`;
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
        .put(url, {}, config)
        .then(() => {
          _.remove(currentState.requests, { id });
          this.setState(currentState);
        })
        .catch(err => {
          console.log(err);
        });
    }

    return null;
  }

  renderFriendRequests() {
    const requests = this.state.requests;
    if (requests && requests.length > 0) {
      return requests.map(request => {
        if (!request.accepted_at && !request.declined_at) {
          return (
            <FriendRequest
              key={request.id}
              data={request}
              onAccept={this.onAcceptRequest.bind(this)}
              onDecline={this.onDeclineRequest.bind(this)}
            />
          );
        }
        return null;
      });
    }

    if (requests && requests.length === 0) {
      if (this.props.isLoading) {
        return null;
      }

      return <p className={s.friendRequestMessage}>No requests found</p>;
    }
    return null;
  }

  render() {
    return (
      <Row className={s.friendRequestsContainer}>
        <Col sm={12}>
          <p className={s.friendRequestsHeader}>Friend requests</p>

          <Row>
            <Col sm={12}>
              {this.renderFriendRequests()}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default withStyles(s)(FriendRequests);
