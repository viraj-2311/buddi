import React, {useMemo, useState} from 'react';
import FullCalendarMonthlyViewWrapper from './CalendarMonthlyView.style'
import CalendarMonthlyNoteDetail from './NoteDetail';
import FullCalendar from '@iso/components/Schedule/FullCalendar';
import Scrollbar from '@iso/components/utility/customScrollBar';
import { stringToDate, formatDateString } from '@iso/lib/helpers/utility';
import { mapContractorNoteToCalendarEvent, groupNotesByKeys  } from '@iso/lib/helpers/calendar';
import moment from 'moment';
import _ from 'lodash';

moment.locale('en', {
  weekdaysMin : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
});

const FullCalendarMonthlyView = ({value, shootNotes, eventNotes, holdMemos, onSelectDate}) => {
  const currentDate = moment(value);

  const groupEventNotes = useMemo(() => {
    const mapEventNotes = eventNotes.map(note => mapContractorNoteToCalendarEvent(note, 'event'));
    let grouped = _.groupBy(mapEventNotes, 'date');

    Object.keys(grouped).map(date => {
      grouped[date] = groupNotesByKeys(grouped[date])
    });

    return grouped;
  }, [eventNotes]);

  const groupShootNotes = useMemo(() => {
    const mapShootNotes = shootNotes.map(note => mapContractorNoteToCalendarEvent(note, 'shoot'));
    let grouped = _.groupBy(mapShootNotes, 'date');

    Object.keys(grouped).map(date => {
      grouped[date] = groupNotesByKeys(grouped[date])
    });

    return grouped;
  }, [shootNotes]);

  const groupHoldMemos = useMemo(() => {
    const mapMemos = holdMemos.map(memo => mapContractorNoteToCalendarEvent(memo, 'memo'));
    let grouped = _.groupBy(mapMemos, 'date');
    Object.keys(grouped).map(date => {
      grouped[date] = groupNotesByKeys(grouped[date])
    });

    return grouped;
  }, [holdMemos]);

  const [noteDetail, setNoteDetail] = useState({
    modalVisible: false,
    event: {}
  });

  const onNoteClick = (event) => {
    setNoteDetail({...noteDetail, modalVisible: true, event});
  };

  const closeNoteDetail = () => {
    setNoteDetail({...noteDetail, modalVisible: false, event: {}});
  };

  const onSelect = (value) => {
    onSelectDate(value.toDate());
  };

  const dateCellRender = (value) => {
    const dateString = formatDateString(value, 'YYYY-MM-DD');
    let events = [];
    if (groupEventNotes[dateString]) {
      events = [...events, ...groupEventNotes[dateString]];
    }

    if (groupShootNotes[dateString]) {
      events = [...events, ...groupShootNotes[dateString]];
    }

    if (groupHoldMemos[dateString]) {
      events = [...events, ...groupHoldMemos[dateString]];
    }

    if (!events.length) return null;

    return (
      <Scrollbar style={{height: '100%'}}>
        <ul className="events">
          {events.map((group, index) => {
            return (
              <li
                key={index}
                className="singleEventNote"
                style={{background: group.color}}
                onClick={(e) => {
                  e.stopPropagation();
                  onNoteClick(group);
                }}
              >
                <div className="noteInfos">
                  <span className="companyTitle">{group.companyTitle}</span>
                  <span className="eventTitle">{group.eventTitle}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </Scrollbar>
    );
  };

  return (
    <FullCalendarMonthlyViewWrapper>
      <CalendarMonthlyNoteDetail
        modalVisible={noteDetail.modalVisible}
        event={noteDetail.event}
        onClose={closeNoteDetail}
      />
      <FullCalendar
        headerRender={() => null}
        value={currentDate}
        onSelect={onSelect}
        dateCellRender={dateCellRender}
      />
    </FullCalendarMonthlyViewWrapper>
  );
};

export default FullCalendarMonthlyView;