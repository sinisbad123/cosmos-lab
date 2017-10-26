/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { Row, Col, Modal } from 'react-bootstrap';
import axios from 'axios';
import QRCode from 'qrcode.react';
import * as ProgressBar from 'react-progressbar.js';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Wallet.css';

import Header from '../../components/Header';

const Circle = ProgressBar.Circle;

class Wallet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      potData: null,
      btcData: null,

      showBTCAddressModal: false,
    };
  }

  componentDidMount() {
    const userDataUrl = `http://52.198.83.248/user/me`;
    const potDataUrl = `http://52.198.83.248/pot`;
    const btcUrl = `http://52.198.83.248/user/me/wallet/btc`;
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
      .get(userDataUrl, config)
      .then(response => {
        const userData = response.data;
        currentState.userData = userData;
        this.setState(currentState);
      })
      .catch(err => {
        if (err.response.status === 401) {
          window.location.href = '/login?action=expire';
        }
      });

    axios
      .get(potDataUrl, config)
      .then(response => {
        const potData = response.data;
        console.log(potData);
        currentState.potData = potData;
        this.setState(currentState);
      })
      .catch(err => {
        if (err.response.status === 401) {
          window.location.href = '/login?action=expire';
        }
      });

    axios
      .get(btcUrl, config)
      .then(response => {
        const btcData = response.data;
        currentState.btcData = btcData;
        this.setState(currentState);
      })
      .catch(err => {
        if (err.response.status === 401) {
          window.location.href = '/login?action=expire';
        }
      });
  }

  onShowBTCAddressModal(e) {
    e.preventDefault();
    const currentState = this.state;
    currentState.showBTCAddressModal = true;
    this.setState(currentState);
  }

  onHideBTCAddressModal() {
    const currentState = this.state;
    currentState.showBTCAddressModal = false;
    this.setState(currentState);
  }

  numberWithCommas(x) {
    const parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }

  renderBalanceInformation() {
    const userData = this.state.userData;
    if (userData) {
      const balance = this.numberWithCommas(
        parseFloat(userData.balance).toFixed(2),
      );
      return (
        <Row>
          <p className={`${s.subHeader} text-center`}>
            Your total wallet value
          </p>

          <h1 className={`${s.balanceHeader} text-center`}>
            {balance}
          </h1>

          <p className="text-center">
            <a
              className={s.cashInLink}
              href="#"
              onClick={this.onShowBTCAddressModal.bind(this)}
            >
              <i className="fa fa-university" /> Cash-in via BTC
            </a>
          </p>

          <Row>
            <Col sm={10} smOffset={1}>
              <hr className={s.divider} />
            </Col>
          </Row>

          <Row className={s.moneyTypeContainer}>
            <Col sm={4}>
              <span className={`${s.moneyTypeIcon} pull-right`}>
                <i className="fa fa-money" />
              </span>
            </Col>
            <Col sm={6}>
              <Row>
                <Col sm={6}>
                  <p className={s.moneyType}>Cash</p>
                  <p className={s.moneyTypeSubHeader}>
                    (for Cash-out or send Cash)
                  </p>
                </Col>

                <Col sm={6}>
                  <p className={s.moneyTypeBalance}>150,000</p>
                </Col>
              </Row>
            </Col>
          </Row>

          <Row className={s.moneyTypeContainer}>
            <Col sm={4}>
              <span className={`${s.moneyTypeIcon} pull-right`}>
                <i className="fa fa-cc" />
              </span>
            </Col>
            <Col sm={6}>
              <Row>
                <Col sm={6}>
                  <p className={s.moneyType}>Cosmos Cash</p>
                  <p className={s.moneyTypeSubHeader}>
                    (for use within Cosmos Community)
                  </p>
                </Col>

                <Col sm={6}>
                  <p className={s.moneyTypeBalance}>150,000</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Row>
      );
    }

    return null;
  }

  renderPotInformation() {
    const potData = this.state.potData;
    const userData = this.state.userData;
    if (potData && userData) {
      let progress = potData.contents / potData.amount;
      if (potData.contents >= potData.amount) {
        progress = 1;
      }
      const progressPercent = progress * 100;
      const progressBarOptions = {
        strokeWidth: 5,
        color: '#32d2b8',
        text: {
          className: `${s.potContent}`,
          style: {
            color: '#00000',
            position: 'absolute',
            left: '50%',
            top: '55%',
            padding: 0,
            margin: 0,
            transform: {
              prefix: true,
              value: 'translate(-50%, -50%)',
            },
          },
        },
      };
      return (
        <Row className={s.potContainer}>
          <Col sm={12}>
            <Row>
              <Col sm={3} smOffset={3}>
                <p className={`${s.potProgress} text-center`}>
                  {progressPercent}%
                </p>
                <Circle
                  containerClassName={`${s.progressBarContainer} center-block`}
                  progress={progress}
                  text=" "
                  options={progressBarOptions}
                />
              </Col>

              <Col sm={4}>
                <h3 className={s.potHeader}>Cosmos Cash Tank</h3>
                <p className={s.potDescription}>
                  Once full, cash tank will desperse cash to your wallet which
                  you may use to invest. This tank fills out as you invest on
                  campaigns within the community. Keep investing!
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      );
    }

    return (
      <Row className={s.loadingMessageContainer}>
        <Col sm={12}>
          <h1 className={`${s.loadingMessageText} text-center`}>
            Loading wallet information...
          </h1>
        </Col>
      </Row>
    );
  }

  renderBTCAddressModal() {
    const btcData = this.state.btcData;
    if (btcData) {
      return (
        <Modal
          show={this.state.showBTCAddressModal}
          onHide={this.onHideBTCAddressModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title className={s.modalHeader}>BTC Address</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4 className={s.modalBodyHeader}>BTC address to deposit:</h4>
            <QRCode value={`bitcoin:${btcData.address}`} size={300} />

            <p className={s.modalReminders}>
              BTC Address in text: {btcData.address}
            </p>

            <p className={s.modalReminders}>
              Please take note that sending currencies other than BTC to this
              address will result to permanent loss of your currency.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <button
              className={s.closeButton}
              onClick={this.onHideBTCAddressModal.bind(this)}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      );
    }

    return null;
  }

  render() {
    return (
      <Row>
        <Col sm={12}>
          {this.renderBTCAddressModal()}
          <Header />

          <Row className={s.balanceContainer}>
            <Col sm={12}>
              {this.renderBalanceInformation()}
            </Col>
          </Row>

          {this.renderPotInformation()}
        </Col>
      </Row>
    );
  }
}

export default withStyles(s)(Wallet);
