import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@iso/components/uielements/button';
import notification from '@iso/components/Notification';
import actions from '@iso/redux/chat/actions';
import HappyIcon from '@iso/assets/images/happy.svg';
import AttachIcon from '@iso/assets/images/attach.svg';
import MapIcon from '@iso/assets/images/map.svg';
import { ComposeMessageWrapper, Textarea } from './Messages.styles';
import Input from '@iso/components/uielements/input';
const { sendMessage } = actions;

export default function ComposeMessage(props) {
  const dispatch = useDispatch();

  const [value, setValue] = React.useState('');
  const onChange = (event) => {
    setValue(event.target.value);
  };
  const onKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (value && value.length > 0) {
        dispatch(sendMessage(value));
        setValue('');
      } else {
        notification('error', 'Please type something');
      }
    }
  };
  return (

    <ComposeMessageWrapper>
      <Input 
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        placeholder="Type your message"
        className="compose-message-input"
        prefix={<img src={HappyIcon} alt="Preview" className="compose-smile-icon"/>}
      />
      <Button 
        shape="circle"
        icon={
          <img src={AttachIcon} alt="Preview" className="user-add-btn"/>
        } 
        />

      <Button 
        shape="circle"
        icon={
          <img src={MapIcon} alt="Preview" className="user-add-btn"/>
        } 
        />
    </ComposeMessageWrapper>
  );
}
