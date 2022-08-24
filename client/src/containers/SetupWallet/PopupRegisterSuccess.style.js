import React from 'react';
import styled from 'styled-components';
import Modal from '@iso/components/Modal';

const ViewSuccessWrapper = styled(Modal)`
  padding: 20px 25px;
  text-align: center;
  font-weight: bold;

  .title {
    margin-top: 20px;
    margin-bottom: 20px;
    color: #2f2e50;
    font-size: 25px;
  }

  .description {
    margin-bottom: 20px;
  }

  .button {
    font-size: 14px;
    width: 150px;
  }
`;

export default ViewSuccessWrapper;
