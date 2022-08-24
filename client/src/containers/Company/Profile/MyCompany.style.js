import styled from "styled-components";
import Modal from "@iso/components/Modal";
import { Row } from "antd";

export const MyCompanyWrapper = styled.div`
  @media (min-width: 768px) {
    margin: 30px 40px;
  }
  margin: 20px;
  background: white;
  max-width: 1080px;

  h3,
  p,
  h4 {
    color: #2f2e50;
  }

  h4 {
    font-size: 13px;
    font-weight: bold;
  }

  h3 {
    font-size: 20px;
    font-weight: normal;
    line-height: 1.35;
    letter-spacing: normal;
    text-align: left;
  }

  p {
    font-size: 13px;
    font-weight: normal;
    line-height: 1.54;
    letter-spacing: normal;
    text-align: left;
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
    margin-right: 10px;
  }
    .font-tag {
    font-size: 13px;
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
  .tagGroup {
    margin-top: 25px;
    &:first-child {
      margin-top: 0px;
    }

    &:last-child {
      margin-bottom: -5px;
    }
  }
  .tagGroupnew {
    margin-top: 5px;
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
    .ant-tag {
      margin: 5px 10px 5px 0;
    }
  }
  .personRole {
    text-transform: lowercase;
  }
  .companyAddress {
    margin-top: 20px;
  }
  .user-avatar-wrapper {
    border-radius: 100px;
  }

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
      margin: 0 0 10px;
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
      margin: 10px 0 0 0;
      a {
        color: #e17f08;
      }
    }
  }
`;

export const MyCompanyTitle = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 10px 0 10px 10px;

  .ant-row {
    align-items: center;
    .ant-col {
      padding: 20px;
      &.title-info {
        padding-left: 0;
      }

      &.edit-info {
        align-self: start;
      }
    }
  }
  .user-avatar-wrapper {
    border-radius: 100px;
  }
`;

export const SectionRow = styled(Row)`
  flex-flow: row nowrap;
  padding-left: 10px;

  .ant-col {
    padding: 29px 20px;
  }
  .user-avatar-wrapper {
    border-radius: 100px;
  }

  .info,
  .last-info {
    padding-left: 0;
  }

  .info {
    border-bottom: 1px solid #f0f0f7;
  }

  .br-none {
    border: none;
  }

  .edit-data {
    padding-left: 2px;
  }
`;
