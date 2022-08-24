import React, {useMemo, useState} from 'react';
import FullCalendarDailyViewWrapper from './CalendarDailyView.style';
import CalendarDailyNoteDetail from './NoteDetail';
import CalendarNoteSlider from '@iso/components/Schedule/CalendareNoteSlider';
import { mapContractorNoteToCalendarEvent, groupNotesByKeys } from '@iso/lib/helpers/calendar'
import {formatDateString} from '@iso/lib/helpers/utility';
import _ from 'lodash';

const CalendarDailyView = ({value, shootNotes, eventNotes, holdMemos}) => {
  const groupEventNotes = useMemo(() => {
    const mapEventNotes = eventNotes.map(note => mapContractorNoteToCalendarEvent(note, 'event'));
    return groupNotesByKeys(mapEventNotes);
  }, [eventNotes]);

  const groupShootNotes = useMemo(() => {
    const mapEventNotes = shootNotes.map(note => mapContractorNoteToCalendarEvent(note, 'shoot'));
    return groupNotesByKeys(mapEventNotes);
  }, [shootNotes]);

  const groupHoldMemos = useMemo(() => {
    const mapMemos = holdMemos.map(memo => mapContractorNoteToCalendarEvent(memo, 'memo'));
    const grouped = _.groupBy(mapMemos, 'date');
    const todayMemos = grouped[formatDateString(value, 'YYYY-MM-DD')];

    if (todayMemos && todayMemos.length > 0) {
      return groupNotesByKeys(todayMemos);
    } else {
      return [];
    }
  }, [holdMemos]);

  const [noteImageState, setNoteImageState] = useState({
    modalVisible: false,
    selectedNote: {}
  });

  const handleSliderOpen = (note) => {
    const selectedNote = note;
    setNoteImageState({ ...noteImageState, modalVisible: true, selectedNote });
  };

  const handleSliderClose = () => {
    setNoteImageState({
      modalVisible: false,
      selectedNote: {}
    })
  };

  return (
    <FullCalendarDailyViewWrapper>
      <CalendarNoteSlider
        modalVisible={noteImageState.modalVisible}
        note={noteImageState.selectedNote}
        onClose={handleSliderClose}
      />

      {groupEventNotes && groupEventNotes.length > 0 && (
        groupEventNotes.map(group => (
          <CalendarDailyNoteDetail
            date={value}
            companyTitle={group.companyTitle}
            jobTitle={group.jobTitle}
            eventTitle={group.eventTitle}
            notes={group.notes}
            onSlider={handleSliderOpen}
          />
        ))
      )}

      {groupShootNotes && groupShootNotes.length > 0 && (
        groupShootNotes.map(group => (
          <CalendarDailyNoteDetail
            date={value}
            companyTitle={group.companyTitle}
            jobTitle={group.jobTitle}
            eventTitle={group.eventTitle}
            notes={group.notes}
            onSlider={handleSliderOpen}
          />
        ))
      )}

      {groupHoldMemos && groupHoldMemos.length > 0 && (
        groupHoldMemos.map(group => (
          <CalendarDailyNoteDetail
            date={value}
            companyTitle={group.companyTitle}
            jobTitle={group.jobTitle}
            eventTitle={group.eventTitle}
            notes={group.notes}
            onSlider={handleSliderOpen}
          />
        ))
      )}
    </FullCalendarDailyViewWrapper>
  );
};

export default CalendarDailyView;