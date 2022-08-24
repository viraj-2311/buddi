import styled from 'styled-components';
import { palette } from 'styled-theme';

const HelpWrapper = styled.div`
  padding: 30px 40px;

  .ant-card {
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    border-radius: 10px;

    .ant-card-body {
      padding: 30px;
    }

    &.helpForm {
      .helpFormTitle {
        display: flex;
        svg {
          margin-right: 20px;
        }
      }

      @media only screen and (min-width: 992px) {
        width: calc(100% - 30px);
      }
    }
    &.helpDetail {
      .title {
        border-bottom: 1px solid #fff;
        padding-bottom: 30px;
      }
      background-color: ${palette('themecolor', 0)};
      margin-top: 30px;

      @media only screen and (min-width: 992px) {
        max-width: 320px;
        margin-top: 0;
      }
    }
  }

  .fieldLabel {
    font-size: 13px;
    color: ${palette('text', 7)};
  }

  input {
    &::-webkit-input-placeholder {
      color: ${palette('grayscale', 0)};
    }

    &:-moz-placeholder {
      color: ${palette('grayscale', 0)};
    }

    &::-moz-placeholder {
      color: ${palette('grayscale', 0)};
    }
    &:-ms-input-placeholder {
      color: ${palette('grayscale', 0)};
    }
  }
`;

const HelpFormWrapper = styled.div`
  .formGroup {
    margin-bottom: 30px;
  }
  textarea {
    border-radius: 5px;
    border: solid 1px #bcbccb;
    background-color: #fafbff;
    &:hover{
      border-color: #bcbccb;
    }
    &.disableResize {
      resize: none;
    }
  }
  textarea:focus {
    border-color: #f48d3a;
  }

  h2,
  p {
    color: ${palette('text', 5)};
  }

  h2 {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 30px;
    line-height: normal;
  }

  p {
    font-size: 15px;
    margin-bottom: 25px;
  }

  .actionRow {
    margin-top: 10px;

    button {
      min-width: 215px;
    }
  }
`;

const HelpDetailWrapper = styled.div`
  h2,
  p {
    color: ${palette('text', 11)};
  }

  h2 {
    font-size: 25px;
    font-weight: bold;
    line-height: normal;
  }

  .contactInformationList {
    .contactInformation {
      display: flex;
      margin-top: 30px;
      align-items: center;
      
      .contactIcon {
        display: flex;
      }
      .contactInformationInfo {
        overflow: hidden;
        margin-left: 20px;
        font-size: 15px;

        p {
          line-height: normal;
        }
      }
    }
  }
`;

export { HelpWrapper, HelpDetailWrapper, HelpFormWrapper };
