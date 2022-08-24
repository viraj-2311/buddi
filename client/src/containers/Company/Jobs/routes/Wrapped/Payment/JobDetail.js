import React, { useState } from "react";
import WrappedJobDetailWrapper from "./JobDetail.style";
import Button from "@iso/components/uielements/button";
import Input from "@iso/components/uielements/input";
import { formatDateString } from "@iso/lib/helpers/utility";
import { displayDateFormat } from "@iso/config/datetime.config";

const WrappedJobDetail = ({ job }) => {
  return (
    <WrappedJobDetailWrapper>
      <div className="jobDateWrapper">
        <div className="jobDateText">
          <strong>Project Start date: </strong>
          <span>{formatDateString(job?.startDate, displayDateFormat)}</span>
        </div>
        <div className="jobDateText">
          <strong>Project End Date: </strong>
          <span>{formatDateString(job?.wrapDate, displayDateFormat)}</span>
        </div>
        <div className="jobDateText">
          <strong>Show Dates: </strong>
          <span>{job?.shootDatesString}</span>
        </div>
      </div>
    </WrappedJobDetailWrapper>
  );
};

export default WrappedJobDetail;
