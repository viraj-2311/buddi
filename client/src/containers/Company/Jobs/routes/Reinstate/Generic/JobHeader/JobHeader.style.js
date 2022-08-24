import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDJobDetailWrapper = styled.div`
  display: flex;

  .header-top {
    width: 100%;
    padding: 25px 0 0 50px;
    border-bottom: solid 1px #b4b4c6;
    .ant-col {
      display: flex;
    }
  }
  .header-title {
    min-width: 130px;
    h1 {
      position: relative;
      font-size: 25px;
      font-weight: bold;
      color: #2f2e50;
      margin: 7px 0 0 0;

      a {
        position: absolute;
        left: -30px;
        top: -7px;
        color: #000000;
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }

    p {
      font-size: 15px;
      font-weight: normal;
      color: #2f2e50;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    justify-items: center;
    margin-left: auto;
    @media only screen and (max-width: 767px) {
      margin-bottom: 20px;
    }

    button.ant-btn {
      border-radius: 100px;
      font-size: 15px;
      font-weight: bold;
      font-family: OpenSans;
      cursor: pointer;
    }
    .reinstate-btn {
      background-color: rgba(81, 54, 154, 1);
      border-color: rgba(81, 54, 154, 1);
      color: #ffffff;
      &:hover {
        background-color: rgba(81, 54, 154, 0.8);
        border-color: rgba(81, 54, 154, 0.8);
      }
    }
    .header-right-text {
      margin-right: 30px;
      display: inline-block;
      strong {
        color: #2f2e50;
        font-size: 15px;
      }
      span {
        color: #2f2e50;
        font-weight: normal;
        font-size: 15px;
      }
    }
    .header-right-action {
      display: inline-block;
      margin-left: 18px;
      vertical-align: middle;
      a {
        color: #000000;
        svg {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
  .header-left {
    .badge {
      display: inline-block;
      min-width: auto;
      width: auto;
      max-width: 130px;
      height: 30px;
      padding: 4px 10px 5px 11px;
      background-color: #51369a;
      border-radius: 5px;
      color: #ffffff;
      font-size: 15px;
      font-weight: bold;
      text-transform: capitalize;
      &.archived {
        background-color: #868698;
      }
    }
  }
`;

export const JobHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 30px;
  h1 {
    margin: 0;
    display: flex;
    align-items: center;
    span {
      background-color: #e25656;
      font-size: 13px;
      color: #fff;
      border-radius: 50px;
      display: inline-block;
      padding: 3px 10px;
      margin-left: 20px;
    }
  }
`;

const JobDetailWrapper = WithDirection(WDJobDetailWrapper);

export default JobDetailWrapper;
