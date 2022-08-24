import React from 'react';
import styled from 'styled-components';
import Modal from '@iso/components/Modal';

const VerifyKYC = styled.div`
  padding: 20px 25px;

  .verification-title {
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .description {
    color: #2f2e50;
    font-size: 15px;
    margin-top: 20px;
    margin-bottom: 15px;
    display: block;
    text-align: center;
    color: var(--dark);
  }
  .overview-message {
    padding: 10px;
    border-radius: 5px;
    border: solid 1px #bcbccb;
    background-color: rgba(59, 134, 255, 0.1);
    flex-direction: row;
    flex: 1;
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
    .info-desc {
      margin-left: 10px;
    }
  }

  .buttonWrap {
    font-size: 14px;
    width: 150px;
    min-width: 150px;
    margin-top: 20px;
  }
  .disableButton {
    opacity: 0.5;
  }
  .buttonWrapBack {
    font-size: 14px;
    width: 150px;
    min-width: 150px;
    margin-right: 20px;
    margin-top: 20px;
    background-image: linear-gradient(to right, #ffffff, #ffffff) !important;
  }
  .verification-status {
    font-size: 15px;
    font-weight: bold;
    margin-top: 20px;
  }
  .pending-status {
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: solid 1px #bcbccb;
    flex-direction: row;
    flex: 1;
    display: flex;
    padding: 10px;
    p {
      flex: 1;
      display: flex;
      align-items: center;
      color: var(--dark);
    }
    .pending {
      background-color: #ffa177;
      border-radius: 5px;
      padding: 3px 15px;
      color: #ffffff;
      font-weight: bold;
    }
    .success {
      background-color: #19913d;
      border-radius: 5px;
      padding: 3px 15px;
      color: #ffffff;
      font-weight: bold;
    }
    .failed {
      background-color: #ff6565;
      border-radius: 5px;
      padding: 3px 15px;
      color: #ffffff;
      font-weight: bold;
    }
  }
`;

export default VerifyKYC;
