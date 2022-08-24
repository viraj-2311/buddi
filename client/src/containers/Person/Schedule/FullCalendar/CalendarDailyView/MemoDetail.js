import React from 'react';
import CalendarMemoDetailWrapper from './MemoDetail.style';
import { formatTimeString, formatDateString } from '@iso/lib/helpers/utility';
import _ from 'lodash';

const CalendarDailyMemoDetail = ({ date, companyTitle, jobTitle, memos }) => {
  return (
    <CalendarMemoDetailWrapper>
      <div className="header">
        <h3 className="title">{companyTitle}</h3>
      </div>
      <div className="subTitle">{jobTitle}</div>
      <div className="memoDate"><strong>Date: </strong>{formatDateString(date, 'LL')}</div>
    </CalendarMemoDetailWrapper>
  );
};

export default CalendarDailyMemoDetail;
