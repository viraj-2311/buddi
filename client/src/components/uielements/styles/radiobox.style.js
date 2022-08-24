import styled from 'styled-components';
import { palette } from 'styled-theme';

const AntRadiobox = (ComponentName) => styled(ComponentName)`
  &.ant-radio-wrapper,
  .ant-radio-wrapper,
  &.ant-radio-button-wrapper {
    font-size: 14px;
    color: ${palette('text', 1)};

    .ant-radio-inner {
      width: 18px;
      height: 18px;
      border: 2px solid ${palette('border', 8)} !important;
      &:after {
        top: 3px;
        left: 3px;
        width: 8px;
        height: 8px;
        background-color: ${(props) => palette(props.type || 'themecolor', 0)};
        border-radius: 50%;
      }
    }

    .ant-radio-checked .ant-radio-inner,
    .ant-radio-indeterminate .ant-radio-inner {
      border-color: ${(props) => palette(props.type || 'themecolor', 0)};
    }

    .ant-radio:hover .ant-radio-inner,
    .ant-radio-input:focus + .ant-radio-inner {
      border-color: ${(props) => palette(props.type || 'themecolor', 0)};
    }

    .ant-radio-disabled .ant-radio-inner:after {
      background-color: #ccc;
    }

    &:hover {
      .ant-radio-inner {
        border-color: ${(props) => palette(props.type || 'themecolor', 0)};
      }
    }

    .ant-radio-checked {
      .ant-radio-inner {
        &:after {
          transform: scale(1);
        }
      }
    }
  }

  .ant-radio-button-wrapper {
    height: 35px;
    line-height: 34px;

    &.ant-radio-button-wrapper-checked {
      color: #ffffff;
      background-color: ${(props) => palette(props.type || 'themecolor', 0)};
      border-color: ${(props) => palette(props.type || 'themecolor', 0)};

      &:not(.ant-radio-button-wrapper-disabled) {
        background-color: ${(props) => palette(props.type || 'themecolor', 0)};
        border-color: ${(props) => palette(props.type || 'themecolor', 0)};

        &:hover {
          background-color: ${(props) => palette(props.type || 'themecolor', 0)};
          border-color: ${(props) => palette(props.type || 'themecolor', 0)};
        }
      }
    }
    :focus {
      outline: none;
    }
  }
`;

export default AntRadiobox;
