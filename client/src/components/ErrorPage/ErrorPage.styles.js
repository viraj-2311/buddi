import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';
import WithDirection from '@iso/lib/helpers/rtl';

const ErrorPageStyle = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  position: relative;

  @media only screen and (max-width: 767px) {
    width: 100%;
    flex-direction: column;
    flex-wrap: nowrap;
  }
`;
export const ErrorPageContentWrapperStyle = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  flex-direction: column;

  @media only screen and (max-width: 767px) {
    order: 2;
    margin-top: 20px;
    align-items: center;
    text-align: center;
    flex-direction: column;
    padding: 0 1rem;
  }

  h1 {
    font-size: 84px;
    font-weight: 700;
    color: ${palette('secondary', 2)};
    line-height: 1;
    margin: 0 0 25px;
  }

  h3 {
    font-size: 24px;
    font-weight: 400;
    color: ${palette('text', 1)};
    margin: 0 0 10px;
    line-height: 1.2;
  }

  p {
    font-size: 14px;
    font-weight: 400;
    color: ${palette('text', 3)};
    margin: 0 0 10px;
  }

  button {
    display: inline-block;
    margin-top: 15px;
    margin-bottom: 0;
    font-weight: 500;
    text-align: center;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 0;
    white-space: nowrap;
    line-height: 1.5;
    padding: 0 30px;
    font-size: 13px;
    flex-shrink: 0;
    height: 36px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
    color: #ffffff;
    background-color: ${palette('primary', 0)};
    ${transition()};
    ${borderRadius('18px')};

    a {
      width: 100%;
      height: 100%;
      color: #ffffff;
      text-decoration: none;
    }

    &:hover {
      background-color: ${palette('primary', 2)};

      a {
        text-decoration: none;
      }
    }

    &:focus {
      outline: 0;
      box-shadow: none;

      a {
        text-decoration: none;
      }
    }
  }
`;

export const ErrorPageImageWrapperStyle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) =>
    props['data-rtl'] === 'rtl' ? 'inherit' : '100px'};
  margin-right: ${(props) =>
    props['data-rtl'] === 'rtl' ? '100px' : 'inherti'};

  @media only screen and (max-width: 767px) {
    margin-left: ${(props) => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
    margin-right: ${(props) => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
  }

  img {
    max-height: 80vh;

    @media only screen and (max-width: 767px) {
      max-height: 335px;
    }
  }
`;

export default WithDirection(ErrorPageStyle);
