import React from 'react';
import Modal from '@iso/components/Feedback/Modal';
import CalendarMonthlyNoteDetailWrapper from './NoteDetail.style';
import Button from '@iso/components/uielements/button';
import MultiplyIcon from '@iso/components/icons/Multiply';
import { formatTimeString, formatDateString } from '@iso/lib/helpers/utility';
import _ from 'lodash';

const CalendarWeeklyNoteDetail = ({ modalVisible, event, onClose }) => {
  if (_.isEmpty(event)) return null;

  const sortNotes = _.sortBy(event.notes, 'time');

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={modalVisible}
      bodyStyle={{padding: '25px'}}
      footer={null}
      width={500}
      closable={false}
      onCancel={handleCancel}
    >
      <CalendarMonthlyNoteDetailWrapper>
        <div className="header">
          <h3 className="title">{event.companyTitle}</h3>
          <Button type="link" onClick={handleCancel}><MultiplyIcon width={18} height={18} /></Button>
        </div>
        <div className="subTitle">{event.eventTitle}</div>
        <div className="noteDate"><strong>Date: </strong>{formatDateString(event.date, 'LL')}</div>
        <div className="noteInfoWrapper">
          <p className="noteTime"></p>
          <p className="noteContent"></p>
        </div>
        <div className="noteInfoWrapper">
          {sortNotes.map(note => (
            <div className="noteInfo" key={note.id}>
              <p className="noteTime">{formatTimeString(note.time, 'hh:mm A')}</p>
              <div className="noteContent">
                {note.images && note.images.length > 0 && <img src={note.images[0]} />}
                <div dangerouslySetInnerHTML={{__html: note.notes}} />
              </div>
            </div>
          ))}
        </div>
      </CalendarMonthlyNoteDetailWrapper>
    </Modal>
  );
};

export default CalendarWeeklyNoteDetail;
