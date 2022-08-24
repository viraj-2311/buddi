import React, { useState, useEffect } from "react";
import Button from "@iso/components/uielements/button";
import MultiplyIcon from "@iso/components/icons/Multiply";
import GreenInfo from "@iso/assets/images/green_info.webp";

import { ArchivedJobReminderModalContainer } from "./ArchivedJobReminderModal.styles";
import { archiveJobRequest } from "@iso/redux/producerJob/actions";
import { showServerError } from "@iso/lib/helpers/utility";
import notify from "@iso/lib/helpers/notify";

import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";

const ArchivedJobReminderModal = ({ visible, onCancel, job }) => {
  const [action, setAction] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();

  const { archiveJob } = useSelector((state) => state.ProducerJob);

  useEffect(() => {
    if (!archiveJob.loading && !archiveJob.error && action === "archive") {
      notify("success", "Gig archived successfully");
      history.push("/jobs");
    }

    if (archiveJob.error && action === "archive") {
      notify("error", showServerError(archiveJob.error));
    }

    if (!archiveJob.loading && action === "archive") {
      setAction("");
    }
  }, [archiveJob]);

  const handleArchived = () => {
    setAction("archive");
    dispatch(archiveJobRequest(job?.id));
  };

  return (
    <ArchivedJobReminderModalContainer
      visible={visible}
      closable={false}
      onCancel={onCancel}
      wrapClassName="c-a-d-popup"
      footer={null}
    >
      <div className="modal-header">
        <Button
          type="link"
          className="closeBtn"
          onClick={onCancel}
        >
          <MultiplyIcon width={14} height={14} />
        </Button>
      </div>
      <div className="modal-inner">
        <img src={GreenInfo} alt="green-info-logo" />
        <h5>Successfully Paid All Crew Members</h5>

        <Button
          shape="round"
          type="primary"
          htmlType="submit"
          className="next-btn"
          onClick={handleArchived}
        >
          Archive this Job
        </Button>

        <Button
          shape="round"
          type="primary"
          htmlType="submit"
          className="exit-btn"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </ArchivedJobReminderModalContainer>
  );
};

export default ArchivedJobReminderModal;
