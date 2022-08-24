import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import PreviewReportsModalContainer from "./PreviewReports.style";
import MultiplyIcon from "@iso/components/icons/Multiply";
import Loader from "@iso/components/utility/loader";
import { formatCurrency } from "@iso/lib/helpers/utility";

import {
  LeftOutlined,
  VerticalRightOutlined,
  VerticalLeftOutlined,
  RightOutlined,
} from "@ant-design/icons";

import Button from "@iso/components/uielements/button";
import { Row, Col } from "antd";
import Logo from "@iso/assets/images/Prod_Logo_White.webp";
import LogoBlack from "@iso/assets/images/logo-black.webp";
import {
  fetchReportsRequest,
  downloadReportsRequest,
} from "@iso/redux/jobInvoice/actions";
import { usePagination } from "../../../../../../../library/hooks/usePagination";

const PreviewReports = ({ visible, onCancel, selectedJob, memoIds }) => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [crews, setCrews] = useState([]);
  const [siblingCount, setSiblingCount] = useState(1);
  const [pageSize] = useState(7);

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  const {
    downloadReports: { loading },
  } = useSelector((state) => state.JobInvoice);
  const { fetchedReports, fetchReports } = useSelector(
    (state) => state.JobInvoice
  );

  useEffect(() => {
    if (selectedJob && Object.keys(selectedJob).length > 0) {
      dispatch(fetchReportsRequest(selectedJob?.id, { invoiceMemoIds: memoIds }));
    }
  }, []);

  useEffect(() => {
    if (Object.keys(fetchedReports).length && fetchedReports?.crew) {
      setTotalCount(fetchedReports?.crew.length);
      setCrews(fetchedReports?.crew);
    }
  }, [fetchedReports]);

  const handleOnDownload = async () => {
    if (selectedJob && Object.keys(selectedJob).length > 0) {
      dispatch(downloadReportsRequest(selectedJob?.id, { invoiceMemoIds: memoIds }));
    }
  };

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return crews.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, crews]);

  if (fetchReports && fetchReports.loading) {
    return <Loader />;
  }

  let lastPage = paginationRange[paginationRange.length - 1];

  const onFirst = () => {
    setCurrentPage(1);
  };

  const onNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const onLast = () => {
    setCurrentPage(lastPage);
  };

  return (
    <PreviewReportsModalContainer
      visible={visible}
      closable={false}
      // width={width || 400}
      onCancel={onCancel}
      wrapClassName="preivew-report-modal"
      footer={null}
    >
      <div className="modal-content">
        <Row>
          <Col xxl={{ span: 20 }} span={18}>
            <div className="report-show-outer">
              <div className="report-header">
                <Row>
                  <Col span={16}>
                    <div className="logo-area">
                      <img src={Logo} height={35} />
                      <h3>Report</h3>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="right-address">
                      <h4>
                        {fetchedReports?.company &&
                        fetchedReports?.company?.title
                          ? fetchedReports?.company?.title
                          : "- -"}
                      </h4>
                      <p>
                        {fetchedReports?.company?.address
                          ? `${fetchedReports?.company?.address.trim()}${
                              fetchedReports?.company?.city.trim() ||
                              fetchedReports?.company?.state.trim() ||
                              fetchedReports?.company?.zipCode
                                ? ","
                                : ""
                            }`
                          : ""}
                        {` `}
                        {fetchedReports?.company?.city
                          ? `${fetchedReports?.company?.city.trim()}${
                              fetchedReports?.company?.state.trim() ||
                              fetchedReports?.company?.zipCode
                                ? ","
                                : ""
                            }`
                          : ""}
                        {` `}
                        {fetchedReports?.company?.state
                          ? `${fetchedReports?.company?.state.trim()}${
                              fetchedReports?.company?.zipCode ? "," : ""
                            }`
                          : ""}
                        {` `}
                        {fetchedReports?.company?.zipCode
                          ? `${fetchedReports?.company?.zipCode.trim()}`
                          : ""}
                        <br />
                        {fetchedReports?.company?.phone
                          ? `${fetchedReports?.company?.phone.trim()}`
                          : ""}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="job-info-outer">
                <table>
                  <tr>
                    <td className="job-name-td">
                      <table>
                        <tr>
                          <td>
                            Venue:{" "}
                            <span>
                              {fetchedReports?.title
                                ? fetchedReports?.title
                                : "- -"}
                            </span>
                          </td>
                          <td>
                            Band:{" "}
                            <span>
                              {fetchedReports?.client
                                ? fetchedReports?.client
                                : "- -"}
                            </span>
                          </td>
                          <td>
                            Event:{" "}
                            <span>
                              {fetchedReports?.agency
                                ? fetchedReports?.agency
                                : "- -"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Show Date(s):{" "}
                            <span>
                              {fetchedReports?.dates?.shootDatesString
                                ? fetchedReports?.dates?.shootDatesString
                                : "- -"}
                            </span>
                          </td>
                          <td>
                            Gig Number:{" "}
                            <span>
                              {fetchedReports?.jobNumber
                                ? fetchedReports?.jobNumber
                                : "- -"}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td className="crew-amount-td">
                      Talent Actual
                      <h5>{`${
                        fetchedReports?.crewAmount
                          ? `${formatCurrency("$", fetchedReports?.crewAmount)}`
                          : "- -"
                      }`}</h5>
                    </td>
                  </tr>
                </table>
              </div>
              <div className="report-main-table">
                <table>
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th>Talent Details</th>
                      <th>Union</th>
                      <th>Location</th>
                      <th>Dates Booked</th>
                      <th>Pay Terms</th>
                      <th>Type</th>
                      <th>Rate</th>
                      <th>Added Rate</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTableData?.length > 0
                      ? currentTableData.map((crewMember, keyIdx) => {
                          return (
                            <tr key={keyIdx}>
                              <td>
                                {crewMember?.position
                                  ? crewMember?.position
                                  : "- -"}
                              </td>
                              <td>
                                {!!crewMember?.fullName && (
                                  <span>{crewMember?.fullName || "- -"}</span>
                                )}
                                {!!crewMember?.email && (
                                  <span>{crewMember?.email || "- -"}</span>
                                )}
                              </td>
                              <td>{crewMember?.union !== "" ? 'Active' : '- -'}</td>
                              <td>
                                {crewMember?.city
                                  ? `${crewMember?.city.trim()}${
                                      crewMember?.state ? "," : ""
                                    }`
                                  : ""}
                                {` `}
                                {crewMember?.state
                                  ? `${crewMember?.state.trim()}`
                                  : ""}
                              </td>
                              <td>
                                {crewMember?.workingDays
                                  ? `(${crewMember?.workingDays})`
                                  : "- -"}
                                {` `}
                                {!!crewMember?.workingDays &&
                                crewMember?.workingDays > 1
                                  ? "days"
                                  : "day"}{" "}
                                |{" "}
                                {crewMember?.dates
                                  ? `${crewMember?.dates.trim()}`
                                  : "- -"}
                              </td>
                              <td>
                                NET{" "}
                                {crewMember?.state
                                  ? `- ${crewMember?.payTerms}`
                                  : "- -"}
                              </td>
                              <td>{crewMember?.priceType || "- -"}</td>
                              <td>
                                {crewMember?.priceType === "HOURLY" ? (
                                  <>
                                    {crewMember?.workingDays
                                        ? `${crewMember?.workingDays}`
                                        : "- -"}{" "}
                                      x{" "}
                                      {`${
                                        crewMember?.workingRate
                                          ? `${formatCurrency(
                                              "$",
                                              crewMember?.workingRate
                                            )}`
                                          : "- -"
                                      }`}
                                  </>
                                ) : (
                                  <>
                                    {`${
                                        crewMember?.projectRate
                                          ? `${formatCurrency(
                                              "$",
                                              crewMember?.projectRate
                                            )}`
                                          : "- -"
                                      }`}
                                  </>
                                )}
                              </td>
                              <td>
                                Kit Fee:{" "}
                                {`${
                                  crewMember?.kitFee
                                    ? `${formatCurrency(
                                        "$",
                                        crewMember?.kitFee
                                      )}`
                                    : "- -"
                                }`}
                                <br />
                                {crewMember?.rates &&
                                crewMember?.rates.length > 0
                                  ? crewMember?.rates.map((rate, keyIdx) => (
                                      <>
                                        <span>{`${rate?.title}: ${
                                          rate?.totalAmount
                                            ? `${formatCurrency(
                                                "$",
                                                rate?.totalAmount
                                              )}`
                                            : "- -"
                                        }`}</span>
                                      </>
                                    ))
                                  : null}
                              </td>
                              <td>
                                <b>{`${
                                  crewMember?.totalPrice
                                    ? `${formatCurrency(
                                        "$",
                                        crewMember?.totalPrice
                                      )}`
                                    : "- -"
                                }`}</b>{" "}
                              </td>
                            </tr>
                          );
                        })
                      : undefined}
                  </tbody>
                </table>
              </div>
              <div className="report-footer">
                <div className="footer-logo">
                  Power by
                  <img src={LogoBlack} height={20} />
                </div>
                <div className="footer-pagination">
                  Page{" "}
                  {lastPage > 1
                    ? `${currentPage}/${lastPage}`
                    : `${currentPage}`}
                </div>
              </div>
            </div>
          </Col>
          <Col xxl={{ span: 4 }} span={6}>
            <div className="report-right-outer">
              <div className="report-right-title">
                <h4>Reports Preview</h4>
                <div className="modal-header">
                  <Button type="link" className="closeBtn" onClick={onCancel}>
                    <MultiplyIcon width={14} height={14} />
                  </Button>
                </div>
              </div>
              {currentPage === 0 || lastPage < 2 ? undefined : (
                <div className="pagination-action">
                  <VerticalRightOutlined
                    className={`${currentPage === 1 ? "disabled" : ""}`}
                    onClick={onFirst}
                  />
                  <LeftOutlined
                    className={`${currentPage === 1 ? "disabled" : ""}`}
                    onClick={onPrevious}
                  />
                  <div className="page-number-box">
                    <p className="active">{currentPage}</p>/<p>{lastPage}</p>
                  </div>
                  <RightOutlined
                    className={`${currentPage === lastPage ? "disabled" : ""}`}
                    onClick={onNext}
                  />
                  <VerticalLeftOutlined
                    className={`${currentPage === lastPage ? "disabled" : ""}`}
                    onClick={onLast}
                  />
                </div>
              )}
              <Button
                shape="round"
                className="report-download-btn"
                loading={loading}
                onClick={handleOnDownload}
              >
                Download
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </PreviewReportsModalContainer>
  );
};

export default PreviewReports;
