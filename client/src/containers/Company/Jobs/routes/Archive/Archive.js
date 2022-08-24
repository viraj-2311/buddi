import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@iso/components/Table';
import { Dropdown, Menu, Spin } from 'antd';
import notify from '@iso/lib/helpers/notify';
import StatusTag from "@iso/components/utility/statusTag";
import { showServerError } from '@iso/lib/helpers/utility';
import {
  TableColumn,
  TableHeaderActionDiv,
  TableWrapper,
} from '@iso/components/Table/Table.style';
import ArchiveJobsWrapper, {
  ButtonHolders,
  ComponentTitle,
  ClientNameDiv,
  ArchiveJobTableWrapper,
  ActionDiv,
  TitleWrapper,
  TotalInvoicePrice,
} from './Archive.style';
import Button from '@iso/components/uielements/button';
import { sortIconHeightWidth } from '@iso/lib/helpers/appConstant';
import CurrencyText from '@iso/components/utility/currencyText';
import BackIcon from '@iso/components/icons/Back';
import ConfirmModal from '@iso/components/Modals/ConfirmNew';
import ReinstateJobModal from '@iso/components/Modals/ReinstateJob';
import TrashIcon from '@iso/components/icons/Trash';
import SortIcon from '@iso/components/icons/Sort';
import { sortList, formatDateString } from '@iso/lib/helpers/utility';
import { Sorter } from '@iso/lib/helpers/sorter';
import _ from 'lodash';
import { EllipsisOutlined } from '@ant-design/icons';
import {
  deleteJobRequest,
  fetchArchivedCompanyJobsRequest,
  deleteJobsBulkRequest,
} from '@iso/redux/producerJob/actions';
import Location from "@iso/assets/images/location.webp";
import { fetchDownloadAllInvoiceAsZipRequest, fetchDownloadAllW9AsZipRequest, fetchDownloadArchiveJobRequest } from '../../../../../redux/companyDocument/actions';
import { downloadReportsRequest } from '../../../../../redux/jobInvoice/actions';


const ArchiveJobs = () => {
  const initialJobReinstate = {
    description: '',
    isMultipleReinstate: false,
    job: null,
    title: '',
    visible: false,
  };
  const initialJobRemoveConfirm = {
    description: '',
    isMultipleRemove: false,
    job: null,
    visible: false,
    jobIds: [],
  };
  const dispatch = useDispatch();
  const {
    companyId,
    jobs,
    list: fetchListRequest,
    delete: deleteAction,
    deleteBulk: deleteBulkAction,
  } = useSelector((state) => state.ProducerJob);

  const [action, setAction] = useState('');
  const [tableRecords, setTableRecords] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [jobReinstate, setJobReinstate] = useState(initialJobReinstate);
  const [jobRemoveConfirm, setJobRemoveConfirm] = useState(initialJobRemoveConfirm);
  const {
    download_all: { loading: downloadAllLoading },
  } = useSelector((state) => state.CompanyDocument);
  const history = useHistory();

  const singleJobDeleteDescription =
    'Are you sure you want to Delete this Gig permanently?';
  const multipleJobsDeleteDescription =
    'Are you sure you want to Delete these Gigs permanently?';

  const singleJobReinstateDescription =
    'Create a new gig with all the talents on this gigs';
  const multipleJobsReinstateDescription =
    'Create new gigs with all the talents on these gigs';
  const singleJobReinstateTitle = 'Reinstate Gig';
  const multipleJobsReinstateTitle = 'Reinstate Gigs';

  const jobAction = {
    VIEW: 'View',
    DOWNLOAD_W9_DOCS:'Download W9 Docs',
    DOWNLOAD_INVOICES:'Download Invoices',
    DOWNLOAD_REPORTS:'Download Reports',
    // REINSTATE: 'Reinstate',
    DELETE: 'Delete',    
  };

  useEffect(() => {
    dispatch(fetchArchivedCompanyJobsRequest({ companyId }));
  }, [companyId]);

  useEffect(() => {
    setTableRecords(jobs.map((job) => ({ ...job, key: job.id })));
  }, [jobs]);

  useEffect(() => {
    if (action === 'delete') {
      if (!deleteAction.loading && !deleteAction.error) {
        setJobRemoveConfirm(initialJobRemoveConfirm);
        notify('success', 'Job deleted successfully');
      }
      if (deleteAction.error) {
        notify('error', showServerError(deleteAction.error));
      }
      if (!deleteAction.loading) {
        setAction('');
      }
    }
  }, [deleteAction]);

  useEffect(() => {
    if (action === 'bulk_delete') {
      if (deleteBulkAction.success) {
        setSelectedJobs([]);
        notify('success', 'Jobs are successfully deleted.');
      } else if (deleteBulkAction.error) {
        notify('error', 'Jobs deletion failed.');
      }

      if (!deleteBulkAction.loading) {
        setJobRemoveConfirm(initialJobRemoveConfirm);
        setAction('');
      }
    }
  })

  const columnKey = {
    client: 'client',
    title: 'title',
    date: 'date',
    invoiceTotal: 'invoiceTotal',
  };

  const MoreActions = (record) => {
    return (
      <Menu
        onClick={(e) => {
          const itemText = e.domEvent.currentTarget.innerText;          
          if (itemText === jobAction.DELETE) {
            setJobRemoveConfirm({
              description: singleJobDeleteDescription,
              isMultipleRemove: false,
              job: record,
              visible: true,
            });
          } else if (itemText === jobAction.REINSTATE) {
            setJobReinstate({
              description: singleJobReinstateDescription,
              isMultipleReinstate: false,
              job: record,
              title: singleJobReinstateTitle,
              visible: true,
            });
          } else if (itemText === jobAction.VIEW) {
            onView(record);
          } else if (itemText === jobAction.DOWNLOAD_W9_DOCS) {
            dispatch(fetchDownloadAllW9AsZipRequest(record.id,`${record.title}_${new Date().getTime()}`));
          }else if (itemText === jobAction.DOWNLOAD_INVOICES) {
            dispatch(fetchDownloadAllInvoiceAsZipRequest(record.id,`${record.title}_${new Date().getTime()}`), {});
          }else if (itemText === jobAction.DOWNLOAD_REPORTS) {
            dispatch(downloadReportsRequest(record.id, {}));
            // handleDownload(record.id);
          }          
        }}
      >
        <Menu.Item key={'archived-job-' + record.id + '-view'}>{jobAction.VIEW}</Menu.Item>
        <Menu.Item key={'archived-job-' + record.id + '-download-w9-doc'}>{jobAction.DOWNLOAD_W9_DOCS}</Menu.Item>
        <Menu.Item key={'archived-job-' + record.id + '-download-invoices'}>{jobAction.DOWNLOAD_INVOICES}</Menu.Item>
        <Menu.Item key={'archived-job-' + record.id + '-download-reports'}>{jobAction.DOWNLOAD_REPORTS}</Menu.Item>
        {/* <Menu.Item key={'archived-job-' + record.id + '-reinstate'}>{jobAction.REINSTATE}</Menu.Item> */}
        <Menu.Item key={'archived-job-' + record.id + '-delete'}>{jobAction.DELETE}</Menu.Item>
      </Menu>
    );
  };

  const DateSortActions = (sortKey) => (
    <Menu
      onClick={(e) => {
        let sortOption = { sortKey };
        sortOption.sortDir =
          e.item.node.innerHTML === 'Sort Oldest to Newest' ? 'ASC' : 'DESC';
        const copiedTableRecords = _.cloneDeep(tableRecords);
        const sorted = copiedTableRecords.sort((a, b) => {
          if (a.startDate === b.startDate) {
            // if startDate are same, sort by wrapDate
            return Sorter.DATE(
              a.wrapDate,
              b.wrapDate,
              sortOption.sortDir === 'DESC' ? -1 : 1
            );
          }
          // otherwise sort by startDate
          return Sorter.DATE(
            a.startDate,
            b.startDate,
            sortOption.sortDir === 'DESC' ? -1 : 1
          );
        });
        setTableRecords(sorted);
      }}
    >
      <Menu.Item>Sort Oldest to Newest</Menu.Item>
      <Menu.Item>Sort Newest to Oldest</Menu.Item>
    </Menu>
  );

  const StringSortActions = (sortKey) => (
    <Menu
      onClick={(e) => {
        let sortOption = { sortKey };
        sortOption.sortDir =
          e.item.node.innerHTML === 'Ascending Alphabetically' ? 'ASC' : 'DESC';
        const copiedTableRecords = _.cloneDeep(tableRecords);
        setTableRecords(
          copiedTableRecords.sort((a, b) => {
            return sortList(a, b, sortOption);
          })
        );
      }}
    >
      <Menu.Item>Ascending Alphabetically</Menu.Item>
      <Menu.Item>Descending Alphabetically</Menu.Item>
    </Menu>
  );

  const rowSelection = {
    selectedRowKeys: selectedJobs.map((job) => job.key),
    onSelect: (record, selected, selectedRows) => {
      setSelectedJobs(selectedRows);
    },
    onSelectAll: (selected) => {
      setSelectedJobs(selected ? tableRecords : []);
    },
  };

  const handleBulkDelete = () => {
    if (selectedJobs.length) {
      const ids = selectedJobs.map((job) => job.id);
      setJobRemoveConfirm({
        description:
          selectedJobs.length > 1
            ? multipleJobsDeleteDescription
            : singleJobDeleteDescription,
        isMultipleRemove: true,
        job: null,
        visible: true,
        jobIds: ids,
      });
    }
  };
  const handleBulkDownload = () => {
    if (selectedJobs?.length) {
      const jobs = selectedJobs.map((job) => job.id);
      if (jobs?.length)
        dispatch(fetchDownloadArchiveJobRequest(jobs));
    }
  }
  const handleBulkReinstate = () => {
    const ids = selectedJobs.map((job) => job.id);
    // setJobReinstate({
    //   description: multipleJobsReinstateDescription,
    //   isMultipleReinstate: true,
    //   job: null,
    //   title: multipleJobsReinstateTitle,
    //   visible: true,
    // });
    if (selectedJobs.length == 1) {
      setJobReinstate({
        description: singleJobReinstateDescription,
        isMultipleReinstate: false,
        job: selectedJobs[0],
        title: singleJobReinstateTitle,
        visible: true,
      });
    }
  };

  const onView = (job) => {
    history.push(`./${job.id}`);
  }

  const handleDownload = (id) => {
    dispatch(fetchDownloadArchiveJobRequest([id]));
  }
  const handleDownloadMultipleJobDocument = () => {
    selectedJobs.forEach((job) => {
      const { id, title } = job;
      handleDownload(id, title);
    });
  };

  const handleJobDelete = () => {
    setAction('delete');
    dispatch(deleteJobRequest(jobRemoveConfirm.job.id));
  };

  const handleJobBulkDelete = (jobIds) => {
    setAction('bulk_delete');
    dispatch(deleteJobsBulkRequest(jobIds));
  }

  const handleConfirmRemoveJobs = () => {
    if (jobRemoveConfirm.isMultipleRemove) {
      handleJobBulkDelete(jobRemoveConfirm.jobIds);
    } else {
      handleJobDelete();
    }
  };

  const columns = [
    {
      title: () => (
        <TableColumn className='action-btn'>
          {/* <TableHeaderActionDiv>
            <Button
              type='primary'
              shape='round'
              className='type-two downloadBtn'
              onClick={handleDownloadMultipleJobDocument}
              icon={<DownloadOutlined />}
              loading={downloadAllLoading}
            >
              Download
            </Button>
          </TableHeaderActionDiv> */}
          Band
          <Dropdown
            overlay={StringSortActions(columnKey.client)}
            overlayClassName='invoiceMenu'
            placement='bottomRight'
            trigger='click'
          >
            <Button
              type='link'
              icon={
                <SortIcon
                  height={sortIconHeightWidth}
                  width={sortIconHeightWidth}
                />
              }
            />
          </Dropdown>
        </TableColumn>
      ),
      key: columnKey.client,
      render: (record) => (
        <ClientNameDiv>
          <p>{record.client}</p>
        </ClientNameDiv>
      ),
    },
    {
      title: () => <TableColumn>Gig Name</TableColumn>,
      dataIndex: ['title'],
      render: (title) => title,
    },
    {
      title: () => <TableColumn>Event</TableColumn>,
      dataIndex: ['agency'],
      render: (agency) => agency,
    },

    {
      title: () => <TableColumn>Gig ID</TableColumn>,
      dataIndex: ['jobNumber'],
      render: (jobNumber) => jobNumber,
    },
    {
      title: () => <TableColumn>Location</TableColumn>,
      dataIndex: ['company'],
      render: (company) => <div className="location-name">
        <img src={Location} alt="Location" />
        <p>{company?.city}, {company?.state}</p>
      </div>,
    },
    {
      title: () => (
        <TableColumn>
          Date
          <Dropdown
            overlay={DateSortActions(columnKey.date)}
            overlayClassName='invoiceMenu'
            placement='bottomRight'
            trigger='click'
          >
            <Button
              type='link'
              icon={
                <SortIcon
                  height={sortIconHeightWidth}
                  width={sortIconHeightWidth}
                />
              }
            />
          </Dropdown>
        </TableColumn>
      ),
      key: columnKey.date,
      render: (record) => {
        return `${formatDateString(
          record.startDate,
          'MMM Do, YYYY'
        )} - ${formatDateString(record.wrapDate, 'MMM Do, YYYY')}`;
      },
    },
    {
      title: () => <TableColumn>Total Invoice</TableColumn>,
      key: columnKey.invoiceTotal,
      render: (record) => {
        if (record[columnKey.invoiceTotal] == null)
          return <StatusTag color={"#868698"}>N/A</StatusTag>
        return (<TotalInvoicePrice>
          <CurrencyText value={record[columnKey.invoiceTotal]} />
          {/* <CurrencyText value={record.projectRate} /> */}
        </TotalInvoicePrice>)
      }
      ,
    },

    {
      title: '',
      key: 'actions',
      render: (record) => (
        <ActionDiv>
          <Dropdown
            overlay={MoreActions(record)}
            overlayClassName='invoiceMenu'
            placement='bottomRight'
            trigger='click'
          >
            <Button type='link' icon={<EllipsisOutlined />} />
          </Dropdown>
        </ActionDiv>
      ),
    },
  ];

  return (
    <ArchiveJobsWrapper>
      <TitleWrapper>
        <div>
          <Link to={`/companies/${companyId}/jobs`}>
            <Button type='link' className='goBackBtn'>
              <BackIcon width={12} height={20} />
            </Button>
          </Link>
          <ComponentTitle>Archived</ComponentTitle>
        </div>
        {
          selectedJobs.length >= 1 && <>
            <ButtonHolders className="archive-header-btns">
              {
                // selectedJobs.length == 1 && 
                // <Button
                //   type='primary'
                //   className='reinstateBtn'
                //   shape='round'
                //   onClick={handleBulkReinstate}
                // >
                //   Reinstate
                // </Button>
              }
              {
                selectedJobs.length > 1 &&
                <>
                  <Button
                    shape='round'
                    className="downloadBtn"
                    onClick={handleBulkDownload}
                  >
                    Download
                  </Button>
                  <Button
                    className='deleteBtn'
                    type='default'
                    shape='round'
                    icon={<TrashIcon width={14} height={16} fill='#ffffff' />}
                    onClick={handleBulkDelete}
                  >
                    Delete
                  </Button>
                </>
              }
            </ButtonHolders>
          </>
        }
      </TitleWrapper>

      <Spin spinning={fetchListRequest.loading}>
        <TableWrapper className={"archived-job-t"}>
          <ArchiveJobTableWrapper>
            <Table
              columns={columns}
              scroll={{ x: 1024 }}
              dataSource={tableRecords}
              rowSelection={rowSelection}
              className='isoSimpleTable'
              pagination={{
                hideOnSinglePage: true,
                total: tableRecords.length,
                showTotal: (total, range) => {
                  return `Showing ${range[0]}-${range[1]} of ${tableRecords.length} Results`;
                },
              }}
            />
          </ArchiveJobTableWrapper>
        </TableWrapper>
      </Spin>
      {jobRemoveConfirm.visible && (
        <ConfirmModal
          visible={jobRemoveConfirm.visible}
          container={true}
          wrapClassName={'hCentered ml-0'}
          description={jobRemoveConfirm.description}
          confirmLoading={deleteBulkAction.loading || deleteAction.loading}
          onYes={handleConfirmRemoveJobs}
          onNo={() => setJobRemoveConfirm(initialJobRemoveConfirm)}
          yesButtonColor={'#e25656'}
        />
      )}
      {jobReinstate.visible && (
        <ReinstateJobModal
          visible={jobReinstate.visible}
          container={true}
          wrapClassName={'hCentered ml-0'}
          title={jobReinstate.title}
          description={jobReinstate.description}
          isMultipleReinstate={jobReinstate.isMultipleReinstate}
          confirmLoading={false}
          onFinish={() => {
            history.push(`/companies/${companyId}/jobs`);
          }}
          job={jobReinstate.job}
          jobs={selectedJobs}
          onCancel={() => setJobReinstate(initialJobReinstate)}
        />
      )}
    </ArchiveJobsWrapper>
  );
};

export default ArchiveJobs;
