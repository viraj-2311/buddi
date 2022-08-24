import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import MultiplyIcon from './icons/Multiply';
import WithDirection from '@iso/lib/helpers/rtl';

const AntModal = (props) => (
  <Modal closeIcon={<MultiplyIcon width={16} height={16} />} {...props} />
);

const isoModal = styled(AntModal)`
  .ant-modal-close {
    .ant-modal-close-x {
      width: 70px;
      height: 70px;
      line-height: 76px;
    }
  }

  .ant-modal-content {
    border-radius: 10px;
  }

  .ant-modal-header {
    border-radius: 10px 10px 0 0;
    padding: 20px 70px 20px 35px;
    border-bottom: 1px solid #dddde5;

    .ant-modal-title {
      font-size: 25px;
      color: ${palette('text', 5)};
      font-weight: bold;
      line-height: normal;
    }
  }
  
  .ant-modal-footer {
    padding: 30px;

    @media only screen and (max-width: 767px) {
      padding: 20px;
    }

    @media only screen and (max-width: 375px) {
      padding: 10px;
    }
  }

`;

export default WithDirection(isoModal);
