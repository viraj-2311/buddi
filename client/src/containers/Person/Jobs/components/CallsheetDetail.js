import React, {useEffect, useMemo, useState} from 'react';
import { DateWidgetWrapper, ScheduleDetailWrapper } from './CallsheetDetail.style';
import JobDetailWrapper from './JobDetail.style';
import Modal from '@iso/components/Feedback/Modal';
import Button from '@iso/components/uielements/button';
import MultiplyIcon from '@iso/components/icons/Multiply';
import NumberFormat from "react-number-format";
import { formatDateString, formatTimeString } from '@iso/lib/helpers/utility';
import request from '@iso/lib/helpers/httpClient';
import _ from 'lodash';
import { displayDateFormat } from '@iso/config/datetime.config';

const JobCallsheetDetail = ({jobCallsheet}) => {
  const {callsheet, job} = jobCallsheet;
  const [shootNotes, setShootNotes] = useState([]);
  const [visibleSchedule, setVisibleSchedule] = useState(false);

  useEffect(() => {
    fetchShootNotes(job.id, callsheet.date);
  }, [jobCallsheet]);

  const fullAddress = useMemo(() => {
    if (!callsheet.location) return '';

    return `${callsheet.location.addressLine1}, ${callsheet.location.city}, ${callsheet.location.state}`;
  }, [callsheet]);

  const productionContact = useMemo(() => {
    if (!callsheet.productionContact) return '';

    const {productionContact: {firstName, lastName, phone}} = callsheet;
    return `${firstName} ${lastName} - ${phone}`;
  }, [callsheet]);

  const fetchShootNotes = async (jobId, date) => {
    let notes = await request(`/job/${jobId}/shoot_note_by_date/`, 'GET', {start_date: date, end_date: date});
    notes = _.sortBy(notes, 'time');

    setShootNotes(notes);
  };

  const openSchedule = () => {
    setVisibleSchedule(true);
  };

  const closeSchedule = () => {
    setVisibleSchedule(false);
  };

  return (
    <JobDetailWrapper>
      <Modal
        visible={visibleSchedule}
        bodyStyle={{padding: '25px'}}
        footer={null}
        width={500}
        closable={false}
        onCancel={closeSchedule}
      >
        <ScheduleDetailWrapper>
          <div className="header">
            <h3 className="title">{job.company}</h3>
            <div className="actions">
              <Button type="link" onClick={closeSchedule}><MultiplyIcon width={18} height={18} /></Button>
            </div>
          </div>
          <div className="subTitle">{job.title}</div>
          <div className="noteDate"><strong>Date: </strong>{formatDateString(callsheet.date, displayDateFormat)}</div>
          <div className="noteInfoWrapper">
            <p className="noteTime"></p>
            <p className="noteContent"></p>
          </div>
          <div className="noteInfoWrapper">
            {shootNotes.map(note => (
              <div className="noteInfo" key={note.id}>
                <p className="noteTime">{formatTimeString(note.time, 'hh:mm A')}</p>
                <div className="noteContent">
                  {note.images && note.images.length > 0 && <img src={note.images[0]} />}
                  <div dangerouslySetInnerHTML={{__html: note.notes}} />
                </div>
              </div>
            ))}
          </div>
        </ScheduleDetailWrapper>
      </Modal>

      <div className="jobInfoWrapper">
        <DateWidgetWrapper style={{marginBottom: '15px'}}>
          <div className="dayNumberWrapper">
            <span>DAY</span>
            <span className="widgetLabel">1</span>
          </div>
          <div className="dateWrapper">
            <span>Date - {formatDateString(callsheet.date, 'LL')}</span>
            <div>
              <span className="widgetLabel">{formatTimeString(jobCallsheet.time, 'hh:mm A')}</span>
              <span>&nbsp;{callsheet.location.timezone}</span>
            </div>

          </div>
        </DateWidgetWrapper>
        <div className="jobInfos">
          <p className="infoLabel">Job For</p>
          <p className="infoDetails">{jobCallsheet.name}</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Department</p>
          <p className="infoDetails">{jobCallsheet.department}</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Position</p>
          <p className="infoDetails">{jobCallsheet.position}</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">City</p>
          <p className="infoDetails">{jobCallsheet.city}</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Rate</p>
          <p className="infoDetails">
            <NumberFormat value={jobCallsheet.rate} displayType={'text'} thousandSeparator={true} prefix={'$'} /> Per Day
          </p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Total Hours</p>
          <p className="infoDetails">{jobCallsheet.totalHours} Hours Per Day</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Location</p>
          <p className="infoDetails">{fullAddress}</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Directions</p>
          <p className="infoDetails"></p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Schedule</p>
          <p className="infoDetails">
            <a href="#" onClick={openSchedule}>Check your schedule here</a>
          </p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Parking</p>
          <p className="infoDetails">{callsheet.parking}</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Hospital</p>
          <p className="infoDetails">{callsheet.hospital}</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Production Contact</p>
          <p className="infoDetails">{productionContact}</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Sunrise/Sunset</p>
          <p className="infoDetails">6:45am 7:12pm</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Weather Forcast</p>
          <p className="infoDetails">6:45am 7:12pm</p>
        </div>
        <div className="jobInfos">
          <p className="infoLabel">Notes</p>
          <p className="infoDetails">{callsheet.notes}</p>
        </div>
      </div>
    </JobDetailWrapper>
  );
};

export default JobCallsheetDetail;
