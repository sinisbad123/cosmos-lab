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
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../Login.css';

class RegisterPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasValidInputs: true,
      validationMessage: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hasValidInputs !== nextProps.hasValidInputs) {
      console.log('changing props..');
      let currentState = this.state;
      currentState.hasValidInputs = nextProps.hasValidInputs;
      currentState.validationMessage = nextProps.validationMessage;

      this.setState(currentState);
    }
  }

  onFirstNameChange(e) {
    if (e.target.value && this.props.onUpdate) {
      this.props.onUpdate('first_name', e.target.value);
    }
  }

  onLastNameChange(e) {
    if (e.target.value && this.props.onUpdate) {
      this.props.onUpdate('last_name', e.target.value);
    }
  }

  onPasswordChange(e) {
    if (e.target.value && this.props.onUpdate) {
      this.props.onUpdate('password', e.target.value);
    }
  }

  onEmailChange(e) {
    if (e.target.value && this.props.onUpdate) {
      this.props.onUpdate('email', e.target.value);
    }
  }

  onTermsAgree(e) {
    this.props.onUpdate('terms', e.target.checked);
  }

  renderValidation(isValid, message) {
    if (isValid === false) {
      return (
        <Row className={s.validationContainer}>
          <Col sm={10} smOffset={2}>
            <p className={s.validationMessage}>{message}</p>
          </Col>
        </Row>
      );
    } else {
      return null;
    }
  }

  render() {
    const validationMessage = this.renderValidation(
      this.state.hasValidInputs,
      this.state.validationMessage,
    );

    console.log(this.state.hasValidInputs, this.state.validationMessage);

    return (
      <section>
        <Row>
          <Col sm={10} smOffset={2}>
            <p className={s.subHeader}>
              Be part of the community today and be involved.
            </p>
          </Col>
        </Row>

        <Row>
          <Col sm={8} smOffset={2}>
            <p className={s.inputLabel}>FIRST NAME</p>
            <input
              className={s.loginInput}
              placeholder="Enter your first name"
              onChange={this.onFirstNameChange.bind(this)}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={8} smOffset={2}>
            <p className={s.inputLabel}>LAST NAME</p>
            <input
              className={s.loginInput}
              placeholder="Enter your last name"
              onChange={this.onLastNameChange.bind(this)}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={8} smOffset={2}>
            <p className={s.inputLabel}>PASSWORD</p>
            <input
              type="password"
              className={s.loginInput}
              placeholder="Enter your password"
              onChange={this.onPasswordChange.bind(this)}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={8} smOffset={2}>
            <p className={s.inputLabel}>E-MAIL</p>
            <input
              type="email"
              className={s.loginInput}
              placeholder="Enter your e-mail address"
              onChange={this.onEmailChange.bind(this)}
            />
          </Col>
        </Row>

        <Row>
          <Col sm={10} smOffset={2}>
            <div className={s.checkboxContainer}>
              <span className={s.termsSpan}>
                <input
                  onChange={this.onTermsAgree.bind(this)}
                  className={s.checkbox}
                  type="checkbox"
                />
                I agree to the{' '}
                <a className={s.termsLink} href="#">
                  Terms and Conditions
                </a>
              </span>
            </div>
          </Col>
        </Row>

        {validationMessage}

        <Row>
          <Col sm={8} smOffset={2}>
            <button
              className={s.signupButton}
              onClick={this.props.onSend ? this.props.onSend : null}
            >
              REGISTER
            </button>
          </Col>
        </Row>
      </section>
    );
  }
}

export default withStyles(s)(RegisterPanel);
