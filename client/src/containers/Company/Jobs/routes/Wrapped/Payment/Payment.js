import React, { useEffect, useMemo, useState } from "react";
import { Card } from "antd";
import { useDispatch, useSelector } from "react-redux";
import WrappedJobPaymentWrapper, {
  CardBody,
  CardWrapper,
  StatusSpan,
  ChooseDownloadSelect,
  ChooseDownloadSelectOptions,
} from "./Payment.style";
import WrappedJobDetail from "./JobDetail";
import InvoiceDepartment from "./InvoiceDepartment";

import PreviewReports from "./PreviewReports";

import PayApproved from "./PayApproved";
import Input from "@iso/components/uielements/input";
import Button from "@iso/components/uielements/button";
import Checkbox from "@iso/components/uielements/checkbox";
import DownloadIcon from "@iso/components/icons/Download";
import { formatCurrency } from "@iso/lib/helpers/utility";
import notify from "@iso/lib/helpers/notify";
import { fetchJobInvoiceMemosRequest } from "@iso/redux/jobInvoice/actions";
import { downloadReportsRequest } from "@iso/redux/jobInvoice/actions";
import { fetchDownloadAllInvoiceAsZipRequest } from "@iso/redux/companyDocument/actions";
import _ from "lodash";
import { Row } from "antd";
import {
  InvoiceStatusSummaryStatus,
  PaymentSummaryStatus,
  getInvoiceStatusesList,
  getPaymentSummaryStatusesList,
  shortStatus,
} from "@iso/enums/invoice_producer_status";

import PaymentAlert from "./PaymentAlert";
import InvoiceProducerStatus from "@iso/enums/invoice_producer_status";
import { toggleWalletNotSetModal } from "../../../../../../redux/company/actions";
import ArchivedJobReminderModal from "./ArchivedJobReminderModal";
import { GlobalModalContext } from "../../../../../../components/GlobalModal/GlobalModalContext";
import { payApprovedInvoiceReset } from "../../../../../../redux/jobInvoice/actions";

const WrappedJobPayment = () => {
const { initGlobalModal } = React.useContext(GlobalModalContext);

  const dispatch = useDispatch();
  const { job } = useSelector((state) => state.ProducerJob);

  const {
    invoiceDepartments,
    invoiceMemos,
    payApproved: invoicePayApproved,
    downloadReports: { loading },
  } = useSelector((state) => state.JobInvoice);

  const { companyWallet } = useSelector((state) => state.Company);
  const [payApproved, setPayApproved] = useState({
    visible: false,
    departments: null,
    memos: null,
  });

  const [archiveModalOpen, setArchiveModal] = useState(false);
  const [visiblePayApprovedModal, setVisiblePayApprovedModal] = useState(false);
  const [isPreviewAllReports, setIsPreviewAllReports] = useState(false);
  const [selected, makeSelection] = useState("Reports");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState(
    InvoiceStatusSummaryStatus.ALL
  );  
  const [invoiceStatues, setInvoiceStatues] = useState([]);
  const [payStatus, setPayStatues] = useState([]);

  useEffect(() => {
    if (job?.wrapAndPayType && job?.wrapAndPayType !== 3) {
      setInvoiceStatues(() => {
        const statusList = getInvoiceStatusesList();
        return statusList.map((s) => {
          s.count = invoiceMemos.filter(
            ({ invoice }) =>
              invoice?.invoiceStatus === s.status ||
              s.status === InvoiceStatusSummaryStatus.ALL
          ).length;
          return s;
        });
      });
    } 
      setPayStatues(() => {
        const statusList = getPaymentSummaryStatusesList();
        return statusList.map((s) => {
          s.count = invoiceMemos.filter(
            ({ invoice }) => invoice?.paymentStatus === s.status
          ).length;
          return s;
        });
      });
    
  }, [invoiceMemos]);

  const [selectedPositions, setSelectedPositions] = useState([]);

  useEffect(() => {
    dispatch(fetchJobInvoiceMemosRequest(job.id));
  }, [job]);

  const invoiceMemosByPosition = useMemo(() => {
    return _.groupBy(invoiceMemos, "jobRole");
  }, [invoiceMemos]);

  const invoiceSelectedPositions = useMemo(() => {
    return selectedPositions.reduce(
      (prev, p) => [...prev, ...invoiceMemosByPosition[p]],
      []
    );
  }, [selectedPositions, invoiceMemosByPosition]);

  const selectedMemoIDs = useMemo(() => {
    return selectedPositions
      .reduce((prev, p) => [...prev, ...invoiceMemosByPosition[p]], [])
      .map((_) => _?.id);
  }, [selectedPositions, invoiceMemosByPosition]);

  const approvedInvoices = useMemo(() => {
      return invoiceMemos.filter(
        (memo) =>
          memo?.invoice?.invoiceStatus ===
            InvoiceStatusSummaryStatus.APPROVED &&
          (memo?.invoice?.paymentStatus === null ||
            memo?.invoice?.paymentStatus === undefined ||
            (memo?.invoice?.paymentStatus &&
              ![
                PaymentSummaryStatus.PAYMENT_PROCESSING,
                PaymentSummaryStatus.PAYMENT_SENT,
              ].includes(memo?.invoice?.paymentStatus)))
      );
    return [];
  }, [invoiceMemos]);

  const onPositionSelect = (positions) => {
    setSelectedPositions(positions);
  };

  const onPositionSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedPositions(allPositions);
    } else {
      setSelectedPositions([]);
    }
  };

  const onPayApprovedClick = () => {
    if (!approvedInvoices.length) {
      if(job?.wrapAndPayType === 1){
        notify("error", "No Talent(s) members booked for this job.");
      } else {
        notify("error", "Not found any Approved invoice(s)");
      }
      return;
    }

    if (!invoiceSelectedPositions.length) {
      notify("error", "No Talent(s) has selected to get paid");
      return;
    }
    let approvedPositionsIds,
      approvedPositions = [];
    let approvedDepartments = [];

    approvedPositionsIds = approvedInvoices
      .filter((_) => selectedPositions.includes(_.jobRole))
      .map((iv) => iv?.jobRole);
    approvedPositions = approvedInvoices.filter((_) =>
      selectedPositions.includes(_.jobRole)
    );

    invoiceDepartments.map((department) => {
      const newJobRoles = department?.jobRoles.filter((jobRole) =>
        approvedPositionsIds.includes(jobRole?.id)
      );
      if (newJobRoles.length) {
        approvedDepartments.push({ ...department, jobRoles: newJobRoles });
      }
    });

    setPayApproved({
      visible: true,
      departments: approvedDepartments,
      memos: approvedPositions,
    });

    if (
      !companyWallet.loading &&
      (!companyWallet.wallet || companyWallet.wallet.length === 0)
    ) {
      dispatch(toggleWalletNotSetModal(true));
    } else {
      dispatch(payApprovedInvoiceReset());
      setVisiblePayApprovedModal(true);
    }
  };

  const handlePayApproved = (type, data) => {
    if (type === "close") {
      setVisiblePayApprovedModal(false);
      setPayApproved({ visible: false, departments: null, memos: null });
    }
  };

  const onInvoiceStatusClick = (status) => {
    setInvoiceStatusFilter(status);
  };

  const filteredInvoiceDepartments = useMemo(() => {
    const departments = [];
    if (invoiceDepartments && invoiceMemosByPosition) {
      invoiceDepartments.forEach((invoiceDept) => {
        const dept = _.cloneDeep(invoiceDept);

        if (dept?.jobRoles && dept?.jobRoles.length) {
          const jobRoles = [];
          dept.jobRoles.forEach((jobRole) => {
            const { id } = jobRole;
            const memo =
              invoiceMemosByPosition[id] && invoiceMemosByPosition[id][0];
            if (job?.wrapAndPayType && job?.wrapAndPayType !== 1) {
              if (
                memo &&
                memo?.invoice &&
                (invoiceStatusFilter === InvoiceStatusSummaryStatus.ALL ||
                  memo?.invoice?.invoiceStatus === invoiceStatusFilter) &&
                departments.findIndex((d) => d?.id === dept?.id) < 0
              ) {
                jobRoles.push(jobRole);
              }
            } else {
              jobRoles.push(jobRole);
            }
          });
          dept.jobRoles = jobRoles;
          if (jobRoles.length) {
            departments.push(dept);
          }
        }
      });
    }

    return departments;
  }, [invoiceStatusFilter, invoiceDepartments, invoiceMemosByPosition]);

  const allPositions = useMemo(() => {
    let all = [];
    filteredInvoiceDepartments.map((department) => {
      const ids = department?.jobRoles.map((jr) => jr.id);
      all = [...all, ...ids];
    });

    return _.uniq(all);
  }, [filteredInvoiceDepartments]);

  useEffect(() => {
    let newSelectedPositions = [];
    newSelectedPositions = invoiceMemos.map((department) => {
      if(department?.invoice?.paymentStatus !== 'Paid'){
        return department?.jobRole;
      }
      return null;
    }).filter(Boolean);
    setSelectedPositions(newSelectedPositions);
  }, [invoiceMemos]);

  const handleDownloadInvoice = () => {
    const { id, title } = job;
    dispatch(fetchDownloadAllInvoiceAsZipRequest(id, title, { invoiceMemoIds : selectedMemoIDs }));
  };

  const handleOnDownloadReport = async () => {
    if (job && Object.keys(job).length > 0) {
      dispatch(downloadReportsRequest(job?.id, { invoiceMemoIds : selectedMemoIDs }));
    }
  };

  useEffect(() => {
    setArchiveModal(false);
    if (
      (invoiceMemos.length > 0) &
      (paymentStatus && paymentStatus === "paid")
    ) {
      setArchiveModal(true);
    }
  }, [invoiceMemos, paymentStatus]);

  const paymentStatus = useMemo(() => {
    let paymentStatus;
    if (invoicePayApproved.error) {
      return "error";
    }

    if (invoicePayApproved.success) {
      paymentStatus = "processing";
    }

    if (invoiceMemos.length > 0) {
      let paidInvoicesCount = 0;
      let payProcessingInvoicesCount = 0;
      let payFailedInvoicesCount = 0;
      for (let invoiceMemo of invoiceMemos) {
        if (
          invoiceMemo?.invoice?.paymentStatus ===
          InvoiceProducerStatus.PAYMENT_SENT
        ) {
          ++paidInvoicesCount;
        } else if (
          invoiceMemo?.invoice?.paymentStatus ===
          InvoiceProducerStatus.PAYMENT_PROCESSING
        ) {
          ++payProcessingInvoicesCount;
        } else if (
          invoiceMemo?.invoice?.paymentStatus ===
          InvoiceProducerStatus.PAYMENT_FAILED
        ) {
          ++payFailedInvoicesCount;
        }
      }

      if (paidInvoicesCount > 0 && paidInvoicesCount === invoiceMemos.length) {
        paymentStatus = "paid";
      } else if (payProcessingInvoicesCount > 0) {
        paymentStatus = "processing";
      } else if (
        payFailedInvoicesCount > 0 &&
        paidInvoicesCount !== invoiceMemos.length
      ) {
        paymentStatus = "failed";
      }
    }

    return paymentStatus;
  }, [invoicePayApproved, invoiceMemos]);

  return (
    <WrappedJobPaymentWrapper>
      <WrappedJobDetail job={job} />
      <PaymentAlert canPayApproved={visiblePayApprovedModal} status={paymentStatus} selectedPosition={selectedPositions} memos={payApproved.memos} />
      {!!isPreviewAllReports && (
        <PreviewReports
          memoIds={selectedMemoIDs}
          selectedJob={job}
          visible={isPreviewAllReports}
          onCancel={() => setIsPreviewAllReports(false)}
        />
      )}
      <div
        className={`jobPaymentWrapper${
          job?.wrapAndPayType && job?.wrapAndPayType === 1
            ? " download-report-job-screen"
            : ""
        }`}
      >
        <div className="paymentActionButtons">
          <div className="left">
            <div className="d-flex">
              {/* {job?.wrapAndPayType && job?.wrapAndPayType !== 3 ? ( */}
                <Checkbox
                  className="checkbox"
                  color="#19913d"
                  checked={selectedPositions.length === allPositions.length}
                  onChange={onPositionSelectAll}
                />
              {/* ) : null} */}
              <div className="actionButtons">
                {job?.wrapAndPayType &&
                (job?.wrapAndPayType === 1 || job?.wrapAndPayType === 2) &&
                paymentStatus !== "paid" ? (
                  <Button
                    type="success"
                    shape="round"
                    onClick={onPayApprovedClick}
                    className="payApprovedBtn"
                  >
                    Pay Approved
                  </Button>
                ) : null}
                {(job?.wrapAndPayType && job?.wrapAndPayType === 2) ? (
                  <div className="download-select-outer">
                    <ChooseDownloadSelect
                      defaultValue={selected}
                      className="downloadBtn"
                      onChange={(e) => {
                        makeSelection(e);
                      }}
                    >
                      <ChooseDownloadSelectOptions value={"Reports"}>
                        Reports
                      </ChooseDownloadSelectOptions>
                      <ChooseDownloadSelectOptions value={"Invoices"}>
                        Invoices
                      </ChooseDownloadSelectOptions>
                    </ChooseDownloadSelect>
                    <div
                      className="download-icon"
                      onClick={() => {
                        if (selected === "Reports") handleOnDownloadReport();
                        else handleDownloadInvoice();
                      }}
                    >
                      <DownloadIcon
                        width={18}
                        height={19}
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                ) : null}
                {job?.wrapAndPayType && job?.wrapAndPayType === 1 ? (
                  <Button
                    shape="round"
                    className="downloadBtn"
                    style={{
                      backgroundColor: "#19913d",
                      color: "#FFF",
                    }}
                    onClick={handleOnDownloadReport}
                    loading={loading}
                  >
                    Download Reports
                    {
                      <DownloadIcon
                        width={18}
                        height={19}
                        stroke="#FFF"
                        strokeWidth={2}
                      />
                    }
                  </Button>
                ) : null}
                <Button
                  shape="round"
                  className="downloadBtn"
                  onClick={() => {
                    if (invoiceMemos && invoiceMemos.length === 0) {
                      initGlobalModal({
                        type: 'ERROR',
                        title: "No Talent members booked for this job.",
                        primaryText: "Cancel",
                        description: null,
                        visible: true,
                        onPrimary: () => {},
                      });
                    } else {
                      setIsPreviewAllReports(true);
                    }
                  }}
                >
                  Preview Reports
                </Button>
              </div>
            </div>
            {/* {job?.wrapAndPayType && job?.wrapAndPayType === 3 ? (
              <div className="crewActual">
                <div className="title-crew">
                  <label>Talent Actual</label>
                </div>
                <Input value={formatCurrency("$", job?.crewBudget)} />
              </div>
            ) : null} */}
          </div>
          {/* {job?.wrapAndPayType && job?.wrapAndPayType !== 3 ? ( */}
            <div className="right">
              <div className="crewActual">
                <div className="title-crew">
                  <label>Talent Actual</label>
                </div>
                <Input value={formatCurrency("$", job?.crewBudget)} />
              </div>
              {/* DON'T REMOVE --- we may need this in a future */}
              {/* <Button shape="round" className="jobDocumentBtn">Job Documents</Button> */}
            </div>
          {/* ) : null} */}
        </div>
        <Row span="24" className="paymentTableWrapper">
          <div className="paymentTable">
            {filteredInvoiceDepartments.map((department) => (
              <>
                <InvoiceDepartment
                  key={`invoice-memo-department-${department.id}`}
                  job={job}
                  department={department}
                  selectedPositions={selectedPositions}
                  memos={invoiceMemosByPosition}
                  onSelect={onPositionSelect}
                  opened={true}
                />
                {paymentStatus && paymentStatus === "paid" && (
                  <ArchivedJobReminderModal
                    visible={archiveModalOpen}
                    onCancel={() => setArchiveModal(false)}
                    job={job}
                  />
                )}
              </>
            ))}
          </div>
          <div className="summary">
          {job?.wrapAndPayType && job?.wrapAndPayType !== 1 ? (
              <CardWrapper>
                <Card bordered={false}>
                  <CardBody>
                    <h3>Invoice Status Summary</h3>
                    <ul>
                      {invoiceStatues.map(({ status, count, color }) => (
                        <li key={status}>
                          <a onClick={() => onInvoiceStatusClick(status)}>
                            <StatusSpan color={color} />
                            {status}
                            <strong>{count}</strong>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </CardWrapper>
            ) : null}
            {/* {job?.wrapAndPayType && (job?.wrapAndPayType === 1 || job?.wrapAndPayType === 3) ? ( */}
              <CardWrapper>
                <Card bordered={false}>
                  <CardBody>
                    <h3>Payment Summary</h3>
                    <ul>
                      {payStatus.map(({ status, count, color }) => (
                        <li key={status}>
                          <a style={{ cursor: "unset" }}>
                            <StatusSpan color={color} />
                            {shortStatus(status)}
                            <strong>{count}</strong>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </CardWrapper>
            {/* ) : null} */}
          </div>
        </Row>
        {payApproved.visible && (
          <PayApproved
            job={job}
            onCancel={() => {
              setVisiblePayApprovedModal(false);
              setPayApproved({
                visible: false,
                departments: null,
                memos: null,
              });
            }}
            departments={payApproved.departments}
            memos={payApproved.memos}
            setModalData={handlePayApproved}
            visiblePayApprovedModal={visiblePayApprovedModal}
            setVisiblePayApprovedModal={setVisiblePayApprovedModal}
          />
        )}
      </div>
    </WrappedJobPaymentWrapper>
  );
};

export default WrappedJobPayment;
