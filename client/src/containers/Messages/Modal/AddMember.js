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
import { CheckOutlined } from '@ant-design/icons';
import Trash from '@iso/components/icons/Trash';
import EmptyAvatar from '@iso/assets/images/empty_avatar.jpg';
import { Collapse } from 'antd';
import { dateFormat, displayDateFormat } from '@iso/config/datetime.config';
import _ from 'lodash';

const Option = SelectOption;

const AddMember = ({ visible, handleCancel, job }) => {
  const dispatch = useDispatch();
  const { rowStyle, colStyle, gutter } = basicStyle;
  const { Title } = Typography;
  const { Panel } = Collapse;

  const formikRef = useRef();

  return (
    <GroupModalWrapper
      getContainer="#chat-window"
      title={(
        <div className="modal-header">
          <div>Add to Group</div>
          <Button className="save-group-btn" type="primary">Save</Button>
        </div>
        )}
      footer={null}
      visible={visible}
      wrapClassName="add-member-modal"
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
        <Collapse defaultActiveKey={['add-select']} bordered={false} expandIconPosition="right">
          <Panel header="Add/Select Departments" key="add-select">
            <Col md={24} sm={24} xs={24}>
              <Row style={rowStyle} className="memberList">
                <div className="memberItem">
                  <img
                    alt="#"
                    className="memberAvatar"
                    src={EmptyAvatar}
                  />
                  <span className="userActivity online">
                    <CloseOutlined
                      style={{
                        color: "#fff",
                        fontSize: '7px',
                        fontWeight: 600
                      }} 
                    />
                  </span>
                  <span className="memberName">
                    Paul A
                  </span>
                </div>
                <div className="memberItem">
                  <img
                    alt="#"
                    className="memberAvatar"
                    src={EmptyAvatar}
                  />
                  <span className="userActivity online">
                    <CloseOutlined
                      style={{
                        color: "#fff",
                        fontSize: '7px',
                        fontWeight: 600
                      }} 
                    />
                  </span>
                  <span className="memberName">
                    Paul G
                  </span>
                </div>
                <div className="memberItem">
                  <img
                    alt="#"
                    className="memberAvatar"
                    src={EmptyAvatar}
                  />
                  <span className="userActivity online">
                    <CloseOutlined
                      style={{
                        color: "#fff",
                        fontSize: '7px',
                        fontWeight: 600
                      }} 
                    />
                  </span>
                  <span className="memberName">
                    Chitwan
                  </span>
                </div>
              </Row>
              <Row style={rowStyle} className="personList">
                <Col md={24} sm={24} xs={24} className="panel-header">
                  <div>Select</div>
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
                      Paul Amorese
                    </span>
                    <Button 
                      type="primary"
                      shape="circle"
                      className="confirm-btn active"
                      style={{
                        width: "20px",
                        minWidth: "20px",
                        height: "20px"
                      }}
                    >
                      <CheckOutlined 
                      style={{
                        fontSize: '10px'
                      }}
                      />
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
                    <Button shape="circle" className="confirm-btn" style={{
                        width: "20px",
                        minWidth: "20px",
                        height: "20px"
                      }}>
                      <div></div>
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
                    <Button shape="circle" className="confirm-btn" style={{
                        width: "20px",
                        minWidth: "20px",
                        height: "20px"
                      }}>
                    <div></div>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Panel>
        </Collapse>
        </Col>
        
      </Row>
    </GroupModalWrapper>
  );
}

export default AddMember;
