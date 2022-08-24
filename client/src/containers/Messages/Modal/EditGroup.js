import React, {useEffect, useCallback, useRef, useState, useMemo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Typography } from 'antd';
import moment from 'moment';
import Select, { SelectOption } from '@iso/components/uielements/select';
import Button from '@iso/components/uielements/button';
import Input from '@iso/components/uielements/input';
import { InputField } from '@iso/components';
import basicStyle from '@iso/assets/styles/constants';
import GroupModalWrapper from './GroupModal.styles';
import { CloseOutlined } from '@ant-design/icons';
import Trash from '@iso/components/icons/Trash';
import EmptyAvatar from '@iso/assets/images/empty_avatar.jpg';
import { DateRangepicker } from '@iso/components/uielements/datePicker';
import { fetchLocationsRequest } from '@iso/redux/location/actions';
import Calendar from '@iso/components/icons/Calendar';
import { Form, Field, Formik } from "formik";
import ErrorComponent from '@iso/components/ErrorComponent';
import { dateFormat, displayDateFormat } from '@iso/config/datetime.config';
import _ from 'lodash';

const Option = SelectOption;

const EditGroup = ({ visible, handleCancel, job }) => {
  const dispatch = useDispatch();
  const { rowStyle, colStyle, gutter } = basicStyle;
  const { Title } = Typography;

  const formikRef = useRef();

  return (
    <GroupModalWrapper
      getContainer="#chat-window"
      title="People in Group"
      footer={null}
      visible={visible}
      wrapClassName="edit-group-modal"
      maskStyle={{position: "absolute"}}
      onCancel={handleCancel}
    >
      <Row style={rowStyle}>
      <Col md={24} sm={24} xs={24}>
        <Input 
          bordered={false} 
          placeholder="Search" 
          suffix={
          <CloseOutlined
            style={{
            color: "#bdbdbd",
            fontSize: '14px'
            }} 
          />}
          />
        </Col>
        <Col md={24} sm={24} xs={24}>
          <Row style={rowStyle} className="personList">
            <Col md={24} sm={24} xs={24} className="person">
              <div className="personAvatar">
                <img
                  alt="#"
                  src={EmptyAvatar}
                />
              </div>
              <div className="personButtons">
                <span className="personName">
                  Paul Amorese
                </span>
                <Button type="link" className="icon-trash">
                  <Trash width={15} height={17} fill="#828282"/>
                </Button>
              </div>
            </Col>
            <Col md={24} sm={24} xs={24} className="person">
              <div className="personAvatar">
                <img
                  alt="#"
                  src={EmptyAvatar}
                />
              </div>
              <div className="personButtons">
                <span className="personName">
                  Paul Graf
                </span>
                <Button type="link" className="icon-trash">
                  <Trash width={15} height={17} fill="#828282"/>
                </Button>
              </div>
            </Col>
            <Col md={24} sm={24} xs={24} className="person">
              <div className="personAvatar">
                <img
                  alt="#"
                  src={EmptyAvatar}
                />
              </div>
              <div className="personButtons">
                <span className="personName">
                  Chitwan
                </span>
                <Button type="link" className="icon-trash">
                  <Trash width={15} height={17} fill="#828282"/>
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </GroupModalWrapper>
  );
}

export default EditGroup;
