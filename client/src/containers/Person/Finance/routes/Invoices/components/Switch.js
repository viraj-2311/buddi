import { Radio } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const AntRadioSwitch = styled(Radio.Group)`
  &.ant-radio-group {
    padding: 3px;
    border-radius: 25px;
    white-space: nowrap;
    font-size: 15px;
    color: ${palette('text', 5)};
    background: #e5e6ed;
    border: 1px solid #d3d3d9;
  }

  .ant-radio-button-wrapper {
    height: 42px;
    line-height: 42px;
    background: transparent;
    border: none;
    border-radius: 25px;
    text-align: center;
    min-width: 150px;

    @media (max-width: 375px) {
      min-width: 110px;
    }

    &.ant-radio-button-wrapper-checked {
      color: #ffffff;
      background-color: ${palette('themecolor', 0)};
      font-weight: bold;

      &:not(.ant-radio-button-wrapper-disabled) {
        border-color: ${palette('themecolor', 0)};

        &:hover {
          border-color: ${palette('themecolor', 0)};
        }
      }
    }
    :focus {
      outline: none;
    }

    &:not(:first-child)::before {
      content: none;
    }
  }
`;

export default AntRadioSwitch;
