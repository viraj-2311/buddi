import styled from 'styled-components';
import { palette } from 'styled-theme';

const ContractorJobMemoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .memoInfos {
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: row;
    padding: 20px 0;
    border-bottom: 1px solid #e8e8f1;
    @media only screen and (max-width: 520px) {
      flex-flow: wrap;
    }

    &:first-child {
      padding-top: 20px;
    }

    &:last-child {
      border-bottom: none;
    }

    .infoLabel {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      width: 200px;
      margin-right: 20px;
      @media only screen and (max-width: 520px) {
        width: 100%;
      }

      span {
        font-size: 15px;
        font-weight: bold;
        color: ${palette('text', 5)};
        margin-left: 20px;
      }
    }

    .infoDetails {
      text-align: left;
      @media only screen and (max-width: 520px) {
        margin-left: 40px;
      }
    }
  }

  h4 {
    display: inline-block;
    font-size: 15px;
    margin-left: 20px;
    font-weight: bold;
    color: #2f2e50;
  }
`;

const MessageDiv = styled.div`
  background:#f5ece4;
  padding: 20px 25px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: #2f2e50;
  padding: 20px 15px 20px 15px;
  p {
    color: #43425d;
    font-family: 'Open Sans',Roboto,sans-serif;
    font-size: 13px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: left;
  }

  p.modal-icon-wrapper {
    margin-right: 15px;
    > span {
      svg {
        height: 20px;
        width: 20px;
      }
    }
  }
`;

const W9AttachmentDiv = styled.div`
  button {
    width: 150px;
  }
  .attachmentItemList {
    display: inline-block;
    width: 100%;

    .attachmentItem {
      display: inline-block;
    }
  }
  .attachmentBox {
    display: flex;
    align-items: center;
    border: solid 1px #e8e8f1;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 15px;
    margin: 15px 0;
    position: relative;
    min-width: 278px;

    button {
      width: auto;
      margin: 3px 0 0 10px;
    }

    .attachmentDetails {
      color: #a2a2a9;
      flex: auto;
      display: flex;
      align-items: center;

      .rightDetail {
        display: flex;
        align-items: center;
        line-height: normal;
        a {
          font-weight: bold;
          color: #f48d3a;
          margin-right: 3px;
          font-size: 15px;
        }
        span {
          font-size: 15px;
        }
      }

      img {
        margin-right: 10px;
      }
    }

    .closeCircle {
      color: #9697a7;
    }
  }
`;

export default ContractorJobMemoWrapper;
export { MessageDiv, W9AttachmentDiv };
