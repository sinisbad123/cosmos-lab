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
import s from './Profile.css';

import Header from '../../components/Header';
import CampaignCard from '../../components/CampaignCard';
import FriendRequests from './friendRequests/FriendRequests';
import avatar from './img/avatar.png';
import loadingIcon from './img/loading.gif';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      isSelf: false,
      isLoading: false,
      inSubmitMode: false,
      friendRequest: null,
      friendRequests: [],

      userCampaigns: [],
      friends: [],
    };
  }

  componentWillMount() {
    const currentState = this.state;
    currentState.isLoading = true;
    this.setState(currentState);
  }

  componentDidMount() {
    const id = this.props.data.params.id;

    if (id === 'me') {
      const userUrl = `http://52.198.83.248/user/me`;
      const friendRequestsUrl = `http://52.198.83.248/user/me/friend-requests`;
      const friendsUrl = `http://52.198.83.248/user/me/friends`;
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

      axios
        .get(userUrl, config)
        .then(response => {
          const userData = response.data;
          currentState.userData = userData;
          currentState.isSelf = true;
          this.setState(currentState);

          return token;
        })
        .then(() => {
          const campaignsUrl = `http://52.198.83.248/user/me/campaigns`;
          return axios
            .get(campaignsUrl, config)
            .then(response => {
              const userCampaigns = response.data;
              currentState.userCampaigns = userCampaigns;
              currentState.isLoading = false;
              this.setState(currentState);
            })
            .catch(err => {
              currentState.isLoading = false;
              this.setState(currentState);

              if (err.response && err.response.status === 401) {
                window.location.href = '/login?action=expire';
              }
            });
        })
        .catch(err => {
          currentState.isLoading = false;
          this.setState(currentState);

          if (err.response && err.response.status === 401) {
            window.location.href = '/login?action=expire';
          }
        });

      axios
        .get(friendRequestsUrl, config)
        .then(response => {
          const friendRequests = response.data;
          currentState.friendRequests = friendRequests;
          this.setState(currentState);
        })
        .catch(err => {
          console.log(err);
        });

      axios
        .get(friendsUrl, config)
        .then(response => {
          const friends = response.data;
          currentState.friends = friends;
          this.setState(currentState);
        })
        .catch(err => {
          console.log(err);
        });

      return;
    }

    if (!isNaN(id)) {
      const userUrl = `http://52.198.83.248/user/${id}`;
      const token = localStorage.getItem('user_token');
      const currentState = this.state;

      if (!token) {
        window.location.href = '/login';
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const requestUrl = `http://52.198.83.248/user/${id}/friend-request`;

      axios
        .get(requestUrl, config)
        .then(response => {
          const friendRequest = response.data;
          currentState.friendRequest = friendRequest;
          this.setState(currentState);
        })
        .catch(err => {
          if (err.response && err.response.status === 401) {
            window.location.href = '/login?action=expire';
          }
        });

      axios
        .get(userUrl, config)
        .then(userResponse => {
          const userData = userResponse.data;
          currentState.userData = userData;
          currentState.isSelf = false;
          this.setState(currentState);
        })
        .then(() => {
          const campaignsUrl = `http://52.198.83.248/user/${id}/campaigns`;
          const otherUserConfig = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          return axios
            .get(campaignsUrl, otherUserConfig)
            .then(campaignsResponse => {
              const userCampaigns = campaignsResponse.data;
              currentState.isLoading = false;
              currentState.userCampaigns = userCampaigns;
              this.setState(currentState);
            })
            .catch(err => {
              currentState.isLoading = false;
              this.setState(currentState);

              if (err.response && err.response.status === 401) {
                window.location.href = '/login?action=expire';
              }
            });
        })
        .catch(err => {
          if (err.response && err.response.status === 401) {
            window.location.href = '/login?action=expire';
          }
        });
    }

    return null;
  }

  onCreateFriendRequest(e) {
    e.preventDefault();
    const id = this.props.data.params.id;
    const friendRequest = this.state.friendRequest;

    if (id && id !== 'me' && !friendRequest) {
      const url = `http://52.198.83.248/user/${id}/friend-request`;
      const token = localStorage.getItem('user_token');
      const currentState = this.state;
      console.log(token);

      if (!token) {
        window.location.href = '/login?action=login';
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      currentState.inSubmitMode = true;
      this.setState(currentState);

      return axios
        .put(url, {}, config)
        .then(response => {
          const friendRequest = response.data;
          currentState.inSubmitMode = false;
          currentState.friendRequest = friendRequest;
          this.setState(currentState);
        })
        .catch(err => {
          currentState.inSubmitMode = false;
          this.setState(currentState);

          // if (err.response.status === 401) {
          //   window.location.href = '/login?action=expire';
          // }

          if (err.response && err.response.data && err.response.data.errors) {
            console.log(err.response.data.errors[0].message);
          }
        });
    }

    return null;
  }

  renderCampaigns() {
    if (this.state.userCampaigns.length > 0) {
      const userCampaigns = this.state.userCampaigns;
      const id = this.props.data.params.id;

      return userCampaigns.map(campaign => {
        if (campaign) {
          campaign.campaigner_id = id === 'me' ? 'me' : campaign.campaigner_id;
          campaign.campaigner = this.state.userData;
          return <CampaignCard key={campaign.id} data={campaign} />;
        }
        return null;
      });
    }

    if (this.state.isLoading) {
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

    return (
      <Row className={s.loadingMessageContainer}>
        <Col sm={12}>
          <h2 className={`${s.loadingMessage} text-center`}>
            There are no campaigns available
          </h2>
        </Col>
      </Row>
    );
  }

  renderActionAndStatsContainer() {
    const id = this.props.data.params.id;
    const friendRequest = this.state.friendRequest;
    console.log(friendRequest);
    const userCampaigns = this.state.userCampaigns;
    const friends = this.state.friends;
    const quantityUserCampaigns = userCampaigns.length;
    const quantityFriends = friends.length;
    let followContainer = null;
    let followString = this.state.inSubmitMode ? 'Processing...' : 'Follow';
    let disabled = false;

    if (friendRequest) {
      disabled = true;
      if (friendRequest.accepted_at) {
        followString = 'Following';
      } else {
        followString = 'Pending';
      }
    }

    if (!(id === 'me') && this.state.isLoading !== true) {
      followContainer = (
        <Col sm={3}>
          <Row className={s.actionContainer}>
            <Col sm={4} smOffset={2}>
              <p className="text-center">
                <a
                  className={s.actionLink}
                  href="#"
                  disabled={disabled}
                  onClick={this.onCreateFriendRequest.bind(this)}
                >
                  <i className="fa fa-address-book-o" /> {followString}
                </a>
              </p>
            </Col>

            {/* <Col sm={4}>
              <p className="text-center"><a className={s.actionLink} href="#"><p><i className="fa fa-address-book-o"></i> Follow</p></a></p>
            </Col> */}
          </Row>
        </Col>
      );
    }
    return (
      <Row className={s.actionsAndStatsContainer}>
        <Col sm={6} smOffset={3}>
          <Row className={s.statContainer}>
            <Col className={s.firstStatContainer} sm={4}>
              <p className={`${s.statValue} text-center`}>
                {quantityUserCampaigns}
              </p>
              <p className={`${s.statCaption} text-center`}>
                Campaigns Created
              </p>
            </Col>

            <Col className={s.secondStatContainer} sm={4}>
              <p className={`${s.statValue} text-center`}>15</p>
              <p className={`${s.statCaption} text-center`}>
                Invested Campaigns
              </p>
            </Col>

            <Col className={s.thirdStatContainer} sm={4}>
              <p className={`${s.statValue} text-center`}>
                {quantityFriends}
              </p>
              <p className={`${s.statCaption} text-center`}>Connections</p>
            </Col>
          </Row>
        </Col>

        {followContainer}
      </Row>
    );
  }

  renderBody() {
    const id = this.props.data.params.id;

    if (id === 'me') {
      return (
        <Row>
          <Col sm={3} smOffset={1}>
            <FriendRequests
              data={this.state.friendRequests}
              isLoading={this.state.isLoading}
            />
          </Col>
          <Col sm={7}>
            {this.renderCampaigns()}
          </Col>
        </Row>
      );
    }

    if (id !== 'me') {
      return (
        <Row>
          <Col sm={10} smOffset={1}>
            {this.renderCampaigns()}
          </Col>
        </Row>
      );
    }

    return null;
  }

  render() {
    const user = this.state.userData;

    const firstName = user && user.first_name ? user.first_name : '';
    const lastName = user && user.last_name ? user.last_name : '';
    return (
      <div className={s.container}>
        <Header />

        <Row className={s.cover}>
          <Col sm={12}>
            <Row className={s.userInfoContainer}>
              <Col sm={6} smOffset={3}>
                <p className="text-center">
                  <img className={s.avatar} alt="avatar" src={avatar} />
                </p>
                <p
                  className={`${s.name} text-center`}
                >{`${firstName} ${lastName}`}</p>
              </Col>
            </Row>

            {this.renderActionAndStatsContainer()}
          </Col>
        </Row>

        {this.renderBody()}
      </div>
    );
  }
}

export default withStyles(s)(Profile);
