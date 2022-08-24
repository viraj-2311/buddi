import styled from 'styled-components';
import { transition } from '@iso/lib/helpers/style_utils';

const RoleMembersItemWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  position: relative;
  overflow-x: auto;
  margin-left: 28px;
  margin-right: 28px;
  .business-member {
    justify-content: center;
    flex-direction: row;
    display: flex;
    font-size: 13px;
    text-align: center;
    margin: 30px 0;
    .account-icon {
      position: relative;
      padding: 22px;
      margin: auto;
      text-align: center;
      border-radius: 10px;
      background-color: #f48d3a;
    }
    .member-icon {
      position: relative;
      padding: 0;
      margin: auto;
      text-align: center;
      border-radius: 10px;
      background-color: #5c4d9f;
    }
    .desc-member {
      margin-left: 20px;
      text-align: left;
      span {
        padding-top: 5px;
        padding-bottom: 5px;
      }
    }
    .plus-icon {
      position: absolute;
      right: -11px;
      bottom: 0;
      border-radius: 11px;
      background-color: white;
      img {
        width: 20px;
        height: 20px;
        margin: 2px;
      }
    }
    .add-button {
      min-width: 80px;
      height: 30px;
      background-image: linear-gradient(to right, #6e52fc, #52a0f8);
      border: none;
      margin-top: 7px;
      align-self: center;
      span {
        font-size: 13px;
        padding: 5px;
        display: block;
      }
    }
  }
`;

export default RoleMembersItemWrapper;
