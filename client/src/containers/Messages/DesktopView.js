import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatRooms from './ChatRooms';
import Messages from './Messages';
import ComposeMessage from './ComposeMessage';
import ViewProfile from '@iso/components/Chat/ViewProfile';
import InputName from '@iso/components/Chat/InputName';
import Loader from '@iso/components/utility/loader';
import Modal from '@iso/components/Feedback/Modal';
import AddUserIcon from '@iso/assets/images/add-user.svg';
import PenIcon from '@iso/assets/images/pen.svg';
import Button from '@iso/components/uielements/button';
import { Empty, Space, Row, Col } from 'antd';
import {
  ChatWindow,
  ChatBox,
  ToggleViewProfile,
  MessageDialog,
} from './Messages.styles';
import { resetDemoData } from './DemoDataImporter';
import EditGroup from "./Modal/EditGroup";
import AddMember from "./Modal/AddMember";
import { CloseOutlined } from '@ant-design/icons';
import chatActions from '@iso/redux/chat/actions';
const {
  toggleCompose,
  setComposedId,
  toggleViewProfile,
  chatInit,
} = chatActions;
export default function DesktopView({ className }) {
  const dispatch = useDispatch();
  const {
    loading,
    users,
    userId,
    openCompose,
    selectedChatRoom,
    viewProfile,
  } = useSelector(state => state.Chat);

  const [chatRole, setChatRole] =  React.useState('all');
  const [showEditGroupModal, setShowEditGroupModal] = React.useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = React.useState(false);

  const hideEditGroupPopup = () => {
    setShowEditGroupModal(false);
  };

  const hideAddMemberModal = () => {
    setShowAddMemberModal(false);
  };

  React.useEffect(() => {
    if (!users) {
      dispatch(chatInit(userId));
    }
    // resetDemoData();
  }, [userId]);

  if (loading) {
    return <Loader />;
  }
  return (
    <>
      <ChatWindow id="chat-window" className="ChatWindow">
        <ChatRooms setRole={setChatRole} />
        <ChatBox  style={{ height: '100%' }}>
          {selectedChatRoom && (
            <ToggleViewProfile>
              <div className="userGravatar">
                <img
                  alt="#"
                  src={selectedChatRoom.otherUserInfo.profileImageUrl}
                  onClick={() => {
                    // dispatch(toggleMobileProfile(true));
                    dispatch(toggleViewProfile(selectedChatRoom.otherUserInfo));
                  }}
                />
                <span className="userActivity online" />
              </div>
              <div className="userInfoButtons">
                {
                  chatRole === 'all' || chatRole === 'personal' ?
                  <div className="userInfo">
                      <span
                        className="userName"
                        onClick={() =>
                          dispatch(toggleViewProfile(selectedChatRoom.otherUserInfo))
                        }
                      >
                        {selectedChatRoom.otherUserInfo.name}
                      </span>
                      <span className="userRole">
                        Account Manager
                      </span>
                  </div> : 
                  chatRole === 'teams' ?
                  <div className="userInfo">
                    <span
                      className="userName"
                      onClick={() =>
                        dispatch(toggleViewProfile(selectedChatRoom.otherUserInfo))
                      }
                    >
                      Buddi Team 2020
                      <img src={PenIcon} alt="Preview" className="teams-edit-btn"/>
                    </span>
                    <span className="userRole" onClick={()=>setShowEditGroupModal(true)}>
                      3 People
                    </span>
                  </div>
                  : null
                }
                <div className="userActionButtons">
                  <Button 
                    shape="circle"
                    onClick={() => setShowAddMemberModal(true)}
                    icon={
                      <img src={AddUserIcon} alt="Preview" className="user-add-btn"/>
                    } 
                    />

                  <Button 
                    shape="circle"
                    icon={
                      <CloseOutlined style={{ fontSize: '16px', color: '#4f4f4f' }}/>
                    } 
                    />
                </div>
              </div>
            </ToggleViewProfile>
          )}
          <Messages />

          <ComposeMessage autosize={{ minRows: 2, maxRows: 6 }} />
        </ChatBox>
        {viewProfile !== false ? (
          <ViewProfile
            user={selectedChatRoom.otherUserInfo}
            toggleViewProfile={() => dispatch(toggleViewProfile())}
            viewProfile={viewProfile}
          />
        ) : null}
      </ChatWindow>
      { showEditGroupModal ? (
        <EditGroup visible={showEditGroupModal} handleCancel={hideEditGroupPopup}/>
      ) : null}

      { showAddMemberModal ? (
        <AddMember visible={showAddMemberModal} handleCancel={hideAddMemberModal}/>
      ) : null}
    </>
  );
}
