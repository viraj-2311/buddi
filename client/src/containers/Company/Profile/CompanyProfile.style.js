import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

export const ErrorMessageDiv = styled.div`
  display: flex;
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  .cross-icon {
    font-size: 13px;
    align-self: center;
    margin: 0px 5px 1px 0px;
  }
`;

const CompanyProfileWrapper = styled.div`
  .width-limit {
    min-width: 220px;
    margin-top: 5px;
    margin-bottom: 20px;
    @media only screen and (max-width: 425px) {
      min-width: 280px;
    }
  }
  .width-selected-limit {
    min-width: 120px;
  }
  .settingsSectionCollapse {
    .settingsSectionPanel {
      margin-bottom: 30px;
      border: none;

      .ant-collapse-header {
        font-size: 18px;
      }
    }
  }

  .actionRow {
    button {
      min-width: 150px;
    }
  }

  .addBtn {
    color: ${palette('primary', 0)};
  }
  .infoCircle {
    color: ${palette("primary", 0)};
  }

  .add-more {
    margin-bottom: 10px;
    margin-top: 15px;
    .addBtn {
      color: ${palette("primary", 0)};
    }
  }

  .section {
    .sectionHead {
      font-size: 20px;
      font-weight: normal;
      color: #2f2e50;
    }
  }
  .closeCircle {
    color: #9697a7;
    margin-top: 28px;
  }

  .muted {
    font-size: 10px;
    color: #828282;

    &.align-right {
      text-align: right;
    }
  }

  .ant-collapse-borderless {
    background: none;
    margin-bottom: 40px;
    > .ant-collapse-item > .ant-collapse-header {
      padding: 24px 40px 16px 0px;
      font-size: 20px;
      .ant-collapse-arrow {
        left: auto;
        right: 0;
        svg {
          height: 16px;
          width: 16px;
          transform: rotate(90deg) !important;
        }
      }
    }

    > .ant-collapse-item-active > .ant-collapse-header .ant-collapse-arrow {
      svg {
        transform: rotate(-90deg) !important;
      }
    }
    .ant-collapse-content > .ant-collapse-content-box {
      /* padding-left: 0; */
      /* padding-right: 0; */
      padding: 0;
      .ant-input {
        border-radius: 5px;
        border: solid 1px #bcbccb;
        background-color: #fafbff;
      }
    }
  }
`;

export const FormWrapper = styled.div`
  margin-top: -20px;

  .disableResize {
    resize: none;
  }

  .infoText {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      margin-right: 5px;
    }
  }
  .infoTextrow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .infoMarginTop {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 5px;
  }

  .infoOneRow {
    margin-bottom: 30px;
    margin-top: 10px;
  }
`;

const CardWrapper = styled.div`
  .profileCard {
    border-radius: 10px;
    .ant-card-body {
      padding: 0;
    }
  }
  .headfieldLabel {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .headline {
    margin-bottom: 20px;
  }
  .width-limit-award {
    margin-bottom: 20px;
  }
  .infoCircle {
    margin-top: 0;
    color: ${palette("primary", 0)};
  }

  .profileImageInformationSection {
    margin-bottom: 30px;

    .sectionHead {
      font-size: 25px;
      font-weight: bold;
      color: #2f2e50;
    }
  }
  .width-limit-overview {
    min-width: 220px;
    margin-top: 20px;
    margin-bottom: 15px;
    @media only screen and (max-width: 425px) {
      min-width: 280px;
    }
  }
  .width-limit-year-found {
    margin-top: 20px;
    min-width: 210px;
  }

  .width-limit-past-client {
    margin-bottom: 20px;
    min-width: 210px;
  }

  .width-limit-specialties {
    margin-bottom: 20px;
  }

  .profileImageSection {
    margin-top: 35px;
  }
  .informationForm {
    margin-top: 18px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      left: -30px;
      right: -30px;
      height: 1px;
      background-color: #d9d9d9;
    }
    .actionRow {
      margin-top: 10px;
      button {
        min-width: 200px;
        margin-right: 10px;
        margin-bottom: 15px;
      }
    }
  }
`;

export { CardWrapper };
export default WithDirection(CompanyProfileWrapper);
