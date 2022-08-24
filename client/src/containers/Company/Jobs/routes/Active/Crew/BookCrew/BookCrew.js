import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@iso/components/uielements/button';
import {
  getBookCrewStatus,
  getIsShouldBookCrewConsidered,
} from '@iso/lib/helpers/utility';
import Modal from '@iso/components/Modal';
import Scrollbar from '@iso/components/utility/customScrollBar';
import BookCrewDepartmentList from './DepartmentList';
import {
  ActionWrapper,
  BookCrewWrapper,
  BookInfoWrapper,
} from './BookCrew.style';
import Loader from '@iso/components/utility/loader';
import { DownloadOutlined } from '@ant-design/icons';
import {
  fetchJobFullViewRequest,
  bookCrewRequest,
} from '@iso/redux/producerJob/actions';
import _ from 'lodash';
import { formatDateString } from '@iso/lib/helpers/utility';
// import BookCrewStatusTypes from '@iso/enums/book_crew_status_types';
import { displayDateFormat } from '@iso/config/datetime.config';

const bodyStyle = {
  background: '#f5f7fa',
  padding: '35px 30px',
};

const BookCrew = ({ visible, job, setModalData }) => {
  const dispatch = useDispatch();
  const { jobFullView, fetchFullView, bookCrew } = useSelector(
    (state) => state.ProducerJob
  );
  const [action, setAction] = useState('');
  const [selectedCrews, setSelectedCrews] = useState([]);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (job && job.id) {
      setAction('full_view');
      dispatch(fetchJobFullViewRequest(job.id));
    }
  }, [job]);

  useEffect(() => {
    if (
      !fetchFullView.loading &&
      !fetchFullView.error &&
      action === 'full_view'
    ) {
      setShowLoader(false);
      setSelectedCrews(jobFullView.map((crew) => crew.id));
    }

    if (!fetchFullView.loading && action === 'full_view') {
      setAction('');
    }
  }, [fetchFullView]);

  useEffect(() => {
    if (!bookCrew.loading && !bookCrew.error && action === 'book_crew') {
      setModalData({ status: 'close', shouldRefresh: true });
    }

    if (!bookCrew.loading && action === 'book_crew') {
      setAction('');
    }
  }, [bookCrew]);

  const crewsByDepartment = useMemo(() => {
    let clonedJobFullView = _.cloneDeep(jobFullView);
    if (clonedJobFullView) {
      clonedJobFullView.forEach((crew) => {
        crew.memoStatus = getBookCrewStatus({ crew });
      });
    }
    return clonedJobFullView ? _.groupBy(clonedJobFullView, 'department') : {};
  }, [jobFullView]);

  const handleCancel = () => {
    setModalData({ status: 'close' });
  };

  const onCrewSelect = (crews) => {
    setSelectedCrews(crews);
  };

  const handleBookCrew = () => {
    const crews = [];
    const crewsByDepartmentKeys = Object.keys(crewsByDepartment);
    for (let i = 0; i < crewsByDepartmentKeys.length; i++) {
      const department = crewsByDepartmentKeys[i];
      const crewList = crewsByDepartment[department];
      const crewsByPositions = crewList ? _.groupBy(crewList, (crew) => `${crew.position}_${crew.jobRole}`) : {};
      if (crewsByPositions) {
        const crewsByPositionsKeys = Object.keys(crewsByPositions);
        for (let j = 0; j < crewsByPositionsKeys.length; j++) {
          const cbp = crewsByPositionsKeys[j];
          const positionCrewList = _.sortBy(
            crewsByPositions[cbp],
            'choiceLevel'
          );
          for (let k = 0; k < positionCrewList.length; k++) {
            const crew = positionCrewList[k];
            if (getIsShouldBookCrewConsidered(crew, k, positionCrewList)) {
              crews.push(crew.id);
            }
          }
        }
      }
    }
    const payload = { crews: _.intersection(crews, selectedCrews) };
    // console.log(job.id, payload);
    setAction('book_crew');
    dispatch(bookCrewRequest(job.id, payload));
  };

  if (showLoader) {
    return <Loader />;
  }

  return (
    <Modal
      visible={visible}
      title='Book Talent'
      width={1200}
      wrapClassName='hCentered'
      bodyStyle={bodyStyle}
      footer={
        <ActionWrapper>
          <Button
            shape='circle'
            icon={<DownloadOutlined />}
            size='large'
            onClick={() => {}}
          />
          <Button htmlType='button' shape='round' onClick={handleCancel}>
            Cancel
          </Button>

          <Button
            htmlType='submit'
            type='primary'
            shape='round'
            loading={action === 'book_crew'}
            onClick={handleBookCrew}
          >
            Confirm Booking
          </Button>
        </ActionWrapper>
      }
      onCancel={handleCancel}
    >
      <BookCrewWrapper>
        <div className='bookDate'>
          <strong>Date(s): </strong>
          {formatDateString(job.startDate, displayDateFormat)} -{' '}
          {formatDateString(job.wrapDate, displayDateFormat)}
        </div>
        <Scrollbar style={{ height: 550 }}>
          <BookInfoWrapper className='bookInfo'>
            {Object.keys(crewsByDepartment).map((department, index) => (
              <BookCrewDepartmentList
                key={`book-crew-department-${index}`}
                department={department}
                crews={crewsByDepartment[department]}
                selectedCrews={selectedCrews}
                onSelect={onCrewSelect}
                opened={true}
              />
            ))}
          </BookInfoWrapper>
        </Scrollbar>
      </BookCrewWrapper>
    </Modal>
  );
};

export default BookCrew;
