import React from 'react';
import CalendarNoteDetailWrapper from './NoteDetail.style';
import { formatTimeString, formatDateString } from '@iso/lib/helpers/utility';
import _ from 'lodash';

const CalendarDailyNoteDetail = ({ date, companyTitle, jobTitle, eventTitle, notes, onSlider }) => {
  const sortNotes = _.sortBy(notes, 'time');

  const handleSliderOpen = (e, note) => {
    if (e.target.nodeName === 'IMG') {
      if (onSlider) onSlider(note)
    }
  };

  return (
    <CalendarNoteDetailWrapper>
      <div className="header">
        <h3 className="title">{companyTitle}</h3>
      </div>
      <div className="subTitle">{eventTitle}</div>
      <div className="noteDate"><strong>Date: </strong>{formatDateString(date, 'LL')}</div>
      <div className="noteInfoWrapper">
        <p className="noteTime"></p>
        <p className="noteContent"></p>
      </div>
      <div className="noteInfoWrapper">
        {sortNotes.map(note => (
          <div className="noteInfo" key={note.id} onClick={(e) => handleSliderOpen(e, note)}>
            <p className="noteTime">{formatTimeString(note.time, 'hh:mm A')}</p>
            <div className="noteContent">
              {note.images && note.images.length > 0 && <img src={note.images[0]} />}
              <div dangerouslySetInnerHTML={{__html: note.notes}} />
            </div>
          </div>
        ))}
      </div>
    </CalendarNoteDetailWrapper>
  );
};

export default CalendarDailyNoteDetail;
