import React from 'react';
import { Row, Col } from 'react-bootstrap';
import format from 'date-fns/format';
import isWithinRange from 'date-fns/is_within_range';
import isBefore from 'date-fns/is_before';
import isAfter from 'date-fns/is_after';
import differenceInDays from 'date-fns/difference_in_days';
import axios from 'axios';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './CampaignCard.css';
import avatar from './img/avatar.png';

class CampaignCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentBoxContent: '',
      inSubmitMode: false,
      userData: null,
    };
  }

  componentDidMount() {
    if (this.props.data) {
      const campaign = this.props.data;
      const campaignId = campaign.id;
      const commentsUrl = `http://52.198.83.248/campaign/${campaignId}/comments?include='user'`;
      const userUrl = `http://52.198.83.248/user/me`;
      const token = localStorage.getItem('user_token');

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
        .get(commentsUrl, config)
        .then(response => {
          const comments = response.data;
          const currentState = this.state;
          currentState.comments = comments;
          this.setState(currentState);
        })
        .catch(err => {
          if (err.response && err.response.status === 401) {
            window.location.href = '/login?action=expire';
          }
        });

      axios
        .get(userUrl, config)
        .then(response => {
          const userData = response.data;
          const currentState = this.state;
          currentState.userData = userData;
          this.setState(currentState);
        })
        .catch(err => {
          if (err.response && err.response.status === 401) {
            window.location.href = '/login?action=expire';
          }
        });
    }

    return null;
  }

  numberWithCommas(x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  onCommentChange(e) {
    const commentString = e.target.value;
    const currentState = this.state;
    currentState.commentBoxContent = commentString;
    this.setState(currentState);
  }

  onComment() {
    if (this.state.commentBoxContent !== '') {
      const token = localStorage.getItem('user_token');
      const commentString = this.state.commentBoxContent;
      const campaign = this.props.data;
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
          this.refs.commentBox.value = '';

          const comment = response.data;
          comment.user = this.state.userData;
          currentState.comments.push(comment);
          currentState.commentBoxContent = '';
          currentState.inSubmitMode = false;
          this.setState(currentState);
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

  renderCampaignDateStatus(campaign) {
    if (campaign) {
      let daysLeftForCampaignEnd = null;
      let daysLeftForCampaignStart = null;
      let startDate = null;
      let expireDate = null;
      let daysRemainingString = '';
      const dateNow = format(new Date(), 'MM-DD-YYYY');

      startDate = format(campaign.starts_at, 'MM-DD-YYYY');
      expireDate = format(campaign.expires_at, 'MM-DD-YYYY');
      daysLeftForCampaignEnd = differenceInDays(expireDate, dateNow);

      if (isWithinRange(dateNow, startDate, expireDate)) {
        daysRemainingString = `${daysLeftForCampaignEnd} days left`;
      }
      if (isBefore(dateNow, startDate)) {
        daysLeftForCampaignStart = differenceInDays(startDate, dateNow);
        daysRemainingString = `Starts in ${daysLeftForCampaignStart} days`;
      }

      if (isAfter(dateNow, expireDate)) {
        daysRemainingString = 'Campaign ended';
      }

      return daysRemainingString;
    }

    return null;
  }

  renderComments() {
    if (this.state.comments.length > 0) {
      const comments = this.state.comments;

      return comments.map(comment => {
        const user = comment.user;

        return (
          <Row key={comment.id} className={s.commentsContainer}>
            <Col sm={12}>
              <Row>
                <Col sm={1}>
                  <img className={s.commentAvatar} alt="avatar" src={avatar} />
                </Col>

                <Col sm={11}>
                  <p>
                    <a
                      className={s.commentUser}
                      href={`/profile/${user.id}`}
                    >{`${user.first_name} ${user.last_name}`}</a>
                  </p>
                  <p className={s.commentText}>
                    {comment.message}
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>
        );
      });
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

  render() {
    const campaign = this.props.data;
    const campaigner = campaign.campaigner ? campaign.campaigner : null;
    const campaignerName = campaigner
      ? `${campaigner.first_name} ${campaigner.last_name}`
      : null;
    const campaignProgressAmount = this.numberWithCommas(campaign.funds_raised);
    const campaignTargetAmount = this.numberWithCommas(campaign.amount);
    const campaignDateStatusString = this.renderCampaignDateStatus(campaign);
    let campaignProgress = 0;
    if (campaign.funds_raised >= campaign.amount) {
      campaignProgress = 100;
    } else {
      campaignProgress = parseInt(
        campaign.funds_raised / campaign.amount * 100,
      );
    }
    return (
      <Row className={s.campaignCard}>
        <Col sm={12}>
          <Row>
            <Col sm={2}>
              <p className="text-right">
                <img className={s.cardAvatar} alt="avatar" src={avatar} />
              </p>
            </Col>

            <Col sm={10}>
              <Row>
                <Col sm={6}>
                  <p className={s.activityDescription}>
                    <a
                      className={s.activityLink}
                      href={`/profile/${campaign.campaigner_id}`}
                    >
                      {campaignerName}
                    </a>{' '}
                    created
                  </p>
                </Col>

                <Col sm={6}>
                  <p className={`${s.activityDuration} text-right`}>
                    {campaignDateStatusString}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <a
                    className={s.campaignName}
                    href={`/campaign/${campaign.id}`}
                  >
                    {campaign.title}
                  </a>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <progress max="100" value={campaignProgress} />
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <p className={s.campaignFunds}>
                    P {campaignProgressAmount} of P {`${campaignTargetAmount} `}collected
                  </p>
                </Col>
              </Row>

              {/* <Row className={s.cardActionsContainer}>
                <Col sm={6}>
                  <p className={s.campaignLikers}>
                    <i className={`${s.likedCampaign} fa fa-heart`} /> 12 Likes
                  </p>
                </Col>

                <Col sm={4} smOffset={2}>
                  <a className={s.cardActionLink} href="#">
                    <i className="fa fa-heart-o" /> Like
                  </a>

                  <a className={s.cardActionLink} href="#">
                    <i className="fa fa-comment" /> Comment
                  </a>

                  <a className={s.cardActionLink} href="#">
                    <i className="fa fa-share-alt" /> Share
                  </a>
                </Col>
              </Row> */}
            </Col>
          </Row>

          <hr />

          {this.renderComments()}

          <Row className={s.commentBoxContainer}>
            <Col sm={1}>
              <img className={s.commentAvatar} alt="avatar" src={avatar} />
            </Col>

            <Col sm={11}>
              <textarea
                ref="commentBox"
                type="text"
                className={s.commentBox}
                onChange={this.onCommentChange.bind(this)}
                placeholder="Write a comment.."
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
    );
  }
}

export default withStyles(s)(CampaignCard);
