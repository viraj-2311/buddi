import styled from 'styled-components';
import { palette } from 'styled-theme';
// import Buttons from '@iso/components/uielements/button';
import Inputs from '@iso/components/uielements/input';
import { Textarea as Textareas } from '@iso/components/uielements/input';
import ReactDrawers from 'react-motion-drawer';
import { Button as Buttons } from 'antd';
import {
  borderRadius,
} from '@iso/lib/helpers/style_utils';
const Input = styled(Inputs)``;
const Textarea = styled(Textareas)``;
const ReactDrawer = styled(ReactDrawers)`
  width: 100%;
  background: #ffffff;
`;

const MessageSingle = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 15px 0;
  align-items: flex-start;
  flex-shrink: 0;

  @media only screen and (max-width: 767px) {
    margin: 10px 0;
  }

  &.loggedUser {
    justify-content: flex-end;
  }
  .messageGravatar {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    overflow: hidden;
    margin: 0px 20px;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .messageContent {
    display: flex;
    flex-direction: column;
    max-width: calc(100% - 110px);
    flex-shrink: 0;

    .messageContentText {
      position: relative;
      font-size: 14px;
      vertical-align: top;
      display: inline-block;
      padding: 11px 12px;
      ${'' /* overflow: hidden; */} word-break: break-word;

      p {
        margin: 0;
      }
    }
    .messageTime {
      font-size: 10px;
      color: #a1a0ae;
    }
    &.isUser {
      align-items: flex-end;
      .messageContentText {
        background: #3b86ff;
        color: #ffffff;
        border-radius: 20px 20px 0px 20px;
      }
      .messageTime {
        margin-left: auto;
      }
    }
    &.notUser {
      align-items: flex-start;

      .messageContentText {
        background: #f2f2f2;
        color: #333333;
        border-radius: 0 3px 3px 3px;
        border-radius: 20px 20px 20px 0;
      }
      .messageTime {
        margin-right: auto;
      }
    }
  }
`;
const ChatWindow = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  @media only screen and (max-width: 767px) {
    > div {
      width: 100%;
      max-width: 100%;
    }
  }
`;
const ChatBox = styled.div`
  width: calc(100% - 350px);
  background-color: #ffffff;
  border: 1px 0 0 2px solid ${palette('border', 0)};
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 767px) {
    border-left-width: 1px;
  }

  @media only screen and (min-width: 768px) and (max-width: 991px) {
    width: calc(100% - 280px);
  }
`;


const SidebarMessageTypeWrapper = styled.div`
  padding-bottom: 12px;
  background: #ffffff;
  display: flex;
  flex-shrink: 0;
  height: 100%;
  flex-direction: column;

  ${Input} {
    padding: 0;
    border: 0;

    &:focus {
      box-shadow: none;
    }
  }
`;

const ChatSidebar = styled.div`
  flex-shrink: 0;
  border: 1px solid ${palette('border', 0)};
  border-left: 0;
  border-right-width: 2px;
  border-bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

  ${Input} {
    padding: 0;
    border: 0;

    &:focus {
      box-shadow: none;
    }
  }

  .UserListsWrapper {
    .messageHelperText {
      background: #ffffff;
      height: 100%;
      padding: 0 !important;
    }
  }

  .ant-input-prefix {
    margin-right: 14px;
  }

  .ant-input-borderless {
    border: 0;
    font-size: 14px;

    &__placeholder {
      color : #828282;
    }
  }

  .ant-tabs.ant-tabs-top {
    height: 100%;

    .ant-tabs-nav {
      padding: 0 20px;
      margin-bottom: 0;

      &::before {
        border-bottom-width: 2px;
      }

      .ant-tabs-nav-list {
        width: 100%;

        .ant-tabs-tab {
          flex: 1;
          padding: 22px 0;
          margin: 0;
          justify-content: center;
          color: #bdbdbd;
          font-size: 14px;

          &.ant-tabs-tab-active {
            .ant-tabs-tab-btn {
              color: #333333;
            }
          }
        }

        .ant-tabs-ink-bar.ant-tabs-ink-bar-animated {
          height: 4px;
          background: #2f80ed;
        }
      }
    }

    .ant-tabs-content.ant-tabs-content-top {
      height: 100%;
    }
  }

  @media only screen and (min-width: 768px) and (max-width: 991px) {
    width: 280px;
  }
  @media only screen and (min-width: 992px) {
    width: 350px;
  }
`;

const Button = styled(Buttons)`
  width: calc(100% - 60px);
  margin-left: 30px;
  margin-top: 30px;
  span {
    &:last-child {
      span {
        background-color: #ffffff;
      }
    }
  }
`;

const ComposeMessageWrapper = styled.div`
  
  flex-shrink: 0;
  border-bottom: 0;
  padding: 0 30px 30px 20px;
  display: flex;

  .compose-message-input {
    padding: 10px 20px;
    background: #f2f2f2;
    border-radius: 23px;
    width: calc(100% - 130px);

    .ant-input-prefix {
      margin-right: 20px;
    }

    input {
      background: transparent;
      &::placeholder{
        color: #bdbdbd;
        font-size: 14px;
      }
    }
  }

  button {
    width: 45px !important;
    height: 45px !important;
    background: #f2f2f2;
    margin-left: 20px;
  }
`;
const ComposeInputWrapper = styled.div`
  background: #ffffff;
  height: 65vh;
  padding: 30px 30px 0;
  > div {
    margin-top: -8px;
    width: 100%;
    margin-left: 20px;
  }
`;

const UserListsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100% - 66px);
`;

const UserLists = styled.div`
  width: 100%;
  margin: 0;
  padding: 14px 20px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: start;
  -webkit-justify-content: flex-start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  -webkit-flex-shrink: 0;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  text-align: left;
  position: relative;
  margin: 0;
  margin-bottom: 3px;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.25s ease;
  background-color: #fff;

  * {
    box-sizing: border-box;
  }

  &:hover {
    background-color: ${palette('grayscale', 3)};
  }

  .userListsGravatar {
    width: 50px;
    margin: 0 15px 0 0;
    flex-shrink: 0;
    img {
      border-radius: 50%;
    }
  }
  .userListsContent {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .userInfoITime {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      p {
        font-size: 14px;
        margin: 0;
        font-weight: 600;
        color: #333333;
      }
  
      .userListsTime {
        color: #333333;
        font-size: 12px;
        flex-shrink: 0;
      }
    }

    .chatExcerpt {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      p {
        color: #333333;
        margin: 0;
        font-size: 14px;
        font-weight: 300;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        display: inline-block;
      }
    }
  }
`;

const ToggleViewProfile = styled.div`
  background: #ffffff;
  height: 65px;
  flex-shrink: 0;
  padding-left: 30px;
  display: flex;
  align-items: center;

  > span {
    font-size: 17px;
    color: ${palette('text', 0)};
    cursor: pointer;
  }

  @media only screen and (max-width: 767px) {
    padding-left: 20px;
  }

  .userGravatar {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    overflow: hidden;
    margin-right: 10px;
    position: relative;

    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .userActivity {
      width: 10px;
      height: 10px;
      display: block;
      background-color: ${palette('color', 3)};
      position: absolute;
      bottom: 0;
      right: 3px;
      border: 2px solid #ffffff;
      ${borderRadius('50%')};
    }
  }
  .userInfoButtons {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 50px);
    padding-right: 30px;

    .userInfo {
      display: flex;
      flex-direction: column;
  
      .userName {
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
  
      .userRole {
        font-size: 14px;
        color: #a1a0ae;
      }

      .teams-edit-btn {
        margin-left: 10px;
      }
    }
  
    .userActionButtons {
      button {
        width: 40px !important;
        height: 40px !important;
        background: #f2f2f2;
        margin-left: 20px;
      }
  
      .user-add-btn {
        width: 23px;
        height: 24px;
        transform: translateX(1px);
      }
    }
  }

  ${Button} {
    width: auto;
    padding: 0;
    border: 0;
    margin: 0;
    margin-right: 10px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:focus {
      box-shadow: none;
    }

    i {
      font-size: 12px;
      color: ${palette('text', 0)};
    }
  }
`;

const SidebarSearchBox = styled.div`
  padding: 15px 20px;
  background: #ffffff;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid ${palette('border', 2)};

  ${Input} {
    padding: 0;
    border: 0;

    &:focus {
      box-shadow: none;
    }
  }
`;


const MessageChatWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% - 136px);
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
  background: #ffffff;
  border-top: 2px solid ${palette('border', 0)};
  padding: 0 25px;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ChatViewWrapper = styled.div`
  height: 100%;

  @media only screen and (max-width: 767px) {
    padding: 0;
  }
`;

const MessageDialog = styled.div`
  h5 {
    font-size: 13px;
    color: ${palette('text', 0)};
    margin-bottom: 10px;
  }

  ${ComposeMessageWrapper} {
    background: #ffffff;
    flex-shrink: 0;
    border: 0;

    ${Textarea} {
      padding: 4px 10px;
      border: 2px solid ${palette('border', 0)};
      margin-bottom: 10px;

      &:focus {
        border-color: #4482ff;
        box-shadow: 0 0 0 2px rgba(68, 130, 255, 0.2);
      }
    }
  }
`;

const AddUserBtn = styled(Buttons)`
  && {
    padding: 0 12px;
    i {
      font-size: 17px;
      color: ${palette('text', 1)};
    }

    &:hover {
      i {
        color: inherit;
      }
    }
  }
`;

const Fieldset = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  font-size: 12px;
  color: ${palette('text', 0)};
  line-height: 1.5;
  font-weight: 400;
  padding: 0;
  margin: 0 0 5px;
`;

const Form = styled.div``;

export {
  MessageSingle,
  ChatWindow,
  ChatBox,
  ChatSidebar,
  Button,
  Input,
  Textarea,
  ComposeMessageWrapper,
  UserLists,
  UserListsWrapper,
  ToggleViewProfile,
  ComposeInputWrapper,
  SidebarSearchBox,
  SidebarMessageTypeWrapper,
  MessageChatWrapper,
  ChatViewWrapper,
  ReactDrawer,
  MessageDialog,
  AddUserBtn,
  Fieldset,
  Label,
  Form
};
