import styled from 'styled-components';
import { palette } from 'styled-theme';

export const PersonalNetworkContactsWrapper = styled.div`
   padding: 20px 40px;
  background: #f5f7fa;
`;

export const NoContactDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 40px 30px;
  margin-bottom: 30px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;
  .logo-view {
    justify-content: center;
    display: flex;
    text-align:center;
    @media only screen and (max-width: 767px) {
      margin-top: 30px;
      justify-content: center;
      display: flex;
    }
    img {
      width: 100%;
      max-width: 220px;
    }
  }

  .ant-row {
    align-items: center;
  }

  h2,
  h3 {
    font-size: 20px;
  }

  h2,
  h3,
  p {
    color: #2f2e50;
  }

  h2 {
    font-weight: bold;
    margin-bottom: 20px;
  }

  h3 {
    font-weight: normal;
    margin-bottom: 20px;
  }

  p {
    font-size: 15px;
    line-height: 1.33;
  }
`;

export const ContactListDiv = styled.div`
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;

  .contactHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 34px 35px;
  }

  h2,
  p {
    color: #2f2e50;
  }
  h2 {
    font-size: 25px;
    font-weight: bold;
  }
  p {
    font-size: 15px;
  }

  .searchSection {
    min-width: 290px;
    .ant-input-affix-wrapper {
      background-color: #fff;
    }
    .ant-input-prefix {
      margin-right: 6px;
    }
  }

  .contactListTitle {
    padding-right: 20px;
  }

  .contactListSortBy{
    display:flex;
    align-items: center;
    strong {
      color: #2f2e50;
      line-height: 1.5715;
      margin: 0 5px;
    }
    svg {
      position: relative;
      top: -2px;
    }
  }
  
  .contactBody {
    padding: 20px 35px;

    .contactListContent{
      .ant-spin {
        width: 100%;
        margin: 25px 0 20px;
      }
    }
    .contactListActionDiv {
      justify-content: flex-start;
      align-items: center;
      margin-left: 40px;
      display: flex;
      margin-bottom: 20px;

      .ant-checkbox-wrapper {
        .ant-checkbox {
          position: relative;
          top: -1px;

          &:after {
            display: none;
          }

          .ant-checkbox-inner {
            width: 18px;
            height: 18px;
            background-color: transparent;
            border: solid 2px #d9d9e2;
          }

          &.ant-checkbox-checked {
            .ant-checkbox-inner {
              background-color: #5c4da0;
              border-color: transparent;

              &:after {
                top: 6px;
                transform: none;
                height: 2px;
                width: 8px;
                background: white;
              }
            }
          }
        }
      }

      button {
        width: 184px;
        margin-right: 15px;
        font-size: 14px;
        color: ${palette('text', 5)};

        &.inviteBtn {
          margin-left: 22px;
          background-color: rgba(81, 54, 154, 1);
          border-color: rgba(81, 54, 154, 1);
          color: #ffffff;
          &:hover {
            background-color: rgba(81, 54, 154, 0.8);
            border-color: rgba(81, 54, 154, 0.8);
          }
        }
        &.removeBtn {
          background: #ff6565;
          border-color: #ff6565;
          color: #ffffff;
          margin-right: 0;
          &:hover {
            background-color: #f94d4d;
            border-color: #f94d4d;
            color: #fff;
          }
        }
      }
    }
    .infinite-scroll{
      min-height:100px;
      border-radius: 10px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
      border: solid 1px #e8e8f1;
      background-color: #ffffff;
      overflow: auto;
      padding: 0 20px 20px 40px;

      .isoEmptyComponent{
        padding-top: 30px;
      }
    }
  }

  .contactListContent{
    padding: 0;
  }
  .rightAction{
    text-align: right;
    padding-left: 20px;
    button {
      width: 100%;
      max-width: 290px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #5c4da0;
      border-color: #5c4da0;
      background: transparent;
      &:hover,&:focus {
        border-color: #5c4da0;
        color: #5c4da0;
      }
  }
`;

export const ContactWrapper = styled.div`
  border-top: solid 1px #e8e8f1;
  padding: 20px 0;

  &:first-child {
    border: transparent;
  }
`;

export const SavedContactsDiv = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0px 30px 0px;
  h3 {
    font-size: 20px;
    font-weight: bold;
    color: #2f2e50;
  }
  .contactSelect {
    margin-left: 20px;

    span.ant-select-selection-item {
      font-size: 15px;
      font-weight: bold;
      color: #2f2e50;
    }
  }
`;
