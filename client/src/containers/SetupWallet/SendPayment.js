import React, {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SendPaymentModal, {
  ActionWrapper,
  FooterWrapper,
} from './SendPayment.style';
import { Field, Form, Formik } from 'formik';
import Button from '@iso/components/uielements/button';
import { Row, Col } from 'antd';
import basicStyle from '@iso/assets/styles/constants';
import Input from '@iso/components/uielements/input';
import Spin from '@iso/components/uielements/spin';
import _ from 'lodash';
import {
  searchUserPayment,
  getRecentlySendPayment,
} from '@iso/redux/user/actions';
import notify from '@iso/lib/helpers/notify';
import EmptyAvatar from '@iso/assets/images/empty-profile.png';

const { rowStyle, gutter } = basicStyle;

export default ({
  visible,
  confirm,
  handleCancel,
  handleContinuePayment,
  title,
}) => {
  const dispatch = useDispatch();
  const { userReceivePayment, recentlyUserSendPayment } = useSelector(
    (state) => state.User
  );
  const [searchTextTimeout, setSearchTextTimeout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userSelected, setUserSelected] = useState({});
  const [userStringTyping, setUserString] = useState('');
  const [listUser, setListUser] = useState([]);
  const [allowSendPayment, setAllowSendPayment] = useState(false);

  useEffect(() => {
    dispatch(getRecentlySendPayment());
  }, []);

  useEffect(() => {
    if (
      !userReceivePayment.loading &&
      userReceivePayment.data &&
      userStringTyping.length > 0
    ) {
      setLoading(false);
      setLoading(false);
      setListUser(userReceivePayment.data);
    } else if (!userReceivePayment.loading && userReceivePayment.error) {
      setLoading(false);
      setAllowSendPayment(false);
      setUserSelected({});
      notify('error', JSON.stringify(userReceivePayment.error));
    }
  }, [userReceivePayment]);

  const setTypingValue = (value) => {
    setUserString(value);
    if (value.length > 2) {
      setLoading(true);
      setAllowSendPayment(false);
      setUserSelected({});
      clearTimeout(searchTextTimeout);
      setSearchTextTimeout(
        setTimeout(() => {
          dispatch(searchUserPayment(value));
        }, 1000)
      );
    } else {
      clearTimeout(searchTextTimeout);
      setLoading(false);
    }
  };

  const handleSelectUser = (index) => {
    let user = listUser[index];
    setUserSelected(user);
    setAllowSendPayment(true);
  };

  const selectRecentlyUserSend = (index) => {
    let user = recentlyUserSendPayment.data[index];
    if (user.silaUser && user.silaUser.id) {
      let userSelected = {
        companyId: null,
        email: user.silaUser.userInfo.email,
        id: user.silaUser.id,
        name: user.silaUser.firstName + ' ' + user.silaUser.lastName,
        profilePhotoS3Url: user.silaUser.userInfo.profilePhotoS3Url,
        type: null,
        userId: user.silaUser.userInfo.id,
      };
      setUserSelected(userSelected);
      setAllowSendPayment(true);
    }
  };

  const continuePayment = () => {
    let user = userSelected;
    handleContinuePayment(user);
    setUserSelected({});
    setAllowSendPayment(false);
    setListUser([]);
    setUserString('');
  };

  return (
    <SendPaymentModal
      title={title}
      visible={visible}
      width={700}
      footer={null}
      onCancel={handleCancel}
    >
      <div className='content'>
        <Row style={rowStyle} gutter={gutter} justify='start'>
          <Col md={24} sm={24} xs={24}>
            <span className='field-label required'>
              Name, User handle, email, or mobile
            </span>
            <Input
              className={allowSendPayment && 'highlight-user'}
              value={allowSendPayment ? userSelected.name : userStringTyping}
              onChange={(e) => setTypingValue(e.target.value)}
            />
          </Col>
          <div
            className={
              loading
                ? 'isoAutocompleteDropdown minHeight'
                : 'isoAutocompleteDropdown'
            }
          >
            {!allowSendPayment && (
              <Spin spinning={loading}>
                {listUser.map((user, index) => {
                  return (
                    <div
                      className='user-item'
                      onClick={() => handleSelectUser(index)}
                      key={index}
                    >
                      <span>{user.name + ' - ' + user.email}</span>
                    </div>
                  );
                })}
              </Spin>
            )}
          </div>
        </Row>
        <div>
          <ActionWrapper>
            <Button
              htmlType='button'
              shape='round'
              onClick={() => handleCancel()}
              className='buttonWrap'
            >
              Cancel
            </Button>
            <Button
              htmlType='submit'
              type='primary'
              shape='round'
              className={
                allowSendPayment ? 'buttonWrap' : 'buttonWrap disableButton'
              }
              onClick={() => continuePayment()}
              disabled={!allowSendPayment}
            >
              Next
            </Button>
          </ActionWrapper>
        </div>
        <div className='border-line' />
        <div className='title-contact'>Recent contacts</div>
        <div className='bottom-view'>
          <div className='contact-view'>
            {recentlyUserSendPayment.data &&
              recentlyUserSendPayment.data.map((user, i) => {
                return (
                  <div
                    className='detail-contact'
                    onClick={() => selectRecentlyUserSend(i)}
                    key={i}
                  >
                    <div className='avatar-icon'>
                      <img
                        src={
                          user.profilePhotoS3Url
                            ? user.profilePhotoS3Url
                            : EmptyAvatar
                        }
                        alt='Profile'
                      />
                    </div>
                    <div className='bank-title-view'>
                      <p>{user.nickname}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </SendPaymentModal>
  );
};
