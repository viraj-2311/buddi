import React, { useState, useEffect } from 'react';
import Table from '@iso/components/Table';
import { TableColumn, TableWrapper } from '@iso/components/Table/Table.style';
import Spin from '@iso/components/uielements/spin';
import { Dropdown, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@iso/components/uielements/button';
import { JobListWrapper } from './JobList.style';
import Document from '@iso/components/icons/Document';
import _ from 'lodash';
import { DownloadOutlined } from '@ant-design/icons';
import SortIcon from '@iso/components/icons/Sort';
import { sortList, formatDateString } from '@iso/lib/helpers/utility';
import { sortIconHeightWidth } from '@iso/lib/helpers/appConstant';
import { Sorter } from '@iso/lib/helpers/sorter';
import {
  ActionDiv,
  IconWithText,
  TableHeaderActionDiv,
} from '../Documents.style';
import { fetchDownloadAllAsZipRequest } from '@iso/redux/companyDocument/actions';

const JobList = ({ onJobSelect }) => {
  const dispatch = useDispatch();
  const [tableRecords, setTableRecords] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const {
    jobs: { list: jobList, loading: jobLoading },
    download_all: { loading: downloadAllLoading },
  } = useSelector((state) => state.CompanyDocument);

  useEffect(() => {
    setTableRecords(jobList.map((job) => ({ ...job, key: job.id })));
  }, [jobList]);

  const columnKey = {
    client: 'client',
    title: 'title',
    date: 'date',
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

  const handleDownload = (id, title) => {
    dispatch(fetchDownloadAllAsZipRequest(id, title));
  };

  const handleDownloadMultipleJobDocument = () => {
    selectedJobs.forEach((job) => {
      const { id, title } = job;
      handleDownload(id, title);
    });
  };

  const columns = [
    {
      title: () => (
        <TableColumn className='action-btn'>
          <TableHeaderActionDiv>
            <Button
              type='primary'
              shape='round'
              className='downloadBtn'
              onClick={handleDownloadMultipleJobDocument}
              icon={<DownloadOutlined />}
              loading={downloadAllLoading}
            >
              Download
            </Button>
          </TableHeaderActionDiv>
          Client
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
        <IconWithText onClick={() => onJobSelect(record)}>
          <div>
            <Document width={20} height={16} fill={'#f48d3a'} />
          </div>
          <p>{record.client}</p>
        </IconWithText>
      ),
    },
    {
      title: () => (
        <TableColumn>
          Gig Name
          <Dropdown
            overlay={StringSortActions(columnKey.title)}
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
      dataIndex: columnKey.title,
      render: (title) => title,
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
      title: '',
      key: 'actions',
      render: (record) => (
        <ActionDiv>
          <Button
            type='link'
            onClick={() => handleDownload(record.id, record.title)}
          >
            <DownloadOutlined />
          </Button>
        </ActionDiv>
      ),
    },
  ];

  return (
    <JobListWrapper>
      <Spin spinning={jobLoading}>
        <TableWrapper>
          <Table
            columns={columns}
            rowSelection={rowSelection}
            scroll={{ x: 1024 }}
            dataSource={tableRecords}
            className='producersCompletedInvoice'
          />
        </TableWrapper>
      </Spin>
    </JobListWrapper>
  );
};

export default JobList;
