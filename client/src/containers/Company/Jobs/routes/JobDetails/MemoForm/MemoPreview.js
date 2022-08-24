import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import Button from "@iso/components/uielements/button";
import Logo from "@iso/assets/images/Buddi-brand-Logo.webp";
import MultiplyIcon from "@iso/components/icons/Multiply";
import StyledMemoPreviewModal, {
  ActionWrapper,
  MemoBodyWrapper,
  TotalAmountContainer,
} from "./MemoPreview.style";
import { Col, Row } from "antd";
import Editor from "@iso/components/uielements/editor";
import CurrencyText from "@iso/components/utility/currencyText";
import useOnClickOutside from "@iso/lib/hooks/useOnClickOutside";
import {
  formatDateString,
  isSequenceDates,
  getMemoPriceWithAddRateExtraField,
} from "@iso/lib/helpers/utility";
import MemoTypes from "@iso/enums/memo_types";
import MemoCrewTypes from "@iso/enums/memo_crew_types";
import _ from "lodash";
import MemoPriceTypes from "@iso/enums/memo_price_types";

const MemoPreview = ({ visible, job, memo, setModalData, setEditData, canEdit }) => {
  const [title, setTitle] = useState("");
  const [editableHeadline, setEditableHeadline] = useState(false);
  const [headline, setHeadline] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const editorRef = useRef();

  useEffect(() => {
    if (!memo) return;

    setHeadline(memo.headline);
    if (memo?.isUnAnswered) {
      if (memo?.memoStaff === MemoCrewTypes.EMPLOYEE) {
        setTitle("Band Staff Hold Memo (Unanswered)");
      } else {
        setTitle("Hold Memo (Unanswered)");
      }

      return;
    }

    if (memo?.memoType === MemoTypes.DEAL) {
      if (memo?.memoStaff === MemoCrewTypes.EMPLOYEE) {
        setTitle("Band Staff Booking Memo");
      } else {
        setTitle("Booking Memo");
      }
    } else {
      if (memo?.memoStaff === MemoCrewTypes.EMPLOYEE) {
        setTitle("Band Staff Hold Memo");
      } else {
        setTitle("Hold Memo");
      }
    }
    setTotalAmount(getMemoPriceWithAddRateExtraField(memo));
  }, [memo]);

  const handleCancel = () => {
    setModalData("close");
  };

  const stringifyDates = (dates) => {
    if (isSequenceDates(dates)) {
      const minDate = _.min(dates);
      const maxDate = _.max(dates);

      return `${formatDateString(minDate, "MMM Do, YYYY")} - ${formatDateString(
        maxDate,
        "MMM Do, YYYY"
      )}`;
    } else {
      const dateStrings = dates.map((date) =>
        formatDateString(date, "MMM Do YYYY")
      );
      return dateStrings.join(", ");
    }
  };

  const superRoleUserName = (role, aliasRole) => {
    if (job[role] && job[role]?.id) {
      return job[role]?.fullName;
    }

    return job[aliasRole] || "N/A";
  };

  const onHeadlineEdit = () => {
    setEditableHeadline(true);
  };

  const handleStopEdit = () => {
    setEditableHeadline(false);
  };

  const updateEdit = () => {
    setEditableHeadline(false);
    setEditData("headline", headline);
  };

  const onViewMemoClick = () => {
    setModalData("update", headline);
  };

  const onSendMemoClick = () => {
    setModalData("send", headline);
  };

  useOnClickOutside(editorRef, updateEdit);

  if (!memo) {
    return null;
  }
  return (
    <StyledMemoPreviewModal
      visible={visible}
      title={`Talent ${title} - Preview`}
      closeIcon={<MultiplyIcon width={14} height={14} />}
      width={950}
      footer={
        <ActionWrapper>
          <Button htmlType="button" shape="round" onClick={handleCancel}>
            Exit Preview
          </Button>

          {/* <Button
            htmlType="submit"
            type="primary"
            shape="round"
            loading={action === 'save'}
            onClick={onSendMemoClick}
          >
            Send
          </Button> */}
        </ActionWrapper>
      }
      onCancel={handleCancel}
    >
      <MemoBodyWrapper>
        <div className="logoWrapper">
          <img src={Logo} height="50px" />
        </div>
        <div className="memoInfoWrapper">
          <h2 className="title">{title}</h2>
          <Row>
            <Col span={24}>
              {editableHeadline ? (
                <div className="headlineEditorWrapper" ref={editorRef}>
                  <div>
                  <Editor
                    onChange={(html) => setHeadline(html)}
                    value={headline}
                    modules={{
                      toolbar: [
                        ["bold", "italic", "underline", "strike"],
                        [
                          { list: "ordered" },
                          { list: "bullet" },
                          { indent: "-1" },
                          { indent: "+1" },
                        ],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                  />
                  </div>
                  <div>
                    <Button
                      type="link"
                      className="emailUpdateBtn"
                      onClick={updateEdit}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="headlineWrapper">
                  <div className="editor-preview-container" dangerouslySetInnerHTML={{ __html: headline }} />
                  {canEdit && (
                    <Button
                      type="link"
                      className="emailEditBtn"
                      onClick={onHeadlineEdit}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              )}

              <Row className="memoDetail">
                <Col span={8}>Band Name:</Col>
                <Col span={16}>{memo?.client}</Col>
              </Row>
              <Row className="memoDetail">
                <Col span={8}>Position:</Col>
                <Col span={16}>{memo?.position}</Col>
              </Row>
              <Row className="memoDetail">
                <Col span={8}>Dates:</Col>
                <Col span={16}>{stringifyDates(memo?.shootDates)}</Col>
              </Row>
              <Row className="memoDetail">
                <Col span={8}>Show Location - City:</Col>
                <Col span={16}>{memo?.city}</Col>
              </Row>
              <Row className="memoDetail">
                <Col span={8}>State:</Col>
                <Col span={16}>{memo?.state}</Col>
              </Row>
              {memo?.priceType === MemoPriceTypes.HOURLY && (
                <Row className="memoDetail">
                  <Col span={8}>Show Time:</Col>
                  <Col span={16}>{memo?.setTime}</Col>
                </Row>
              )}
              {memo?.priceType === MemoPriceTypes.HOURLY && (
                <Row className="memoDetail">
                  <Col span={8}>Working Days:</Col>
                  <Col span={16}>{memo?.workingDays}</Col>
                </Row>
              )}
              {memo?.priceType === MemoPriceTypes.HOURLY && (
                <Row className="memoDetail">
                  <Col span={8}>Day Rate:</Col>
                  <Col span={16}>
                    <CurrencyText value={memo?.workingRate} />
                  </Col>
                </Row>
              )}
              {memo?.priceType === MemoPriceTypes.FIXED && (
                <Row className="memoDetail">
                  <Col span={8}>Project Rate:</Col>
                  <Col span={16}>
                    <CurrencyText value={memo?.projectRate} />
                  </Col>
                </Row>
              )}
              <Row className="memoDetail">
                <Col span={8}>Soundcheck Time:</Col>
                <Col span={16}>{memo?.soundCheckTime}</Col>
              </Row>
              {/* <Row className="memoDetail">
                <Col span={8}>Payment Schedule:</Col>
                <Col span={16}>September 16, 2021</Col>
              </Row> */}

              {memo?.rates &&
                memo?.rates.map(
                  ({
                    id,
                    title,
                    priceType,
                    dayRate,
                    numberOfDays,
                    projectRate,
                  }) => (
                    <Row className="memoDetail" key={id}>
                      <Col span={8}>{title}:</Col>
                      <Col span={16}>
                        <CurrencyText
                          value={
                            priceType === MemoPriceTypes.FIXED
                              ? projectRate
                              : dayRate
                          }
                        />
                        {priceType === MemoPriceTypes.HOURLY && (
                          <span className="paymentWorkingDay">{` x ${numberOfDays}`}</span>
                        )}
                      </Col>
                    </Row>
                  )
                )}

              <div className="breakSection"></div>

              <Row className="memoDetail">
                <Col span={8}>Band Leader:</Col>
                <Col span={16}>
                  {superRoleUserName("execProducer", "execProducerName")}
                </Col>
              </Row>
              <Row className="memoDetail">
                <Col span={8}>2nd Band Leader:</Col>
                <Col span={16}>
                  {superRoleUserName("director", "directorName")}
                </Col>
              </Row>
              <Row className="memoDetail">
                <Col span={8}>3rd Band Leader:</Col>
                <Col span={16}>
                  {superRoleUserName("lineProducer", "lineProducerName")}
                </Col>
              </Row>

              <TotalAmountContainer>
                <div>Total:&nbsp;</div>
                <div>${totalAmount}</div>
              </TotalAmountContainer>

              {/* {canEdit && (
                <div className='viewMemoBtnWrapper'>
                  <Button
                    htmlType='submit'
                    type='primary'
                    shape='round'
                    onClick={onViewMemoClick}
                  >
                    View Memo
                  </Button>
                </div>
              )} */}
            </Col>
          </Row>
        </div>
      </MemoBodyWrapper>
    </StyledMemoPreviewModal>
  );
};

MemoPreview.propTypes = {
  visible: PropTypes.bool,
  job: PropTypes.object,
  memo: PropTypes.object,
  setModalData: PropTypes.func,
  setEditData: PropTypes.func,
  canEdit: PropTypes.bool,
};

MemoPreview.defaultProps = {
  visible: false,
  job: null,
  memo: null,
  setModalData: () => { },
  setEditData: () => { },
  canEdit: true,
};

export default MemoPreview;
