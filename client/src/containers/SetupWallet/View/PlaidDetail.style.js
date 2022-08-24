import styled from 'styled-components';
import Modal from '@iso/components/Modal';
import { Row } from 'antd';

export const PlaidDetailModalBodyWrapper = styled.div`
  border-radius: 5px;
  overflow: hidden;
  .title-header {
    font-size: 15px;
    font-weight: bold;
    color: #2f2e50;
  }
  .description {
    font-size: 13px;
  }
  .ant-collapse {
    background-color: white;
  }
  .ant-collapse-header {
    background-color: #f0f0f7;
    border-radius: 5px;
  }
  .ant-collapse-borderless > .ant-collapse-item {
    border-bottom: none;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  .ant-collapse-borderless
    > .ant-collapse-item:last-child
    .ant-collapse-header {
    border-radius: 5px;
  }
`;
