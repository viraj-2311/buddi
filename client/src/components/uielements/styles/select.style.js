import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition } from '@iso/lib/helpers/style_utils';

const AntSelect = (ComponentName) => styled(ComponentName)`
  &.ant-select {
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    color: ${palette('text', 1)};
    font-size: 14px;

    &.ant-select-single {
      .ant-select-selector {
        height: 50px;
        background-color: ${palette('background', 1)};
        border-radius: 5px;
        border: 1px solid ${palette('border', 8)};
        ${transition()};

        &:hover {
          border-color: ${palette('primary', 0)};
        }

        .ant-select-selection-item,
        .ant-select-selection-placeholder {
          line-height: 50px;
          opacity: 1;
        }

        .ant-select-selection-search-input {
          height: 50px;
        }
      }
    }

    &.ant-select-multiple {
      .ant-select-selector {
        min-height: 50px;
      }
    }

    .ant-select-arrow {
      color: ${palette('text', 5)};
      right: ${(props) => (props['data-rtl'] === 'rtl' ? 'inherit' : '7px')};
      left: ${(props) => (props['data-rtl'] === 'rtl' ? '7px' : 'inherit')};
    }

    &.ant-select-disabled {
      .ant-select-selector {
        background-color: ${palette('grayscale', 10)};
        color: ${palette('text', 9)};
        &:hover {
          border-color: #bcbccb;
        }
      }
      .ant-select-arrow {
        color: ${palette('text', 9)};
      }
    }
    &.ant-select-focused {
      .ant-select-selector {
        border-color: ${palette('primary', 0)};
        outline: 0;
        box-shadow: 0 0 0 2px ${palette('primary', 3)};
      }
    }

    &.ant-select-open {
      .ant-select-selection {
        border-color: ${palette('primary', 0)};
        outline: 0;
        box-shadow: 0 0 0 2px ${palette('primary', 3)};
      }
    }

    .ant-select-selection--multiple > ul > li,
    .ant-select-selection--multiple .ant-select-selection__rendered > ul > li {
      margin-top: 4px;
      height: 26px;
      line-height: 26px;
    }

    .ant-select-selection--multiple .ant-select-selection__choice {
      background-color: ${palette('grayscale', 4)};
      color: ${palette('text', 1)};
    }

    .ant-select-tree li a {
      font-size: 13px;
      color: ${palette('text', 1)};
    }
  }
`;

const AntSelectOption = (ComponentName) => styled(ComponentName)`
  color: #000000;
  .ant-select-dropdown-menu-item {
    color: ${palette('text', 1)};
  }
`;

export { AntSelect, AntSelectOption };
