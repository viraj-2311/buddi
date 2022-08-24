import styled from 'styled-components';

const CloseCompanyAccountContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  height: 100%;

  .ant-card {
    height: 100%;
    border-radius: 10px;
  }

  .ant-card-body {
    padding: 30px;
  }

  color: #2f2e50;

  h2.sectionHead {
    font-size: 25px;
    font-weight: bold;
  }

  h3 {
    font-weight: bold;
  }

  h3,
  p {
    font-size: 15px;
  }

  p.note {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .inner-title-text {
    border-bottom: 1px solid #b4b4c6;
    padding-bottom: 20px;
    color: #2f2e50;
    margin-top: 10px;
  }
  .radio-list-outer {
    h5 {
      font-size: 15px;
      font-weight: bold;
      color: #2f2e50;
      margin: 20px 0;
    }
    label {
      display: flex;
      cursor: pointer;
      font-weight: 500;
      position: relative;
      overflow: hidden;
      margin-bottom: 10px;
      &:last-child {
        span {
          margin-bottom: 0;
        }
      }
      input {
        position: absolute;
        left: -9999px;
        &:checked + span {
          &:before {
            box-shadow: inset 0 0 0 0.4375em #2f2e50;
          }
        }
      }
      span {
        display: flex;
        align-items: center;
        border-radius: 5px;
        transition: 0.25s ease;
        margin-bottom: 5px;

        &:before {
          display: flex;
          flex-shrink: 0;
          content: '';
          background-color: #fff;
          width: 1.5em;
          height: 1.5em;
          border-radius: 50%;
          margin-right: 0.375em;
          transition: 0.25s ease;
          box-shadow: inset 0 0 0 0.125em #2f2e50;
        }
        .radio-content {
          padding-left: 20px;
          .title {
            font-size: 15px;
            color: #2f2e50;
            margin-bottom: 0px;
            font-weight: normal;
          }
        }
      }
    }
  }
  .note-input-box {
    border: 1px solid #bcbccb;
    background-color: #fafbff;
    resize: none;
    border-radius: 4px;
    width: 70%;
    display: block;
    @media screen and (max-width: 767px) {
      width: 100%;
    }
  }
  .next-btn {
    width: 158px;
    height: 54px;
    margin-top: 25px;
  }
  .disableBtn {
    opacity: 0.5;
  }
`;
export { CloseCompanyAccountContainer };
