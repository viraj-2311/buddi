import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ContractorScheduleWrapper from './Schedule.style';
import ScheduleCardCalendar from '@iso/components/Schedule/CardCalendar';
import ContractorScheduleFullCalendar from './FullCalendar';
import { setContractorCalendarDate } from '@iso/redux/contractorSchedule/actions';

const ContractorSchedule = () => {
  const dispatch = useDispatch();
  const { calendarDate, scheduleView, calendarView } = useSelector(state => state.ContractorSchedule);

  return (
    <ContractorScheduleWrapper>
      <div className="scheduleMainWrapper">
        <div className="scheduleLeftWrapper">
          <div className="section">
            <ScheduleCardCalendar value={calendarDate} onChange={(date) => dispatch(setContractorCalendarDate(date))}/>
          </div>
          <div className="section">
            <h2 className="title">Schedule</h2>
            <ul className="scheduleEventList">
              <li className="scheduleEvent">
                <span className="eventColorIndicator" style={{background: '#f2994a'}}></span>
                <span>Pending</span>
              </li>
              <li className="scheduleEvent">
                <span className="eventColorIndicator" style={{background: '#27ae60'}}></span>
                <span>Pre-Production Event</span>
              </li>
              <li className="scheduleEvent">
                <span className="eventColorIndicator" style={{background: '#2f80ed'}}></span>
                <span>Shooting Event</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="scheduleContentWrapper">
          <ContractorScheduleFullCalendar />
        </div>
      </div>

    </ContractorScheduleWrapper>
  )
};

export default ContractorSchedule;
