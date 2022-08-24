import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Scrollbars from '@iso/components/utility/customScrollBar';
import Tabs, { TabPane } from '@iso/components/uielements/tabs';
import Input from '@iso/components/uielements/input';
import HelperText from '@iso/components/utility/helper-text';
import chatActions from '@iso/redux/chat/actions';
import moment from 'moment';
import { timeDifference } from '@iso/lib/helpers/utility';
import { SearchOutlined } from '@ant-design/icons';
import {
  UserListsWrapper,
  UserLists,
  SidebarSearchBox,
  Input as InputStyleWrapper,
  ChatSidebar,
  SidebarMessageTypeWrapper
} from './Messages.styles';
const { setSelectedChatroom, toggleMobileList, toggleCompose } = chatActions;
function filteredChatRooms(chatrooms) {
  return chatrooms.filter(chatroom => chatroom.lastMessageTime > 0);
}
export default function ChatRooms({setRole}) {
  const dispatch = useDispatch();
  const { users, chatRooms, selectedChatRoom } = useSelector(
    state => state.Chat
  );
  const { view } = useSelector(state => state.App);
  const [currentChatRooms, setCurrentChatRooms] = React.useState(
    filteredChatRooms(chatRooms)
  );
  React.useEffect(() => {
    setCurrentChatRooms(filteredChatRooms(chatRooms));
  }, [chatRooms]);

  const currentChatRoom = view === 'DesktopView' ? selectedChatRoom : {};

  const onSearch = event => {
    const value = event.target.value;

    let searchedChatRooms = filteredChatRooms(chatRooms);
    if (value.trim()) {
      searchedChatRooms = searchedChatRooms.filter(chatRoom =>
        chatRoom.otherUserInfo.name.toLowerCase().includes(value.toLowerCase())
      );
    }
    setCurrentChatRooms(searchedChatRooms);
  };

  const callback = (key) => {
    setRole(key);
  };

  const singleChatRoom = (chatRoom, index) => {
    const { otherUserInfo, lastMessage, lastMessageTime } = chatRoom;
    const { name, profileImageUrl } = otherUserInfo;
    const selected = currentChatRoom.id === chatRoom.id;
    const style = {
      background: selected ? '#edf0f5' : 'rgba(0,0,0,0)',
    };
    const selectChatroom = event => {
      event.stopPropagation();

      if (!selected) {
        dispatch(setSelectedChatroom(chatRoom));
      }
      if (toggleMobileList) {
        dispatch(toggleMobileList(false));
      }
    };
    return (
      <UserLists key={index} style={style} onClick={selectChatroom}>
        <div className="userListsGravatar">
          <img
            alt="#"
            style={{ width: 45, height: 45 }}
            src={profileImageUrl}
          />
        </div>
        <div className="userListsContent">
          <div className="userInfoITime">
            <p>{name}</p>
            <span className="userListsTime">
              {timeDifference(lastMessageTime)}
            </span>
          </div>
          
          <div className="chatExcerpt">
            <p>{lastMessage}</p>
          </div>
        </div>
      </UserLists>
    );
  };
  return (
    <ChatSidebar>
      <SidebarMessageTypeWrapper>
        <Tabs defaultActiveKey="all" centered onChange={callback}>
          <TabPane tab="All" key="all">
            <SidebarSearchBox>
              <Input 
                bordered={false} 
                placeholder="Search Message or Name..." 
                prefix={
                <SearchOutlined 
                  style={{
                  color: "#bdbdbd"
                  }} 
                />}
              />
            </SidebarSearchBox>
            <UserListsWrapper>
              <Scrollbars style={{ height: '100%' }}>
                {currentChatRooms.length === 0 ? (
                  <HelperText text="No Conversation" className="messageHelperText" />
                ) : (
                  currentChatRooms.map(singleChatRoom)
                )}
              </Scrollbars>
            </UserListsWrapper>
          </TabPane>
          <TabPane tab="Teams" key="teams">
            <SidebarSearchBox>
              <Input 
                bordered={false} 
                placeholder="Search Message or Name..." 
                prefix={
                <SearchOutlined 
                  style={{
                  color: "#bdbdbd"
                  }} 
                />}
              />
            </SidebarSearchBox>
            <UserListsWrapper>
              <Scrollbars style={{ height: '100%' }}>
                {currentChatRooms.length === 0 ? (
                  <HelperText text="No Conversation" className="messageHelperText" />
                ) : (
                  currentChatRooms.map(singleChatRoom)
                )}
              </Scrollbars>
            </UserListsWrapper>
          </TabPane>
          <TabPane tab="Personal" key="personal">
            <SidebarSearchBox>
              <Input 
                bordered={false} 
                placeholder="Search Message or Name..." 
                prefix={
                <SearchOutlined 
                  style={{
                  color: "#bdbdbd"
                  }} 
                />}
              />
            </SidebarSearchBox>
            <UserListsWrapper>
              <Scrollbars style={{ height: '100%' }}>
                {currentChatRooms.length === 0 ? (
                  <HelperText text="No Conversation" className="messageHelperText" />
                ) : (
                  currentChatRooms.map(singleChatRoom)
                )}
              </Scrollbars>
            </UserListsWrapper>
          </TabPane>
        </Tabs>
      </SidebarMessageTypeWrapper>
    </ChatSidebar>
  );
}
