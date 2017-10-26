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
import { Row, Col } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Campaign.css';

import avatar from './img/avatar.png';

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentData: null,
      commentChildren: [],
      inCommentMode: false,
      commentBoxContent: '',
      inSubmitMode: false,
      userData: null,
    };
  }

  componentDidMount() {
    if (this.props.data) {
      const comment = this.props.data;
      const currentState = this.state;
      currentState.commentData = comment;

      const token = localStorage.getItem('user_token');
      if (!token) {
        window.location.href = '/login?action=login';
      }

      const commentUrl = `http://52.198.83.248/comment/${comment.id}/comments?include='user'`;
      const userUrl = `http://52.198.83.248/user/me`;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .get(commentUrl, config)
        .then(response => {
          const commentChildren = response.data;
          currentState.commentChildren = commentChildren;
          this.setState(currentState);
        })
        .catch(err => {
          console.log(err);
        });

      axios
        .get(userUrl, config)
        .then(response => {
          const userData = response.data;
          currentState.userData = userData;
          this.setState(currentState);
        })
        .catch(err => {
          console.log(err);
        });
    }

    return null;
  }

  onActivateCommentMode(e) {
    e.preventDefault();
    const currentState = this.state;
    currentState.inCommentMode = true;
    this.setState(currentState);
  }

  onCommentChange(e) {
    const commentString = e.target.value;
    const currentState = this.state;
    currentState.commentBoxContent = commentString;
    this.setState(currentState);
  }

  onExitCommentMode() {
    const currentState = this.state;
    currentState.inCommentMode = false;
    this.setState(currentState);
  }

  onSubmitReply() {
    if (this.state.commentBoxContent !== ''.trim()) {
      const replyString = this.state.commentBoxContent;
      const currentState = this.state;
      const commentId = this.state.commentData.id;
      const token = localStorage.getItem('user_token');

      if (!token) {
        window.location.href = '/login?action=login';
      }

      const url = `http://52.198.83.248/comment/${commentId}/comments`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const data = {
        message: replyString,
      };

      currentState.inSubmitMode = true;
      this.setState(currentState);

      return axios
        .post(url, data, config)
        .then(response => {
          this.refs.commentBox.value = '';
          const commentChild = response.data;
          console.log(commentChild, this.state.userData);
          commentChild.user = this.state.userData;
          currentState.commentChildren.push(commentChild);
          currentState.inSubmitMode = false;
          currentState.inCommentMode = false;
          this.setState(currentState);
        })
        .catch(err => {
          currentState.inSubmitMode = false;
          this.setState(currentState);

          console.log(err);

          if (err.response.status === 401) {
            window.location.href = '/login?action=expire';
          }
        });
    }

    return null;
  }

  renderCommentChildren() {
    if (this.state.commentChildren.length > 0) {
      const commentChildren = this.state.commentChildren;

      return commentChildren.map(commentChild => {
        const user = commentChild.user;

        return (
          <Row key={commentChild.id} className={s.commentMargin}>
            <Col sm={1}>
              <img className={s.commentAvatar} alt="avatar" src={avatar} />
            </Col>
            <Col sm={10}>
              <p>
                <a href={`/profile/${user.id}`} className={s.commentUser}>
                  {`${user.first_name} ${user.last_name}`}
                </a>
              </p>
              <p className={s.commentMessage}>
                {commentChild.message}
              </p>

              <Row>
                <Col sm={12}>
                  <a
                    className={s.replyLink}
                    href="#"
                    onClick={this.onActivateCommentMode.bind(this)}
                  >
                    Reply
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        );
      });
    }

    return null;
  }

  renderCommentButtons() {
    const inSubmitMode = this.state.inSubmitMode;
    const commentButtonString = inSubmitMode ? 'Replying...' : 'Reply';
    return (
      <Row>
        <Col sm={2} smOffset={6}>
          <button
            className={s.childCommentButton}
            onClick={this.onSubmitReply.bind(this)}
          >
            {commentButtonString}
          </button>
        </Col>
        <Col sm={2} smOffset={2}>
          <button
            className={s.childCancelButton}
            onClick={this.onExitCommentMode.bind(this)}
          >
            Cancel
          </button>
        </Col>
      </Row>
    );
  }

  renderCommentBox() {
    if (this.state.inCommentMode) {
      return (
        <Row className={s.commentBoxContainer}>
          <Col sm={1}>
            <img className={s.commentAvatar} alt="avatar" src={avatar} />
          </Col>

          <Col sm={11}>
            <textarea
              ref="commentBox"
              type="text"
              className={s.commentBox}
              placeholder="Write a comment.."
              onChange={this.onCommentChange.bind(this)}
            />

            <Row>
              <Col sm={4} smOffset={7}>
                {this.renderCommentButtons()}
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }

    return null;
  }

  renderComment() {
    if (this.state.commentData) {
      const comment = this.state.commentData;
      const user = comment.user;

      return (
        <Row className={s.commentMargin}>
          <Col sm={1}>
            <img className={s.commentAvatar} alt="avatar" src={avatar} />
          </Col>
          <Col sm={10}>
            <p>
              <a href={`/profile/${user.id}`} className={s.commentUser}>
                {`${user.first_name} ${user.last_name}`}
              </a>
            </p>
            <p className={s.commentMessage}>
              {comment.message}
            </p>
            <a
              className={s.replyLink}
              href="#"
              onClick={this.onActivateCommentMode.bind(this)}
            >
              Reply
            </a>

            {this.renderCommentChildren()}

            {this.renderCommentBox()}
          </Col>
        </Row>
      );
    }

    return null;
  }

  render() {
    return this.renderComment();
  }
}

export default withStyles(s)(Comment);
