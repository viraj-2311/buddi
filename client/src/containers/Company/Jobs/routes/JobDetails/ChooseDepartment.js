import React from 'react';
import styled from 'styled-components';
import { Select } from 'antd';

const ChooseDepartment = styled(Select)`
  &.ant-select .ant-select-selector {
    border-radius: 50px;
    background-color: transparent;
    height: 50px;
    padding: 0 13px;
    &:after {
      content: "";
      position: absolute;
      top: 22px;
      right: 18px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #000;
    }
    .ant-select-selection-placeholder {
      left: 20px;
      right: 20px;
      font-weight: bold;
      color: #2f2e50;
      opacity: 1;
    }
  }
`;

export const ChooseDepartmentDropdownWrapper = styled.div`
  padding: 0 20px;
  max-height: 540px;
  overflow: auto;

  .departmentDropDownItem {
    width: 100%;
    font-family: OpenSans;
    font-size: 15px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.33;
    letter-spacing: normal;
    text-align: left;
    color: #2f2e50;
    border-top: solid 1px #b4b4c6;
    padding: 20px 0;
    &:first-child {
      border-top: none;
    }
    label {
      width: 100%;
      
      span {
        color: #2f2e50;
        
        &.ant-checkbox {
          margin-right: 10px;
        }
      }
    }
  }
`;

export default ChooseDepartment;
