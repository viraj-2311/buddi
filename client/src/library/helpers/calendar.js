import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { stringToDate, formatDateString } from './utility';

const moment = extendMoment(Moment);

const dateIndex = (date, dates) => {
  if (!dates) return null;

  const dateString = formatDateString(date, 'YYYY-MM-DD');
  const index = dates.indexOf(dateString);

  return index === -1 ? null : index + 1;
};

export const mapJobNoteToCalendarEvent = (note, shootDates) => {
  let calendarEvent = {
    id: note.id,
    date: note.date,
    time: note.time,
    images: note.images,
    notes: note.filteredNotes,
  };

  if (note.name && note.color) {
    calendarEvent = {...calendarEvent, crews: note.crews, color: note.color, title: `${note.name}|${note.color}`, type: 'pre-pro'}
  } else {
    calendarEvent = {...calendarEvent, color: '#2f80ed', title: `Shoot Day ${dateIndex(note.date, shootDates)}`, type: 'shoot'}
  }

  return calendarEvent;
};

export const mapContractorNoteToCalendarEvent = (note, type) => {
  let calendarEvent = {
    id: note.id,
    date: note.date,
    time: note.time,
    notes: note.filteredNotes,
    images: note.images,
    companyTitle: note.companyTitle,
    jobTitle: note.jobTitle
  };

  if (type === 'shoot') {
    calendarEvent = {
      ...calendarEvent,
      color: '#2f80ed', eventTitle: `${note.jobTitle} | Shoot Day ${dateIndex(note.date, note.shootDates)}`, type: 'shoot'
    };
  } else if (type === 'event') {
    calendarEvent = {...calendarEvent, color: '#27ae60', eventTitle: `${note.jobTitle} | ${note.eventTitle}`, type: 'event'};
  } else if (type === 'memo') {
    calendarEvent = {...calendarEvent, color: '#f2994a', eventTitle: `${note.jobTitle}`, type: 'memo'};
  }

  return calendarEvent;
};

export const groupNotesByKeys = (notes) => {
  const grouped = notes.reduce((r, item) => {
    const {companyTitle, jobTitle, eventTitle, date, color} = item;

    const key = `${companyTitle}-${jobTitle}-${eventTitle}`;
    r[key] = r[key] || { companyTitle, jobTitle, eventTitle, date, color, notes: [] };
    r[key]['notes'].push(item);
    return r;
  }, {});

  return Object.values(grouped);
};
