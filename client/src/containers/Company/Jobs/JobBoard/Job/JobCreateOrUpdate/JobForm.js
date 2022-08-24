import React, { useState } from "react";
import styled from "styled-components";
import { Form, Field } from "formik";
import { Row, Col, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Button from "@iso/components/uielements/button";
import InputField from "@iso/components/InputField";
import DatePicker from "@iso/components/uielements/datePicker";
import Timepicker from "@iso/components/uielements/timePicker";

import CalendarIcon from "@iso/components/icons/Calendar";
import {
  stringToDate,
  formatDateString,
  formatTimeString,
  stringToTime,
} from "@iso/lib/helpers/utility";
import { displayDateFormat } from "@iso/config/datetime.config";
import basicStyle from "@iso/assets/styles/constants";
import _ from "lodash";
import moment from "moment";

const { rowStyle } = basicStyle;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 2px solid #b4b4c6;
  margin-top: 20px;
  padding-top: 40px;

  button {
    margin-left: 20px;
  }
`;

export default ({
  values,
  errors,
  touched,
  setFieldValue,
  users,
  action,
  onCancel,
  loading,
  setErrors
}) => {
  const isEditMode = values && values.id;
  const [isFormSaveClick, setIsFormSaveClick] = useState(false);
  const execProducerName =
    values.execProducer && values.execProducer.id
      ? values.execProducer.fullName
      : values.execProducerName;
  const lineProducerName =
    values.lineProducer && values.lineProducer.id
      ? values.lineProducer.fullName
      : values.lineProducerName;
  const directorName =
    values.director && values.director.id
      ? values.director.fullName
      : values.directorName;

  const renderItem = (user, isHighlighted) => (
    <div
      key={`user_${user.value}`}
      className={`ant-select-item ant-select-item-option userDropdownItemWithAvatar ${
        isHighlighted ? "ant-select-item-option-active" : ""
      }`}
    >
      <div className="userAvatar">
        <img src={user.avatar} alt="User" />
      </div>
      <div className="userInfo">
        <h4>{user.label}</h4>
        {/* <div className='userStatus'>{user.isActive ? '' : 'Not Activated'}</div> */}
      </div>
    </div>
  );

  const shouldItemRender = (option, value) => {
    return (
      option.label &&
      option.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
    );
  };

  return (
    <Form>
      <Spin spinning={loading}>
        <Row gutter={30}>
          <Col md={24} xs={24}>
            <div className="formGroup">
              <label className="fieldLabel required">Band Name</label>
              <Field component={InputField} name="client" type="text" />
            </div>
          </Col>
          <Col md={24} xs={24}>
            <div className="formGroup">
              <label className="fieldLabel">Venue</label>
              <Field component={InputField} name="title" type="text" />
            </div>
          </Col>
          <Col md={24} xs={24}>
            <div className="formGroup">
              <label className="fieldLabel">
                Gig Number
              </label>
              <Field component={InputField} name="jobNumber" type="text" />
            </div>
          </Col>
          <Col md={24} xs={24}>
            <div className="formGroup">
              <label className="fieldLabel">
                Event Name - <i>Optional</i>
              </label>
              <Field name="agency" type="text" component={InputField} />
            </div>
          </Col>

          <Col md={12} xs={12}>
            <div className="formGroup">
              <label className="fieldLabel">Project Start date</label>
              <Field>
                {() => (
                  <DatePicker
                    allowClear={false}
                    name="startDate"
                    style={{ width: "100%" }}
                    value={stringToDate(values.startDate)}
                    disabledDate={(current) => {
                      return moment().add(-1, "days") >= current;
                    }}
                    onChange={(date) =>
                      setFieldValue("startDate", formatDateString(date))
                    }
                    suffixIcon={
                      <CalendarIcon width={22} height={22} fill="#bcbccb" />
                    }
                    format={displayDateFormat}
                    placeholder=""
                  />
                )}
              </Field>
              {touched.startDate && errors.startDate && (
                <div className="helper-text lowercase">{errors.startDate}</div>
              )}
            </div>
          </Col>

          <Col md={12} xs={12}>
            <div className="formGroup">
              <label className="fieldLabel">Project End Date</label>
              <Field>
                {() => (
                  <DatePicker
                    allowClear={false}
                    style={{ width: "100%" }}
                    name="wrapDate"
                    value={stringToDate(values.wrapDate)}
                    onChange={(date) =>
                      setFieldValue("wrapDate", formatDateString(date))
                    }
                    disabledDate={(current) => {
                      return moment().add(-1, "days") >= current;
                    }}
                    suffixIcon={
                      <CalendarIcon width={22} height={22} fill="#bcbccb" />
                    }
                    format={displayDateFormat}
                    placeholder=""
                  />
                )}
              </Field>
              {touched.wrapDate && errors.wrapDate && (
                <div className="helper-text lowercase">{errors.wrapDate}</div>
              )}
            </div>
          </Col>

          <Col md={12} xs={12}>
            <div className="formGroup">
              <label className="fieldLabel">Sound Check Time</label>
              <Field>
                {() => (
                  <Timepicker
                    format="hh:mm a"
                    use12Hours
                    className="w-100"
                    name="soundCheckTime"
                    Timepicker="fieldControl w-180"
                    allowClear={false}
                    placeholder="hh:mm a"
                    value={stringToTime(values.soundCheckTime, "hh:mm a")}
                    style={{ width: "100%" }}
                    onChange={(soundTime) =>
                      setFieldValue(
                        "soundCheckTime",
                        formatTimeString(soundTime, "hh:mm a")
                      )
                    }
                  />
                )}
              </Field>
              {touched.soundCheckTime && errors.soundCheckTime && (
                <div className="helper-text lowercase">
                  {errors.soundCheckTime}
                </div>
              )}
            </div>
          </Col>
          <Col md={12} xs={12}>
            <div className="formGroup">
              <label className="fieldLabel">Set Time</label>
              <Field>
                {() => (
                  <Timepicker
                    format="hh:mm a"
                    use12Hours
                    className="w-100"
                    name="setTime"
                    Timepicker='fieldControl w-180'
                    allowClear={false}
                    placeholder="hh:mm a"
                    value={stringToTime(values.setTime, "hh:mm a")}
                    style={{ width: '100%' }}
                    onChange={(time) =>
                      setFieldValue('setTime', formatTimeString(time, "hh:mm a"))
                    }
                  />
                )}
              </Field>
              {touched.setTime && errors.setTime && (
                <div className="helper-text lowercase">{errors.setTime}</div>
              )}
            </div>
          </Col>
        </Row>
        <ActionButtons className="job-create-action">
          <Button type="default" shape="round" onClick={() => {
            onCancel();
            setErrors({});
          }}>
            Cancel
          </Button>

          {values && values.id ? (
            <Button
              htmlType="submit"
              onClick={() => {
                setIsFormSaveClick(true);
                setErrors({});
              }}
              type="primary"
              shape="round"
              loading={action === "job_update"}
            >
              Save Gig
            </Button>
          ) : (
            <Button
              htmlType="submit"
              type="primary"
              shape="round"
              onClick={() => {
                setIsFormSaveClick(true);
                setErrors({});
              }}
              loading={action === "job_create"}
            >
              <PlusOutlined style={{ marginRight: 10 }} />
              Create New Gig
            </Button>
          )}
        </ActionButtons>
      </Spin>
    </Form>
  );
};
