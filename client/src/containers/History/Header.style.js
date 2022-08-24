import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDHeaderWrapper = styled.div`
  padding: 20px 40px;
  border-bottom: 1px solid #b4b4c6;
  background: #ffffff;

  .header-top {
    display: flex;
  }

  .header-title {
    min-width: 130px;
    h1 {
      position: relative;
      font-size: 25px;
      font-weight: bold;
      color: #2f2e50;
      margin: 7px 0 0 0;
    }

    p {
      font-size: 15px;
      font-weight: normal;
      color: #2f2e50;
    }
  }

  .header-left {
    display: flex;
    align-items: center;

    .statusBadge {
      height: 30px;
      padding: 5px 15px;
      border-radius: 5px;
      font-size: 15px;
      font-weight: bold;
      text-transform: capitalize;
      line-height: 1.36;
      margin-right: 10px;
      margin-top: 5px;
    }

    .goBackBtn {
      margin-right: 20px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-items: center;
    margin-left: auto;

    button.ant-btn {
      border-radius: 100px;
      font-size: 15px;
      font-weight: bold;
      font-family: OpenSans;
      cursor: pointer;
    }

    .header-right-text {
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
      vertical-align: middle;
    }
  }
`;

const HeaderWrapper = WithDirection(WDHeaderWrapper);

export default HeaderWrapper;
