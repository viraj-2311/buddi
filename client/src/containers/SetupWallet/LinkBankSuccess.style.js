import React from 'react';
import styled from 'styled-components';

const LinkBankSuccessWrapper = styled.div`
  padding: 20px 25px;
  text-align: center;
  font-weight: bold;

  .success-message {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #2f2e50;
    font-size: 15px;

    .even-number {
      font-size: 40px;
      font-weight: 600;
      color: #2f2e50;
    }
    .small-number {
      color: #f48d3a;
      font-size: 40px;
      font-weight: 600;
    }
  }

  .success-account {
    margin-bottom: 20px;
  }

  .additional-success-message {
    margin-top: 20px;
    margin-bottom: 20px;
    font-weight: normal;
    font-size: 13px;
    white-space: pre-wrap;
  }

  .bank-button {
    font-size: 14px;
    width: 150px;
  }
`;

export default LinkBankSuccessWrapper;
