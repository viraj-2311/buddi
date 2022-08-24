import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';
import WithDirection from '@iso/lib/helpers/rtl';

const CompanyAccountIntroWrapper = styled.div`
  max-width: 350px;
  color: #2f2e50;
  .intro-view {
    margin: 15px;
    margin-top: 10px;
    margin-right: 50px;
    @media (max-width: 424px) {
      margin: 0;
      margin-right: 40px;
    }
  }
  .titleIntro {
    font-size: 20px;
    font-weight: bold;
    .closeBtn {
      position: absolute;
      right: 20px;
      top: 30px;
    }
  }
  .description {
    font-size: 13px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .skipBtn {
    font-size: 15px;
    font-weight: normal;
    margin-bottom: 40px;
    @media (max-width: 424px) {
      margin-bottom: 50px;
    }
    span {
      text-decoration: underline;
    }
  }
  .intro-step {
    flex: 1;
    display: flex;
    flex-direction: row;
    padding-left: 15px;
    background-color: #43425d;
    position: absolute;
    left: 0px;
    bottom: 0px;
    right: 0px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;

    .enable-click {
      cursor: pointer;
    }

    .current-step {
      color: white;
      font-size: 15px;
      font-weight: bold;
      margin-right: 10px;
    }
    .steps-view {
      flex: 1;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 12px;
      padding-left: 15px;
      padding-right: 15px;
      @media (max-width: 424px) {
        padding-left: 0;
      }
    }
    .indicator {
      width: 10px;
      height: 10px;
      border: solid 2px #fff;
      margin-left: 10px;
      border-radius: 5px;
      margin-top: 2px;
      @media (max-width: 424px) {
        margin-left: 5px;
      }
    }
    .unselected {
      border: solid 1px #2f2e50;
      opacity: 0.3;
      background-color: #fff;
    }
  }
  .button-next {
    width: 120px;
    text-align: center;
    align-items: center;
    display: flex;
    justify-content: center;
    color: white;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    @media (max-width: 424px) {
      width: 90px;
    }
  }
`;

export const PopupOverlay = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
`;

export default WithDirection(CompanyAccountIntroWrapper);
