import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDCorporateNetworkHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  width: 100%;
  padding: 20px 40px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;

  .header-left {
    display: flex;
    align-items: center;
    position: relative;
    @media only screen and (max-width: 767px) {
      width: 100%;
    }

    h1 {
      font-size: 25px;
      font-weight: bold;
      color: #2f2e50;
      margin: 0;
    }
    span {
      background-color: #e25656;
      font-size: 13px;
      color: #fff;
      border-radius: 50px;
      padding: 0 10px;
      margin-left: 20px;
      height: 20px;
    }
  }
  .header-right {
    display: flex;
    align-items: center;
    justify-items: center;
    margin-left: auto;
    @media only screen and (max-width: 767px) {
      margin-top: 15px;
      justify-content: flex-start;
      flex: 1;
    }

    button.ant-btn {
      border-radius: 100px;
      font-size: 15px;
      cursor: pointer;
      line-height: 20px;
      padding: 0 30px;
      min-width: 196px;
      svg {
        margin-right: 10px;
        float: left;
      }
    }
  }
`;

const CorporateNetworkHeaderWrapper = WithDirection(
  WDCorporateNetworkHeaderWrapper
);

export default CorporateNetworkHeaderWrapper;
