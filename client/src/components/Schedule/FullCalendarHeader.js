import React, {useEffect, useMemo} from 'react';
import FullCalendarHeaderWrapper from './FullCalendarHeader.style';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { RadioGroup, RadioButton } from '@iso/components/uielements/radio';
import Button from '@iso/components/uielements/button';
import DownloadIcon from '@iso/components/icons/Download';
import { formatDateString } from '@iso/lib/helpers/utility';
import moment from 'moment';

const FullCalendarHeader = ({
  calendarDate, calendarView, scheduleView,
  onChangeDate, onChangeCalendarView, onChangeScheduleView
}) => {
  const dateByView = useMemo(() => {
    switch (calendarView) {
      case 'month':
        return formatDateString(calendarDate, 'MMMM YYYY');
      case 'week':
        const startDate = moment(calendarDate).startOf('week');
        const endDate = moment(calendarDate).endOf('week');
        return `${formatDateString(startDate, 'MMM Do')} - ${formatDateString(endDate, 'MMM Do, YYYY')}`;
      case 'day':
        return formatDateString(calendarDate, 'MMMM Do, YYYY');
    }
  }, [calendarDate, calendarView]);

  const handleChangeDate = (action) => {
    let newDate = calendarDate;
    if (action === 'prev') {
      newDate = moment(calendarDate).subtract(1, calendarView);
    } else if (action === 'next') {
      newDate = moment(calendarDate).add(1, calendarView);
    }

    onChangeDate(newDate.toDate());
  };

  const handleCalendarView  = (view) => {
    onChangeCalendarView(view);
  };

  const handleScheduleView = (view) => {
    onChangeScheduleView(view);
  };

  const onSetToday = () => {
    onChangeDate(new Date());
  };

  return (
    <FullCalendarHeaderWrapper>
      <div className="leftActionWrapper">
        {calendarView === 'day' && scheduleView
          ? (<RadioGroup value={scheduleView}>
              <RadioButton value="pre-pro" onClick={() => handleScheduleView('pre-pro')}>Pre-Pro</RadioButton>
              <RadioButton value="shoot" onClick={() => handleScheduleView('shoot')}>Shoot</RadioButton>
            </RadioGroup>)
          : <Button type="default" className="todayButton" onClick={onSetToday}>Today</Button>
        }
      </div>

      <div className="middleActionWrapper">
        <Button type="link" onClick={() => handleChangeDate('prev')}><LeftOutlined /></Button>
        <span className="label">{dateByView}</span>
        <Button type="link" onClick={() => handleChangeDate('next')}><RightOutlined /></Button>
      </div>

      <div className="extraActionWrapper">
        <Button type="link"><DownloadIcon width={20} height={20} fill="none" stroke="#4f4f4f"/></Button>
      </div>
      <div className="rightActionWrapper">
        <RadioGroup value={calendarView} className="calendarViewButton">
          <RadioButton value="day" onClick={() => handleCalendarView('day')}>Day</RadioButton>
          <RadioButton value="week" onClick={() => handleCalendarView('week')}>Week</RadioButton>
          <RadioButton value="month" onClick={() => handleCalendarView('month')}>Month</RadioButton>
        </RadioGroup>
      </div>


    </FullCalendarHeaderWrapper>
  );
};

export default FullCalendarHeader;
