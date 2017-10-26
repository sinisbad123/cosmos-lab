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
import isDate from 'date-fns/is_date';
import format from 'date-fns/format';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CreateCampaign.css';

import Header from '../../../components/Header';

class Campaign extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      amount: 0.0,
      start_date: new Date(),
      duration: 0,
      description: '',

      hasValidInputs: true,
      validationMessage: '',

      onSubmitMode: false,
    };
  }

  onValueChange(type, e) {
    const currentState = this.state;
    const value = e.target.value;

    switch (type) {
      case 'title':
        currentState.title = value;
        break;
      case 'amount':
        currentState.amount = Number(value);
        break;
      case 'start_date':
        currentState.start_date = new Date(e.target.value);
        break;
      case 'duration':
        currentState.duration = value;
        break;
      case 'description':
        currentState.description = value;
        break;
      default:
        break;
    }

    this.setState(currentState);
  }

  onCreate() {
    if (this.validateInputs()) {
      const token = localStorage.getItem('user_token');
      const currentState = this.state;

      if (typeof token !== 'undefined' && token !== null) {
        const data = {
          title: this.state.title,
          amount: this.state.amount,
          starts_at: this.state.start_date,
          duration: this.state.duration,
          description: this.state.description,
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        currentState.onSubmitMode = true;
        this.setState(currentState);

        return axios
          .post('http://52.198.83.248/campaigns', data, config)
          .then(response => {
            window.location.href = `/campaign/${response.data.id}`;
          })
          .catch(err => {
            if (err.response.status === 401) {
              window.location.href = '/login?action=expire';
            }

            if (err.response && err.response.data && err.response.data.errors) {
              currentState.validationMessage =
                err.response.data.errors[0].message;
              currentState.hasValidInputs = false;
            }

            currentState.onSubmitMode = false;
            this.setState(currentState);
            console.log(err);
          });
      }

      window.location.href = '/login?action=login';
    }

    return null;
  }

  validateInputs() {
    const currentState = this.state;

    const title = this.state.title;
    const amount = this.state.amount;
    const startDate = this.state.start_date;
    const duration = this.state.duration;
    const description = this.state.description;

    if (title && amount && startDate && duration && description) {
      currentState.hasValidInputs = true;
      this.setState(currentState);
      return true;
    }

    currentState.hasValidInputs = false;
    currentState.validationMessage = 'All fields must be filled up.';
    this.setState(currentState);
    return false;
  }

  renderValidation(hasValidInputs) {
    if (!hasValidInputs) {
      return (
        <p className={s.validationMessage}>
          {this.state.validationMessage}
        </p>
      );
    }

    return null;
  }

  render() {
    const validationMessage = this.renderValidation(this.state.hasValidInputs);
    const buttonString = this.state.onSubmitMode ? 'Submitting...' : 'Submit';
    return (
      <div>
        <Header />

        <Row className={s.container}>
          <Col sm={8} smOffset={2}>
            <h2 className={s.createHeader}>Create Campaign</h2>

            <Row className={s.inputFieldsContainer}>
              <Col sm={12}>
                <p className={s.inputLabel}>Title</p>
                <input
                  onChange={this.onValueChange.bind(this, 'title')}
                  className={s.campaignInput}
                  placeholder="My campaign"
                />

                <p className={s.inputLabel}>Amount</p>
                <input
                  onChange={this.onValueChange.bind(this, 'amount')}
                  className={s.campaignInput}
                />

                <Row>
                  <Col sm={6}>
                    <p className={s.inputLabel}>Campaign Start Date</p>
                    <input
                      onChange={this.onValueChange.bind(this, 'start_date')}
                      type="date"
                      className={s.campaignInput}
                    />
                  </Col>

                  <Col sm={6}>
                    <p className={s.inputLabel}>Duration (days)</p>
                    <input
                      onChange={this.onValueChange.bind(this, 'duration')}
                      className={s.campaignInput}
                    />
                  </Col>
                </Row>

                <p className={s.inputLabel}>Description</p>
                <textarea
                  onChange={this.onValueChange.bind(this, 'description')}
                  className={s.inputDescription}
                  placeholder="Place your pitch here! Tell the people all about your campaign"
                />

                <Row>
                  <Col sm={6}>
                    {validationMessage}
                  </Col>

                  <Col sm={6}>
                    <p>
                      <button
                        onClick={this.onCreate.bind(this)}
                        className={`${s.submitButton} pull-right`}
                        disabled={this.state.onSubmitMode}
                      >
                        {buttonString}
                      </button>
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withStyles(s)(Campaign);
