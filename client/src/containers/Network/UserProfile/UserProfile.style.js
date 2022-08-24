import styled from 'styled-components';
import Modal from '@iso/components/Modal';
import { Row } from 'antd';
import { palette } from 'styled-theme';

const UserProfileModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 5px;
  }

  .ant-modal-header {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    .ant-row {
      align-items: center;
      .ant-col {
        padding: 20px;
        &.title-info {
          padding-left: 0;
        }
      }
    }
  }

  .ant-modal-close {
    top: 6px;
  }

  .ant-modal-body {
    /* padding: 0 30px 30px 10px; */
    padding: 0;
    .modal-icon-wrapper {
      margin-bottom: 10px;

      .anticon {
        font-size: 50px;
      }
    }

    h4 {
      font-size: 13px;
      font-weight: bold;
      color: #2f2e50;
    }

    .ant-tag {
      padding: 7px 18px 8px 19px;
      border-radius: 100px;
      background-color: #f5f7fa;
      font-size: 13px;
      font-weight: normal;
      text-align: center;
      color: #2f2e50;
      border: none;
      margin: 5px 10px 5px 0;
    }
  }

  .pressDetail {
    display: flex;
    flex-direction: column;

    a {
      padding-top: 10px;
      padding-bottom: 7px;
      font-size: 13px;
      text-decoration: underline;

      &:first-child {
        padding-top: 0;
      }
    }
  }

  .schoolDetails,
  .skillGroup {
    margin-top: 25px;
    &:first-child {
      margin-top: 0px;
    }

    &:last-child {
      margin-bottom: -5px;
    }
  }

  .schoolDetails {
    p {
      margin-bottom: 1px;
    }
    h4 {
      margin-bottom: 7px;
    }
  }

  .skillGroup {
    h4 {
      margin-bottom: 3px;
    }
  }

  .userAvatar {
    min-width: 150px;
    max-width: 150px;
    min-height: 150px;
    max-height: 150px;
    border-radius: 150px;
    overflow: hidden;
    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .userInfoWrapper {
    display: flex;

    /* .action {
      display: flex;
      padding-top: 60px;
      button {
        min-width: 110px;
        max-height: 38px;
        padding: 0 23px;
      }
      .viewBtn {
        background-color: rgba(81, 54, 154, 1);
        border-color: rgba(81, 54, 154, 1);
        color: #ffffff;
        margin-right: 15px;
        &:hover {
          background-color: rgba(81, 54, 154, 0.8);
          border-color: rgba(81, 54, 154, 0.8);
        }
      }
    } */

    .userInfo {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;

      h2,
      h4 {
        color: #2f2e50;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
      }

      h2 {
        font-size: 25px;
        font-weight: bold;
        margin: 0 0 4px;
        span {
          font-weight: normal;
        }
      }

      h4 {
        font-size: 15px;
        font-weight: normal;
      }

      p {
        font-size: 13px;
        font-weight: normal;
        color: #2f2e50;
        margin: 8px 0 0 0;

        a {
          color: #e17f08;
        }
        /* .vertical-line {
          &:after {
            content: '';
            height: 15px;
            width: 1px;
            background-color: #bcbccb;
            margin: 0px 10px 0 10px;
            display: inline-block;
            position: relative;
            top: 3px;
          }
        } */
      }

      .personRole {
        margin-bottom: 5px;
      }
      .contactInfo {
        color: #e17f08;
        font-size: 13px;
      }
    }
  }
`;

export const SectionRow = styled(Row)`
  flex-flow: row nowrap;
  .ant-col {
    padding: 29px 20px;
  }

  .info,
  .last-info {
    padding-left: 0;
  }

  .info {
    border-bottom: 1px solid #f0f0f7;
    &.swiper-slider {
      max-width: calc(100% - 202px);
      padding-right: 0;
    }
    .swiper-container {
      padding: 0 45px;
      max-width: 100%;
      &:before,
      &:after {
        content: '';
        position: absolute;
        width: 44px;
        height: 100%;
        left: 0;
        top: 0;
        background-color: #ffffff;
        z-index: 2;
      }
      &:after {
        left: auto;
        right: 0;
      }
      .swiper-button-next,
      .swiper-button-prev {
        color: #2f2e50;
        outline: none;
        left: 0;
        width: 18px;
        &:after {
          font-size: 26px;
          font-weight: 900;
        }
      }
      .swiper-button-next {
        left: auto;
        right: 0;
      }
      .swiper-slide {
        .ant-card {
          color: #2f2e50;
          padding: 25px 20px 30px 20px;
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
          border: solid 1px #e8e8f1;
          text-align: center;
          position: relative;
          overflow: hidden;
          &:before {
            content: '';
            position: absolute;
            width: 100%;
            height: 70px;
            top: 0;
            left: 0;
            z-index: 0;
            background-image: linear-gradient(
              to bottom,
              #2e2c6d,
              #5838a3 62%,
              #6b3dbc
            );
          }
          * {
            flex-wrap: wrap;
            padding: 0;
            justify-content: center;
          }
          .ant-card-body {
            position: relative;
          }
        }
      }
    }
  }
`;

export const UserProfileModalBodyWrapper = styled.div`
  .otherDetail {
    padding-left: 10px;
    padding-right: 30px;
  }
  .modalHeader {
    align-items: center;
    padding-left: 10px;
    padding-right: 8px;
    border-bottom: 1px solid #ddd;
  }

  h3 {
    font-size: 20px;
    font-weight: normal;
    line-height: 1.35;
    letter-spacing: normal;
    text-align: left;
    color: #2f2e50;
  }

  p {
    font-size: 13px;
    font-weight: normal;
    line-height: 1.54;
    letter-spacing: normal;
    text-align: left;
    color: #2f2e50;
  }
`;

export const NetworkConnectionCardWrapper = styled.div``;

export const HrBar = styled.div`
  height: 1px;
  background-color: #f3f5fd;
`;

export default UserProfileModal;
