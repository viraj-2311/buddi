import styled from 'styled-components';
import StatusTag from '@iso/components/utility/statusTag';
import React from 'react'

const paymentStatus = (props) => { return <StatusTag {...props} /> };

const PaymentStatusTagStyle = styled(paymentStatus)`
  margin-left: 10px;
  font-size: 15px;
  font-weight: bold;
`;

export default PaymentStatusTagStyle;