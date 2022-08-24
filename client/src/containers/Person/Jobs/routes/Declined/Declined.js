import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useHistory} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import StyledContractorTable from '../JobDetails/Table';
import
  DeclinedJobsWrapper, {
  ActionWrapper,
  ButtonHolders,
  ComponentTitle,
  LocationSpan,
  TitleWrapper,
} from './Declined.style';
import Button from '@iso/components/uielements/button';
import BackIcon from '@iso/components/icons/Back';
import LocationIcon from '@iso/components/icons/Location';
import TrashIcon from '@iso/components/icons/Trash';
import Loader from '@iso/components/utility/loader';
import notify from '@iso/lib/helpers/notify';
import { fetchContractorJobsRequest, deleteBulkContractorJobRequest } from '@iso/redux/contractorJob/actions';

const { Column } = StyledContractorTable;

const DeclinedJobs = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { jobs, list: fetchListRequest, deleteBulk } = useSelector(state => state.ContractorJob);
  const { user: authUser } = useSelector(state => state.Auth);
  const [tableRecords, setTableRecords] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [action, setAction] = useState('');

  useEffect(() => {
    dispatch(fetchContractorJobsRequest(authUser.id, {status: 'DECLINED'}));
  }, [authUser]);

  useEffect(() => {
    setTableRecords(jobs.map(job => ({...job, key: job.id})));
  }, [jobs]);

  useEffect(() => {
    if (!deleteBulk.loading && !deleteBulk.error && action === 'bulk_delete') {
      notify('success', `${selectedJobs.length} memos deleted successfully`);
      setSelectedJobs([]);
    }

    if (!deleteBulk.loading && action === 'bulk_delete') {
      setAction('');
    }

  }, [deleteBulk]);

  const rowSelection = {
    selectedRowKeys: selectedJobs.map(job => job.key),
    onSelect: (record, selected, selectedRows) => {
      setSelectedJobs(selectedRows)
    },
    onSelectAll: (selected) => {
      if (selected) {
        setSelectedJobs(tableRecords);
      } else {
        setSelectedJobs([]);
      }
    }
  };

  const handleBulkDelete = () => {
    const ids = selectedJobs.map(job => job.id);
    setAction('bulk_delete');
    dispatch(deleteBulkContractorJobRequest(ids));
  };

  if (fetchListRequest.loading) {
    return <Loader />;
  }

  return (
    <DeclinedJobsWrapper>
      <TitleWrapper>
        <div>
          <Link to="/jobs">
            <Button type="link" className="goBackBtn">
              <BackIcon width={12} height={20} />
            </Button>
          </Link>
          <ComponentTitle>Declined</ComponentTitle>
        </div>

        <ButtonHolders>
          <Button
            className="deleteBtn"
            type="default"
            shape="round"
            loading={action === 'bulk_delete'}
            onClick={handleBulkDelete}
          >
            <TrashIcon width={14} height={18} fill="#ffffff" />
            Delete
          </Button>
        </ButtonHolders>
      </TitleWrapper>

      <StyledContractorTable
        rowSelection={rowSelection}
        dataSource={tableRecords}
        className="isoSimpleTable"
        pagination={{
          hideOnSinglePage: true,
          total: tableRecords.length,
          showTotal: (total, range) => {
            return `Showing ${range[0]}-${range[1]} of ${tableRecords.length} Results`;
          },
        }}
      >
        <Column
          key="client"
          title="Band"
          render={(text, record) => (<strong style={{fontSize: 15}}>{record.job.client}</strong>)}
        />
        <Column
          key="jobName"
          title="Gig Name"
          render={(text, record) => record.job.title}
        />
        {/* <Column
          key="agency"
          title="Agency"
          render={(text, record) => record.job.agency}
        /> */}
        <Column
          key="jobId"
          title="Gig ID"
          render={(text, record) => record.job.jobNumber}
        />
        <Column
          key="location"
          title="Location"
          render={(text, record) => (
            <LocationSpan>
              <LocationIcon height="18" width="14" />
              {record.city} {record.state}
            </LocationSpan>
          )}
        />
        <Column
          key="date"
          title="Date"
          render={(text, record) => record.dates}
        />
        <Column
          key="actions"
          title=""
          render={(text, record) => (
            <ActionWrapper>
              <Link to={`/jobs/${record.id}`}>View</Link>
            </ActionWrapper>
          )}
        />
      </StyledContractorTable>
    </DeclinedJobsWrapper>
  );
};

export default DeclinedJobs;
