import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ContractorScheduleFullCalendarWrapper from './FullCalendar.style';
import FullCalendarHeader from '@iso/components/Schedule/FullCalendarHeader';
import {
  setContractorCalendarView,
  setContractorCalendarDate,
  fetchContractorEventNotesRequest,
  fetchContractorShootNotesRequest,
  fetchContractorHoldMemosRequest
} from '@iso/redux/contractorSchedule/actions';
import FullCalendarMonthlyView from './CalendarMonthlyView';
import FullCalendarWeeklyView from './CalendarWeeklyView';
import FullCalendarDailyView from './CalendarDailyView';
import Spin from '@iso/components/Schedule/Spin.style';
import { formatDateString } from '@iso/lib/helpers/utility';
import moment from 'moment';

const ContractorScheduleFullCalendar = () => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector(state => state.Auth);
  const { calendarView, calendarDate } = useSelector(state => state.ContractorSchedule);
  const {
    eventNotes, listEventNote: { loading: eventNotesLoading },
    shootNotes, listShootNote: { loading: shootNotesLoading },
    holdMemos, listHoldMemo: { loading: holdMemosLoading }
  } = useSelector(state => state.ContractorSchedule);

  const calendarLoading = useMemo(() => {
    return eventNotesLoading || shootNotesLoading || holdMemosLoading;
  }, [eventNotesLoading, shootNotesLoading, holdMemosLoading]);

  useEffect(() => {
    if (!calendarDate) return null;

    let startDate, endDate = null;

    switch (calendarView) {
      case 'month':
        startDate = moment(calendarDate).startOf('month').startOf('week');
        endDate = moment(calendarDate).endOf('month').endOf('week');
        break;
      case 'week':
        startDate = moment(calendarDate).startOf('week');
        endDate = moment(calendarDate).endOf('week');
        break;
      case 'day':
        startDate = calendarDate;
        endDate = calendarDate;
        break;
    }

    const filter = {
      startDate: formatDateString(startDate, 'YYYY-MM-DD'),
      endDate: formatDateString(endDate, 'YYYY-MM-DD')
    };

    dispatch(fetchContractorEventNotesRequest({userId: authUser.id, filter}));
    dispatch(fetchContractorShootNotesRequest({userId: authUser.id, filter}));
    dispatch(fetchContractorHoldMemosRequest({userId: authUser.id, filter}));
  }, [calendarDate, calendarView]);

  const renderCalendarView = () => {
    if (calendarLoading) return (<div className="spinWrapper"><Spin /></div>);

    if (calendarView === 'month') {
      return (
        <FullCalendarMonthlyView
          value={calendarDate}
          shootNotes={shootNotes}
          eventNotes={eventNotes}
          holdMemos={holdMemos}
          onSelectDate={handleCalendarDate}
        />
      )
    }
    if (calendarView === 'week') {
      return (
        <FullCalendarWeeklyView
          value={calendarDate}
          shootNotes={shootNotes}
          eventNotes={eventNotes}
          holdMemos={holdMemos}
        />
      )
    }

    if (calendarView === 'day') {
      return (
        <FullCalendarDailyView
          value={calendarDate}
          shootNotes={shootNotes}
          eventNotes={eventNotes}
          holdMemos={holdMemos}
        />
      )
    }
  };

  const handleCalendarDate = (date) => {
    dispatch(setContractorCalendarDate(date));
  };

  const handleCalendarView = (view) => {
    dispatch(setContractorCalendarView(view));
  };

  return (
    <ContractorScheduleFullCalendarWrapper>
      <FullCalendarHeader
        calendarDate={calendarDate}
        calendarView={calendarView}
        onChangeDate={handleCalendarDate}
        onChangeCalendarView={handleCalendarView}
      />

      {renderCalendarView()}
    </ContractorScheduleFullCalendarWrapper>
  );
};

export default ContractorScheduleFullCalendar;
