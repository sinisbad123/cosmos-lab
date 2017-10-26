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
import s from './Login.css';

import LoginPanel from './loginPanels/LoginPanel';
import RegisterPanel from './loginPanels/RegisterPanel';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegisterMode: true,
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      hasAgreedOnTerms: false,

      hasValidInputs: true,
      validationMessage: '',
    };
  }

  componentWillMount() {
    if (this.props.data) {
      const action = this.props.data.query.action;
      const currentState = this.state;

      switch (action) {
        case 'login':
          currentState.isRegisterMode = false;
          this.setState(currentState);
          break;
        case 'expire':
          currentState.isRegisterMode = false;
          currentState.hasValidInputs = false;
          currentState.validationMessage =
            'Login session expired. Please log in';
          this.setState(currentState);
          break;
        default:
          break;
      }
    }
  }

  onChangeMode(toggle, e) {
    let isRegisterMode = this.state.isRegisterMode;
    isRegisterMode = toggle;

    const currentState = this.state;
    currentState.isRegisterMode = isRegisterMode;
    currentState.firstName = '';
    currentState.lastName = '';
    currentState.password = '';
    currentState.email = '';
    currentState.hasAgreedOnTerms = false;
    currentState.hasValidInputs = true;
    currentState.validationMessage = '';

    this.setState(currentState);
  }

  onUpdateUserInfo(infoType, value, e) {
    let currentState = this.state;

    switch (infoType) {
      case 'first_name':
        currentState.firstName = value;
        break;
      case 'last_name':
        currentState.lastName = value;
        break;
      case 'password':
        currentState.password = value;
        break;
      case 'email':
        currentState.email = value;
        break;
      case 'terms':
        currentState.hasAgreedOnTerms = value;
        break;
      default:
        break;
    }

    this.setState(currentState);
  }

  validateInputs() {
    if (this.state.isRegisterMode) {
      let currentState = this.state;
      const firstName = this.state.firstName;
      const lastName = this.state.lastName;
      const passwordString = this.state.password;
      const emailString = this.state.email;
      const hasAgreedToTerms = this.state.hasAgreedOnTerms;

      if ((firstName !== '' && firstName)
      && (lastName !== '' && lastName)
      && (passwordString !== '' && passwordString)
      && (emailString !== '' && emailString)
      && (hasAgreedToTerms === true)) {
        currentState.hasValidInputs = false;
        currentState.validationMessage = 'Registration Successful.';

        this.setState(currentState);

        return true;
      } else {
        currentState.hasValidInputs = false;
        currentState.validationMessage = 'All fields are required and should agree with Terms and Conditions.';
        this.setState(currentState);
        return false;
      }
    } else {
      let currentState = this.state;
      const emailString = this.state.email;
      const passwordString = this.state.password;

      if ((emailString !== '' && emailString)
        && (passwordString !== '' && passwordString)) {
          currentState.hasValidInputs = false;
          currentState.validationMessage = 'Login Successful.';

          this.setState(currentState);
          return true;
      } else {
        currentState.hasValidInsputs = false;
        currentState.validationMessage = 'Username and password required.';

        this.setState(currentState);

        return false;
      }
    }

    return false;
  }

  registerUser() {
    if (this.validateInputs()) {
      const firstName = this.state.firstName;
      const lastName = this.state.lastName;
      const passwordString = this.state.password;
      const emailString = this.state.email;

      const data = {
        first_name: firstName,
        last_name: lastName,
        password: passwordString,
        email: emailString,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      return axios
        .post('http://52.198.83.248/users', data, config)
        .then(response => {
          let currentState = this.state;
        })
        .catch(err => {
          console.log('Exception occured:', err);
        });
    }

    return null;
  }

  loginUser() {
    if (this.validateInputs()) {
      const username = this.state.email;
      const passwordString = this.state.password;

      const data = {
        email: username,
        password: passwordString,
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      return axios
        .post('http://52.198.83.248/auth', data, config)
        .then(response => {
          localStorage.setItem('user_token', response.data.token);
          window.location.href = '/feed';
        })
        .catch(err => {
          console.log(err.response.data.errors[0].message);
          const currentState = this.state;
          currentState.validationMessage = err.response.data.errors[0].message;
          currentState.hasValidInputs = false;
          this.setState(currentState);
        });
    }
    return null;
  }

  renderLeftPanel() {
    if (this.state.isRegisterMode) {
      return (
        <RegisterPanel
          onSend={this.registerUser.bind(this)}
          onUpdate={this.onUpdateUserInfo.bind(this)}
          hasValidInputs={this.state.hasValidInputs}
          validationMessage={this.state.validationMessage}
        />
      );
    }
    return (
      <LoginPanel
        onSend={this.loginUser.bind(this)}
        onUpdate={this.onUpdateUserInfo.bind(this)}
        hasValidInputs={this.state.hasValidInputs}
        validationMessage={this.state.validationMessage}
      />
    );
  }

  render() {
    const registerClass = this.state.isRegisterMode
      ? s.actionSelected
      : s.actionUnselected;
    const loginClass = this.state.isRegisterMode
      ? s.actionUnselected
      : s.actionSelected;

    return (
      <div className={s.fullHeight}>
        <Row className={s.fullHeight}>
          <Col className={s.leftPanel} sm={6}>
            <Row className={s.topMargin}>
              <Col sm={8} smOffset={2}>
                <h3 className={s.actionHeader}>
                  <span
                    className={loginClass}
                    onClick={this.onChangeMode.bind(this, false)}
                  >
                    Log in
                  </span>
                  <span className={s.actionSeparator}> | </span>
                  <span
                    className={registerClass}
                    onClick={this.onChangeMode.bind(this, true)}
                  >
                    Sign up
                  </span>
                </h3>
              </Col>
            </Row>
            {this.renderLeftPanel()}
          </Col>

          <Col className={s.rightPanel} sm={6}>
            <section>
              <Row className={s.topMargin}>
                <Col sm={12}>
                  <h4 className={s.rightSubHeader}>
                    Get your <b className={s.rightSubHeaderBold}>vision</b> out
                    there and
                  </h4>

                  <h1 className={s.header}>Launch a Campaign.</h1>
                </Col>
              </Row>

              <Row className={s.paragraphContainer}>
                <Col sm={12}>
                  <p className={s.rightParagraph}>
                    In COSMOS, people care and have your back
                  </p>
                  <p className={s.rightParagraph}>
                    Meet and connect with people who share the same vision as
                    yours
                  </p>
                  <p className={s.rightParagraph}>
                    Together, let's make the world a better place.
                  </p>
                </Col>
              </Row>
            </section>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withStyles(s)(Login);
