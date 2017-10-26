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

import Header from '../../../components/Header';
import Comment from './Comment';
import loadingIcon from './img/loading.gif';

class Issue extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      issueData: null,
      comments: [],
      commentBoxContent: '',
      show: false,
      isLoading: false,
      inSubmitMode: false,
      userData: null,
    };
  }

  componentWillMount() {
    const currentState = this.state;
    currentState.isLoading = true;
    this.setState(currentState);
  }

  componentDidMount() {
    const id = this.props.data.params.id;
    const userUrl = `http://52.198.83.248/user/me`;
    const issueUrl = `http://52.198.83.248/issue/${id}`;
    const commentUrl = `http://52.198.83.248/issue/${id}/comments?include='user'`;
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
      .get(commentUrl, config)
      .then(response => {
        const comments = response.data;
        currentState.comments = comments;
        currentState.isLoading = false;
        this.setState(currentState);
      })
      .catch(err => {
        currentState.isLoading = false;
        this.setState(currentState);

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
        currentState.isLoading = false;
        this.setState(currentState);

        if (!err.response) {
          console.log(err);
          return;
        }

        if (err.response.status === 401) {
          window.location.href = '/login?action=expire';
        }
      });

    axios
      .get(issueUrl, config)
      .then(response => {
        const issue = response.data;
        currentState.issueData = issue;
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
      const id = this.props.data.params.id;

      if (!token) {
        window.location.href = '/login?action=login';
      }

      const url = `http://52.198.83.248/issue/${id}/comments`;

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

      axios
        .post(url, data, config)
        .then(response => {
          const comment = response.data;
          comment.user = this.state.userData;
          currentState.comments.push(comment);
          currentState.commentBoxContent = '';
          currentState.inSubmitMode = false;
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

  renderComments() {
    const comments = this.state.comments;

    if (comments.length > 0) {
      const renderedComments = comments.map((comment, idx) => {
        let hrTag = <hr />;
        if (idx === 0) hrTag = null;
        return (
          <div key={comment.id}>
            {hrTag}
            <Comment key={comment.id} data={comment} />
          </div>
        );
      });

      return (
        <Row>
          <Col sm={12}>
            <Row className={s.commentsContainer}>
              <Col sm={12}>
                {renderedComments}
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }

    return null;
  }

  renderLoadingMessage() {
    if (this.state.isLoading) {
      return (
        <Row className={s.loadingMessageContainer}>
          <Col sm={12}>
            <Row>
              <Col sm={1} smOffset={3}>
                <img
                  className={s.loadingIcon}
                  alt="loading"
                  src={loadingIcon}
                />
              </Col>

              <Col sm={5}>
                <h2 className={s.loadingMessage}>Loading Comments...</h2>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }

    if (this.state.comments.length === 0) {
      return (
        <Row className={s.loadingMessageContainer}>
          <Col sm={9} smOffset={3}>
            <h1 className={`${s.loadingMessage} text-center`}>
              No comments available
            </h1>
          </Col>
        </Row>
      );
    }

    return null;
  }

  renderCommentBox() {
    const commentBoxButtonString = this.state.inSubmitMode
      ? 'Commenting...'
      : 'Comment';
    return (
      <Row className={s.container}>
        <Col sm={12}>
          <Row className={s.commentBoxContainer}>
            <Col sm={12}>
              <textarea
                onChange={this.onCommentChange.bind(this)}
                className={s.commentBox}
                ref="commentBox"
              />

              <p>
                <button
                  className={s.commentButton}
                  onClick={this.onComment.bind(this)}
                  disabled={this.state.inSubmitMode}
                >
                  {commentBoxButtonString}
                </button>
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  render() {
    const issue = this.state.issueData;
    const issueTitle = issue ? issue.title : null;
    const issueDescription = issue ? issue.description : null;
    return (
      <Row className={`${s.container} ${s.issueContainer}`}>
        <Col sm={12}>
          <Header />

          <Row>
            <Col sm={3} smOffset={1}>
              <Row className={s.issueDetailsContainer}>
                <Col sm={12}>
                  <h3 className={s.issueTitle}>
                    {issueTitle}
                  </h3>

                  <p className={s.issueDescription}>
                    {issueDescription}
                  </p>
                </Col>
              </Row>
            </Col>
            <Col sm={7}>
              {this.renderCommentBox()}

              {this.renderLoadingMessage()}
              {this.renderComments()}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default withStyles(s)(Issue);
