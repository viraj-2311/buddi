import React, { useState } from 'react';
import MessageModal, { ActionWrapper } from './Message.style';
import TextField from '@iso/components/TextField';
import { Tag } from 'antd';
import Button from '@iso/components/uielements/button';
import Editor from '@iso/components/uielements/editor';
import UserPic3 from '@iso/assets/images/user2.png';

export default ({ visible, handleCancel }) => {
  const [subject, setSubject] = useState('');

  const onSubjectChange = (event) => {
    setSubject(event.target.value);
  };
  return (
    <MessageModal
      title="Message"
      visible={visible}
      width={758}
      onCancel={handleCancel}
      footer={null}
    >
      <div className="content">
        <div className="title">
          <h3>To</h3>
          <Tag>
            <img src={UserPic3} alt="User" />
            <h4>Paul Amorese</h4>
          </Tag>
        </div>
        <div className="subject">
          <TextField
            onChange={onSubjectChange}
            value={subject}
            placeholder="Subject"
          />
        </div>
        <div className="message-editor">
          <Editor
            modules={{
              toolbar: [
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [
                  { list: 'ordered' },
                  { list: 'bullet' },
                  { indent: '-1' },
                  { indent: '+1' },
                ],
                ['link', 'image'],
              ],
            }}
          />
        </div>
        <ActionWrapper>
          <Button htmlType="submit" type="primary" shape="round">
            Send
          </Button>
          <Button
            className="default cancelBtn"
            shape="round"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </ActionWrapper>
      </div>
    </MessageModal>
  );
};
