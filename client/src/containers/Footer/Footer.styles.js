import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const FooterWrapper = styled.div`
  width: 100%;
  height: 70px;
  min-height: 70px;
  background-color: white;
  flex-wrap: wrap;
  flex-direction: row;
  display: flex;
  border-top: 1px solid rgb(237, 237, 237);
  font-size: 13px;
  color: rgba(0, 0, 0, 0.85);
  @media only screen and (max-width: 767px) {
    min-height: 80px;
  }

  .footer {
    margin-left: 200px;
    width: calc(100% - 400px);
    /* background-color: blue; */
    justify-content: center;
    display: flex;
    align-items: center;
    min-width: 180px;
    padding-left: 30px;
    padding-right: 30px;
    @media only screen and (max-width: 767px) {
      margin-left: 0;
      padding-top: 10px;
      width: 100%;
    }
  }
  .term-of-service {
    flex: 1;
    min-width: 180px;
    justify-content: flex-end;
    display: flex;
    align-items: center;
    padding-right: 30px;
    span {
      color: #f48d3a;
    }
    @media only screen and (max-width: 767px) {
      padding-bottom: 10px;
      padding-right: 0;
      justify-content: center;
    }
  }
`;

export default WithDirection(FooterWrapper);
