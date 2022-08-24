import React from 'react';
import styled from 'styled-components';
import { Select } from 'antd';

const ChooseContactType = styled(Select)`
  &.ant-select .ant-select-selector {
    border-radius: 50px;
    background-color: transparent;
    height: 50px;
    padding: 0 15px;
    &:after {
      content: '';
      position: absolute;
      top: 22px;
      right: 18px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #000;
      visibility: visible;
    }
    .ant-select-selection-search-input {
      height: 100%;
    }
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      line-height: 48px;
    }
  }
  .ant-select-arrow {
    display: none;
  }
`;

export const ChooseContactTypeOption = Select.Option;

export default ChooseContactType;
