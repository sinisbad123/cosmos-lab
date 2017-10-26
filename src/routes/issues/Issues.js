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
import s from './Issues.css';

import Header from '../../components/Header';
import loadingIcon from './img/loading.gif';

class Issues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      issues: [],
      show: false,
      isLoading: false,

      // form inputs
      title: '',
      description: '',
      inSubmitMode: false,
      validationMessage: '',
      showValidationMessage: false,
    };
  }

  componentWillMount() {
    const currentState = this.state;
    currentState.isLoading = true;
    this.setState(currentState);
  }

  componentDidMount() {
    const url = `http://52.198.83.248/issues`;
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
        const issues = response.data;
        currentState.issues = issues.reverse();
        currentState.isLoading = false;
        this.setState(currentState);
      })
      .catch(err => {
        currentState.isLoading = false;
        this.setState(currentState);
        if (err.response.status === 401) {
          window.location.href = '/login?action=expire';
        }
      });
  }

  onValueChange(type, e) {
    const currentState = this.state;
    const value = e.target.value;

    if (value.trim() !== '') {
      switch (type) {
        case 'title':
          currentState.title = value;
          break;
        case 'description':
          currentState.description = value;
          break;
        default:
          break;
      }
      this.setState(currentState);
    }
  }

  onSubmitIssue() {
    const title = this.state.title;
    const description = this.state.description;

    const url = `http://52.198.83.248/issues`;
    const token = localStorage.getItem('user_token');
    const currentState = this.state;
    const data = {
      title,
      description,
    };

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
      .post(url, data, config)
      .then(response => {
        const issue = response.data;
        currentState.issues.unshift(issue);
        currentState.title = '';
        currentState.description = '';
        currentState.inSubmitMode = false;
        currentState.showValidationMessage = false;
        currentState.validationMessage = '';

        this.refs.titleInput.value = '';
        this.refs.descriptionInput.value = '';
        this.setState(currentState);
      })
      .catch(err => {
        console.log(err);

        currentState.validationMessage = err.response.data.errors[0].message;
        currentState.showValidationMessage = true;
        currentState.inSubmitMode = false;
        this.setState(currentState);
      });
  }

  renderValidation() {
    if (this.state.showValidationMessage) {
      return (
        <p className={s.validationMessage}>
          {this.state.validationMessage}
        </p>
      );
    }

    return null;
  }

  renderActionsContainer() {
    return (
      <Row className={s.actionButtonContainer}>
        <Col sm={1} smOffset={11}>
          <p
            onClick={this.toggle.bind(this)}
            ref="target"
            className={`${s.actionButton} text-right`}
          >
            <i className="fa fa-ellipsis-v" />
          </p>
        </Col>
      </Row>
    );
  }

  renderIssues() {
    const issues = this.state.issues;

    if (issues.length > 0) {
      return issues.map(issue =>
        <Row key={issue.id}>
          <Col sm={10} smOffset={1}>
            <Row className={s.issueCard}>
              <Col sm={12}>
                <Row>
                  <Col sm={4} smOffset={4}>
                    <a
                      className={`${s.issueTitle} text-center`}
                      href={`/issues/${issue.id}`}
                    >
                      <h3 className={s.issueTitleText}>
                        {issue.title}
                      </h3>
                    </a>
                  </Col>
                </Row>

                {/* <Row>
                    <Col sm={12}>
                      <p className={`${s.lastActivity} text-center`}>
                        Last Activity 2 mins ago
                      </p>
                    </Col>
                  </Row> */}

                <Row>
                  <Col sm={12}>
                    <p className={`${s.issueDescription} text-center`}>
                      {issue.description}
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>,
      );
    }

    if (this.state.isLoading) {
      return (
        <Row className={s.loadingMessageContainer}>
          <Col sm={1} smOffset={3}>
            <img className={s.loadingIcon} alt="loading" src={loadingIcon} />
          </Col>

          <Col sm={5}>
            <h2 className={s.loadingMessage}>Loading Issues...</h2>
          </Col>
        </Row>
      );
    }

    return <h1>No Issues available</h1>;
  }

  renderAddIssueForm() {
    const buttonString = this.state.inSubmitMode ? 'Submitting...' : 'Submit';
    const validationMessage = this.renderValidation();
    return (
      <Row>
        <Col sm={10} smOffset={1}>
          <Row className={s.issueFormContainer}>
            <Col sm={12}>
              <h3 className={s.issueFormTitle}>Start an Issue</h3>

              <p className={s.inputLabel}>Title</p>
              <input
                ref="titleInput"
                onChange={this.onValueChange.bind(this, 'title')}
                className={s.campaignInput}
                placeholder="Your initiative"
              />

              <p className={s.inputLabel}>Description</p>
              <textarea
                ref="descriptionInput"
                onChange={this.onValueChange.bind(this, 'description')}
                className={s.inputDescription}
                placeholder="Place your pitch here! Tell the people all about your initiative"
              />

              {validationMessage}

              <p>
                <button
                  className={s.submitButton}
                  onClick={this.onSubmitIssue.bind(this)}
                  disabled={this.state.inSubmitMode}
                >
                  {buttonString}
                </button>
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <Row className={s.container}>
        <Col sm={12}>
          <Header />
          {this.renderAddIssueForm()}
          {this.renderIssues()}
        </Col>
      </Row>
    );
  }
}

export default withStyles(s)(Issues);
