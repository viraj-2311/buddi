import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const AntModal = props => <Modal {...props} />;

const isoModal = styled(AntModal)`
  .ant-modal-close-icon {
    font-size: 20px;
    color: #eb5757;
  }
  
  .ant-modal-title {
    color: ${palette('text', 0)};
  }
  
  .ant-modal-body {
    padding: 36px;
    color: ${palette('text', 0)};
  }
`;

export default WithDirection(isoModal);
