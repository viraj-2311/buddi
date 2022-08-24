import React, {useMemo, useState} from 'react';
import FullCalendarWeeklyViewWrapper from './CalendarWeeklyView.style';
import CalendarWeeklyNoteDetail from './NoteDetail';
import { Empty } from 'antd';
import {
  mapContractorNoteToCalendarEvent, groupNotesByKeys } from '@iso/lib/helpers/calendar';
import { stringToDate, formatDateString } from '@iso/lib/helpers/utility';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';

const moment = extendMoment(Moment);

const CalendarWeeklyView = ({value, shootNotes, eventNotes, holdMemos}) => {
  const currentWeek = moment.range(moment(value).startOf('week'), moment(value).endOf('week'));

  const [noteDetail, setNoteDetail] = useState({
    modalVisible: false,
    event: {}
  });

  const groupNotes = (notes, type) => {
    const mapNotes = notes.map(note => mapContractorNoteToCalendarEvent(note, type));
    let grouped = _.groupBy(mapNotes, 'date');

    Object.keys(grouped).map(date => {
      grouped[date] = groupNotesByKeys(grouped[date])
    });

    return grouped;
  };

  const weeklyEvents = useMemo(() => {
    let events = {};
    const groupEventNotes = groupNotes(eventNotes, 'event');
    const groupShootNotes = groupNotes(shootNotes, 'shoot');
    const groupHoldMemos = groupNotes(holdMemos, 'memo');

    Array.from(currentWeek.by('day')).map((m, index) => {
      const dateString = formatDateString(m, 'YYYY-MM-DD');
      const eNotes = groupEventNotes[dateString];
      const sNotes = groupShootNotes[dateString];
      const dMemos = groupHoldMemos[dateString];

      let allDayEvents = [];
      if (sNotes) {
        allDayEvents = [...allDayEvents, ...sNotes]
      }
      if (eNotes) {
        allDayEvents = [...allDayEvents, ...eNotes];
      }
      if (dMemos) {
        allDayEvents = [...allDayEvents, ...dMemos];
      }

      events[dateString] = [...allDayEvents];
    });

    return events;
  }, [eventNotes, shootNotes, holdMemos]);

  const maxDayEvents = () => {
    if (_.isEmpty(weeklyEvents)) return [];

    const sortEventsByLength = Object.values(weeklyEvents).sort((a, b) => b.length - a.length);
    return sortEventsByLength[0]
  };

  const onNoteClick = (event) => {
    setNoteDetail({...noteDetail, modalVisible: true, event});
  };

  const closeNoteDetail = () => {
    setNoteDetail({...noteDetail, modalVisible: false, event: {}});
  };

  return (
    <FullCalendarWeeklyViewWrapper>
      <CalendarWeeklyNoteDetail
        modalVisible={noteDetail.modalVisible}
        event={noteDetail.event}
        onClose={closeNoteDetail}
      />
      <div className="ant-table">
        <table>
          <thead className="ant-table-thead">
            <tr>
              {
                Array.from(currentWeek.by('day')).map((m, index) => {
                  return (
                    <th className="ant-table-cell" key={index}>
                      <div className="day-label">{formatDateString(m, 'ddd')}</div>
                      <div className="date">{formatDateString(m, 'MMM D')}</div>
                    </th>
                  );
                })
              }
            </tr>
          </thead>
          <tbody className="ant-table-tbody" id="weekly-view-body">
            {
              maxDayEvents() === 0
                ? (
                  <tr className="ant-table-placeholder">
                    <td colSpan="7" className="ant-table-cell">
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </td>
                  </tr>
                )
                : maxDayEvents().map((event, rowIndex) => (
                  <tr key={rowIndex}>
                    {
                      Array.from(currentWeek.by('day')).map((weekDay, colIndex) => {
                        const dateString = formatDateString(weekDay, 'YYYY-MM-DD');
                        const dateEventNotes = weeklyEvents[dateString];
                        let calendarEvent = {};

                        if (dateEventNotes && dateEventNotes.length > 0) {
                          calendarEvent = dateEventNotes[rowIndex] || {};
                        }

                        return (
                          <td key={colIndex}>
                            <div className="calendar-date-content">
                              <div className="singleEventNote"
                                style={{background: calendarEvent.color}}
                                onClick={() => onNoteClick(calendarEvent)}
                              >
                                <div className="noteInfos">
                                  <span className="companyTitle">{calendarEvent.companyTitle}</span>
                                  <span className="eventTitle">{calendarEvent.eventTitle || calendarEvent.jobTitle}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                        )
                      })
                    }
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </FullCalendarWeeklyViewWrapper>
  );
};

export default CalendarWeeklyView;