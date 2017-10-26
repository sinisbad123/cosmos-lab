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

class LoginPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasValidInputs: true,
      validationMessage: '',
    };
  }

  componentWillMount() {
    const currentState = this.state;
    currentState.hasValidInputs = this.props.hasValidInputs;
    currentState.validationMessage = this.props.validationMessage;
    this.setState(currentState);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.hasValidInputs !== nextProps.hasValidInputs ||
      this.props.validationMessage !== nextProps.validationMessage
    ) {
      let currentState = this.state;
      currentState.hasValidInputs = nextProps.hasValidInputs;
      currentState.validationMessage = nextProps.validationMessage;

      this.setState(currentState);
    }
  }

  onUsernameChange(e) {
    if (e.target.value && this.props.onUpdate) {
      this.props.onUpdate('email', e.target.value);
    }
  }

  onPasswordChange(e) {
    if (e.target.value && this.props.onUpdate) {
      this.props.onUpdate('password', e.target.value);
    }
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
            <p className={s.inputLabel}>USERNAME</p>
            <input
              className={s.loginInput}
              placeholder="Enter your username"
              onChange={this.onUsernameChange.bind(this)}
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

        {validationMessage}

        <Row>
          <Col sm={8} smOffset={2}>
            <button
              className={s.signupButton}
              onClick={this.props.onSend ? this.props.onSend : null}
            >
              LOG IN
            </button>
          </Col>
        </Row>
      </section>
    );
  }
}

export default withStyles(s)(LoginPanel);
