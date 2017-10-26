/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import axios from 'axios';
import format from 'date-fns/format';
import isWithinRange from 'date-fns/is_within_range';
import isAfter from 'date-fns/is_after'
import differenceInDays from 'date-fns/difference_in_days';
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Campaign.css';

import Header from '../../components/Header';
import Comment from './Comment';
import campaignBanner from './img/desk.jpeg';
import avatar from './img/avatar.png';
import loadingIcon from './img/loading.gif';

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      campaignData: null,
      campaignerData: null,
      userData: null,
      commentsData: [],
      inFundMode: false,
      commentBoxContent: '',
      inSubmitMode: false,

      funderAmount: 0,
      inFundSubmitMode: false,
      onUserFunded: false,
    };
  }

  componentDidMount() {
    const id = this.props.data.params.id;
    const url = `http://52.198.83.248/campaign/${id}`;

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return axios
      .get(url, config)
      .then(response => {
        const campaignData = response.data;
        console.log(campaignData);
        return campaignData;
      })
      .then(campaignData => {
        const campaignId = campaignData.id;
        const campaignerId = campaignData.campaigner_id;
        const commentUrl = `http://52.198.83.248/campaign/${campaignId}/comments?include='user'`;
        const campaignerUrl = `http://52.198.83.248/user/${campaignerId}`;
        const userUrl = `http://52.198.83.248/user/me`;
        const token = localStorage.getItem('user_token');

        if (!token) {
          window.location.href = '/login?action=login';
        }

        const authConfig = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        axios
          .get(commentUrl, authConfig)
          .then(response => {
            const campaignComments = response.data;
            const currentState = this.state;
            currentState.campaignData = campaignData;
            currentState.commentsData = campaignComments;
            this.setState(currentState);
          })
          .catch(err => {
            if (err.response.status === 401) {
              window.location.href = '/login?action=expire';
            }
          });

        axios
          .get(campaignerUrl, authConfig)
          .then(response => {
            const currentState = this.state;
            currentState.campaignerData = response.data;
            this.setState(currentState);
          })
          .catch(err => {
            if (err.response.status === 401) {
              window.location.href = '/login?action=expire';
            }
          });

        axios
          .get(userUrl, authConfig)
          .then(response => {
            const currentState = this.state;
            currentState.userData = response.data;
            this.setState(currentState);
          })
          .catch(err => {
            if (err.response.status === 401) {
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

  onComment() {
    if (this.state.commentBoxContent !== '') {
      const token = localStorage.getItem('user_token');
      const commentString = this.state.commentBoxContent;
      const campaign = this.state.campaignData;
      const campaignId = campaign.id;

      if (!token) {
        window.location.href = '/login?action=login';
      }

      const url = `http://52.198.83.248/campaign/${campaignId}/comments`;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const currentState = this.state;
      currentState.inSubmitMode = true;
      this.setState(currentState);

      const data = {
        message: commentString,
      };

      return axios
        .post(url, data, config)
        .then(response => {
          const comment = response.data;
          comment.user = this.state.userData;
          currentState.commentsData.push(comment);
          currentState.commentBoxContent = '';
          currentState.inSubmitMode = false;
          this.setState(currentState);

          this.refs.commentBox.value = '';
        })
        .catch(err => {
          currentState.inSubmitMode = false;
          this.setState(currentState);

          if (err.response.status === 401) {
            window.location.href = '/login?action=expire';
          }
        });
    }

    return null;
  }

  onCommentChange(e) {
    const commentString = e.target.value;
    const currentState = this.state;
    currentState.commentBoxContent = commentString;
    this.setState(currentState);
  }

  onFundChange(e) {
    const fundingAmount = e.target.value;
    const currentState = this.state;
    currentState.funderAmount = Number(fundingAmount);
    this.setState(currentState);
  }

  onToggleFundMode() {
    const currentState = this.state;
    currentState.inFundMode = true;
    this.setState(currentState);
  }

  onExitFundMode() {
    const currentState = this.state;
    currentState.inFundMode = false;
    this.setState(currentState);
  }

  onFundSubmit() {
    if (this.state.campaignData && this.state.funderAmount) {
      const campaignData = this.state.campaignData;
      const campaignId = campaignData.id;
      const currentState = this.state;
      const userData = this.state.userData;
      const url = `http://52.198.83.248/campaign/${campaignId}/fund`;
      const token = localStorage.getItem('user_token');

      if (!token) {
        window.location.href = '/login?action=login';
      }

      const data = {
        amount: this.state.funderAmount,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      currentState.inFundSubmitMode = true;
      this.setState(currentState);

      return axios
        .post(url, data, config)
        .then(() => {
          currentState.inFundMode = false;
          userData.balance -= this.state.funderAmount;
          campaignData.funds_raised += this.state.funderAmount;
          currentState.userData = userData;
          currentState.inFundSubmitMode = false;
          currentState.onUserFunded = true;
          this.setState(currentState);
        })
        .catch(err => {
          currentState.inFundSubmitMode = false;
          this.setState(currentState);

          if (err.response.status === 401) {
            window.location.href = '/login?action=expire';
          }

          console.log(err);
        });
    }

    return null;
  }

  numberWithCommas(x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  renderFundingSection(inFundMode) {
    if (inFundMode && this.state.userData) {
      const userData = this.state.userData;
      const balance = this.numberWithCommas(userData.balance);
      const fundButtonString = this.state.inFundSubmitMode
        ? 'Funding...'
        : 'Fund';
      return (
        <div>
          <p className={s.balanceLabel}>
            You currently have: <b className={s.balanceValue}>P {balance}</b>
          </p>
          <p className={s.inputLabel}>Amount</p>
          <input
            onChange={this.onFundChange.bind(this)}
            className={s.fundInput}
            placeholder="Amount"
          />

          <button
            onClick={this.onFundSubmit.bind(this)}
            className={s.fundButton}
            disabled={this.state.inFundSubmitMode}
          >
            {fundButtonString}
          </button>

          <button
            onClick={this.onExitFundMode.bind(this)}
            disabled={this.state.inFundSubmitMode}
            className={s.cancelButton}
          >
            Cancel
          </button>
        </div>
      );
    }
    const campaignData = this.state.campaignData;
    const userData = this.state.userData;
    let amount = null;
    let fundsRaised = null;
    let campaignProgress = 0;
    let daysLeftForCampaignEnd = null;
    let daysLeftForCampaignStart = null;
    let startDate = null;
    let expireDate = null;
    let daysRemainingString = '';
    const dateNow = format(new Date(), 'MM-DD-YYYY');

    let fundButton = null;

    if (campaignData) {
      amount = this.numberWithCommas(
        parseFloat(campaignData.amount).toFixed(2),
      );
      fundsRaised = this.numberWithCommas(
        parseFloat(campaignData.funds_raised).toFixed(2),
      );
      startDate = format(campaignData.starts_at, 'MM-DD-YYYY');
      expireDate = format(campaignData.expires_at, 'MM-DD-YYYY');
      daysLeftForCampaignEnd = differenceInDays(expireDate, dateNow);

      if (campaignData.funds_raised >= campaignData.amount) {
        campaignProgress = 100;
      } else {
        campaignProgress = parseInt(
          campaignData.funds_raised / campaignData.amount * 100,
        );
      }

      if (isWithinRange(dateNow, startDate, expireDate)) {
        daysRemainingString = `${daysLeftForCampaignEnd} days left`;

        if (userData) {
          if (campaignData.campaigner_id !== userData.id) {
            fundButton = (
              <p className="text-center">
                <button
                  onClick={this.onToggleFundMode.bind(this)}
                  className={s.fundButton}
                >
                  Make this happen
                </button>
              </p>
            );
          }
        }
      } else {
        daysLeftForCampaignStart = differenceInDays(startDate, dateNow);
        daysRemainingString = `Starts in ${daysLeftForCampaignStart} days`;
      }

      if (isAfter(dateNow, expireDate)) {
        daysRemainingString = 'Campaign ended';
      }
    }

    let fundedMessage = null;
    if (this.state.onUserFunded) {
      fundedMessage = (
        <p className={s.fundedMessage}>
          You have successfully funded this campaign!
        </p>
      );
    }

    return (
      <div>
        <p className={`${s.statsSubheader} ${s.textGreen} text-center`}>
          P {amount}
        </p>
        <progress max="100" value={campaignProgress} />
        <Row>
          <Col sm={6}>
            <p className={s.statsSubheader}>
              {daysRemainingString}
            </p>
          </Col>

          <Col sm={6}>
            <p className={`${s.statsSubheader} text-right`}>
              P {fundsRaised} collected
            </p>
          </Col>
        </Row>

        {fundedMessage}

        {fundButton}
      </div>
    );
  }

  renderComments(comments) {
    if (comments.length > 0) {
      return comments.map(comment =>
        <Comment key={comment.id} data={comment} />,
      );
    }

    return null;
  }

  renderCommentButton() {
    const inSubmitMode = this.state.inSubmitMode;
    const commentButtonString = inSubmitMode ? 'Commenting...' : 'Comment';
    return (
      <button
        className={`${s.commentButton} pull-right`}
        onClick={this.onComment.bind(this)}
      >
        {commentButtonString}
      </button>
    );
  }

  renderCampaignContent() {
    const campaignData = this.state.campaignData;
    const campaignerData = this.state.campaignerData;
    const campaignerId = campaignerData ? campaignerData.id : null;
    const campaignerName = campaignerData
      ? `${campaignerData.first_name} ${campaignerData.last_name}`
      : null;
    let title = null;
    let description = null;

    // Render Funding Section
    const inFundMode = this.state.inFundMode;
    const fundingSection = this.renderFundingSection(inFundMode);

    if (campaignData) {
      title = campaignData.title;
      description = campaignData.description;
      const comments =
        this.state.commentsData.length > 0 ? this.state.commentsData : [];
      const renderedComments = this.renderComments(comments);

      return (
        <div>
          <Row>
            <Col sm={12}>
              <img
                alt="banner"
                className={s.campaignBanner}
                src={campaignBanner}
              />
              <div className={s.basicInfoContainer}>
                <Row>
                  <Col sm={3} smOffset={1}>
                    <h3 className={s.basicInfoText}>
                      {title}
                    </h3>
                    <p className={s.basicInfoText}>
                      by:{' '}
                      <a
                        className={s.basicInfoLink}
                        href={`/profile/${campaignerId}`}
                      >
                        {campaignerName}
                      </a>
                    </p>
                  </Col>

                  {/* <Col sm={2} smOffset={5}>
                    <Row>
                      <Col sm={6}>
                        <a className={`${s.basicInfoLink}`} href="#">
                          <h4 className={s.basicInfoMargin}>
                            <i className="fa fa-heart-o" /> Like
                          </h4>
                        </a>
                      </Col>

                      <Col sm={6}>
                        <a className={`${s.basicInfoLink}`} href="#">
                          <h4 className={s.basicInfoMargin}>
                            <i className="fa fa-share-alt" /> Share
                          </h4>
                        </a>
                      </Col>
                    </Row>
                  </Col> */}
                </Row>
              </div>
            </Col>
          </Row>

          <Row className={s.descriptionContainer}>
            <Col sm={10} smOffset={1}>
              <h4 className={s.descriptionHeader}>About</h4>

              <p className={s.descriptionBody}>
                {description}
              </p>
            </Col>
          </Row>

          <Row className={s.statsActionsContainer}>
            <Col sm={4} smOffset={1}>
              <hr className={s.hrMargin} />
              <p className={s.statsSubheader}>170 Explorers Invested</p>
              <hr />
              <p className={s.statsSubheader}>357 Liked this Campaign</p>
              <hr />
            </Col>

            <Col sm={4} smOffset={1}>
              {fundingSection}
            </Col>
          </Row>

          <Row className={s.commentContainer}>
            <Col sm={10} smOffset={1}>
              <Row className={s.commentPanel}>
                <Col sm={12}>
                  <h4 className={s.commentHeader}>Comments</h4>
                  <hr />

                  {renderedComments}

                  <Row className={s.commentBoxContainer}>
                    <Col sm={1}>
                      <img
                        className={s.commentAvatar}
                        alt="avatar"
                        src={avatar}
                      />
                    </Col>

                    <Col sm={11}>
                      <textarea
                        ref="commentBox"
                        type="text"
                        className={s.commentBox}
                        placeholder="Write a comment.."
                        onChange={this.onCommentChange.bind(this)}
                      />
                    </Col>
                  </Row>

                  <Row className={s.commentButtonContainer}>
                    <Col sm={3} smOffset={9}>
                      {this.renderCommentButton()}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <Row className={s.loadingMessageContainer}>
        <Col sm={1} smOffset={4}>
          <img className={s.loadingIcon} alt="loading" src={loadingIcon} />
        </Col>

        <Col sm={3}>
          <h2 className={s.loadingMessage}>Loading Campaign...</h2>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <div className={s.container}>
        <Header />

        {this.renderCampaignContent()}
      </div>
    );
  }
}

export default withStyles(s)(Campaign);
