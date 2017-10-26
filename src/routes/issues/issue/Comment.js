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
import s from './Issue.css';
import avatar from './img/avatar.png';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subcomments: [],
      inCommentMode: false,
      commentBoxContent: '',
      inSubmitMode: false,
      userData: null,
    };
  }

  componentDidMount() {
    const comment = this.props.data;
    const commentId = comment.id;
    const commentsUrl = `http://52.198.83.248/comment/${commentId}/comments?include='user'`;
    const userUrl = `http://52.198.83.248/user/me`;
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
      .get(commentsUrl, config)
      .then(response => {
        const comments = response.data;
        console.log(comments);
        currentState.subcomments = comments;
        this.setState(currentState);
      })
      .catch(err => {
        if (!err.response) {
          console.log(err);
          return;
        }

        if (err.response.status === 401) {
          window.location.href = '/login?action=expire';
        }
      });

    axios
      .get(userUrl, config)
      .then(response => {
        const userData = response.data;
        currentState.userData = userData;
        this.setState(currentState);
      })
      .catch(err => {
        if (!err.response) {
          console.log(err);
          return;
        }

        if (err.response.status === 401) {
          window.location.href = '/login?action=expire';
        }
      });
  }

  onComment() {
    if (this.state.commentBoxContent !== '') {
      const token = localStorage.getItem('user_token');
      const commentString = this.state.commentBoxContent;
      const comment = this.props.data;
      const commentId = comment.id;

      if (!token) {
        window.location.href = '/login?action=login';
      }

      const url = `http://52.198.83.248/comment/${commentId}/comments?include='user'`;

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
          const subcomment = response.data;
          subcomment.user = this.state.userData;
          currentState.subcomments.push(subcomment);
          currentState.commentBoxContent = '';
          currentState.inSubmitMode = false;
          currentState.inCommentMode = false;
          this.setState(currentState);

          this.refs.commentBox.value = '';
        })
        .catch(err => {
          currentState.inSubmitMode = false;
          this.setState(currentState);

          if (!err.response) {
            console.log(err);
            return;
          }

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

  onCommentMode(e) {
    e.preventDefault();
    const currentState = this.state;
    currentState.inCommentMode = true;
    this.setState(currentState);
  }

  onExitCommentMode() {
    const currentState = this.state;
    currentState.inCommentMode = false;
    this.setState(currentState);
  }

  renderComment() {
    const comment = this.props.data;
    const user = comment.user;

    return (
      <Row key={comment.id} className={s.commentContainer}>
        <Col sm={11}>
          <Row>
            <Col sm={12}>
              <Row>
                <Col sm={2}>
                  <p className="text-right">
                    <img
                      className={s.commentAvatar}
                      alt="avatar"
                      src={avatar}
                    />
                  </p>
                </Col>
                <Col sm={10}>
                  <p>
                    <a href={`/profile/${user.id}`} className={s.commentUser}>
                      {`${user.first_name} ${user.last_name}`}
                    </a>
                  </p>
                  <p className={s.commentDescription}>
                    {comment.message}
                  </p>
                  <a
                    className={s.replyLink}
                    href="#"
                    onClick={this.onCommentMode.bind(this)}
                  >
                    Reply
                  </a>

                  {this.renderSubcomments()}

                  {this.renderCommentBox()}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  renderSubcomments() {
    const comments = this.state.subcomments;

    if (comments.length > 0) {
      return comments.map(comment => {
        const user = comment.user;

        return (
          <Row key={comment.id} className={s.replyContainer}>
            <Col sm={11}>
              <Row>
                <Col sm={12}>
                  <Row>
                    <Col sm={2}>
                      <p className="text-right">
                        <img
                          className={s.commentAvatar}
                          alt="avatar"
                          src={avatar}
                        />
                      </p>
                    </Col>
                    <Col sm={10}>
                      <p>
                        <a
                          href={`/profile/${user.id}`}
                          className={s.commentUser}
                        >
                          {`${user.first_name} ${user.last_name}`}
                        </a>
                      </p>
                      <p className={s.replyContent}>
                        {comment.message}
                      </p>
                      <a
                        className={s.replyLink}
                        href="#"
                        onClick={this.onCommentMode.bind(this)}
                      >
                        Reply
                      </a>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        );
      });
    }

    return null;
  }

  renderCommentBox() {
    const commentBoxButtonString = this.state.inSubmitMode
      ? 'Replying...'
      : 'Reply';
    if (this.state.inCommentMode) {
      return (
        <Row className={s.replyBoxContainer}>
          <Col sm={12}>
            <Row>
              <Col sm={12}>
                <textarea
                  onChange={this.onCommentChange.bind(this)}
                  className={s.commentBox}
                  ref="commentBox"
                />

                <Row>
                  <Col sm={2}>
                    <button
                      className={s.commentButton}
                      onClick={this.onComment.bind(this)}
                      disabled={this.state.inSubmitMode}
                    >
                      {commentBoxButtonString}
                    </button>
                  </Col>
                  <Col sm={2}>
                    <button
                      className={s.cancelButton}
                      onClick={this.onExitCommentMode.bind(this)}
                      disabled={this.state.inSubmitMode}
                    >
                      Cancel
                    </button>
                  </Col>
                </Row>
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
          <Row>
            <Col sm={12}>
              {this.renderComment()}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default withStyles(s)(Comment);
