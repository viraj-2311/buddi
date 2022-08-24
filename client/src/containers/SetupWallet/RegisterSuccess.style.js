import React from 'react';
import styled from 'styled-components';

const RegisterSuccessWrapper = styled.div`
  padding: 30px 30px 30px 30px;
  text-align: center;

  .success-account {
    margin-bottom: 20px;
  }
  .success-message {
    font-size: 25px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .bank-button {
    width: fit-content;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .button-view {
    display: flex;
    justify-content: center;
  }
`;

export default RegisterSuccessWrapper;
