import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDJobDetailWrapper = styled.div`
  display: flex;

  .header-top {
    width: 100%;
    padding: 10px 30px;
    border-bottom: solid 1px #b4b4c6;
    .ant-col {
      display: flex;
      padding: 0;
    }
    .ant-row {
      display: flex;
      margin: 0 !important;
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
  .archive-view {
    min-width: 215px;
    @media only screen and (max-width: 425px) {
      margin-top: 20px;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    justify-items: center;
    margin-left: auto;
    align-content: center;
    @media only screen and (max-width: 425px) {
      flex-wrap: wrap;
    }

    button.ant-btn {
      border-radius: 100px;
      font-size: 15px;
      font-weight: bold;
      font-family: OpenSans;
      cursor: pointer;
    }
    .archiveBtn {
      width: 190px;
      background-color: rgba(61, 63, 86, 1);
      border-color: rgba(61, 63, 86, 1);
      color: #ffffff;
      &:hover {
        background-color: rgba(61, 63, 86, 0.8);
        border-color: rgba(61, 63, 86, 0.8);
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
      min-width: 110px;
      width: auto;
      height: 30px;
      padding: 5px 10px;
      background-color: #19913d;
      border-radius: 5px;
      color: #fff;
      font-size: 15px;
      font-weight: bold;
      text-transform: capitalize;
      text-align: center;
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
