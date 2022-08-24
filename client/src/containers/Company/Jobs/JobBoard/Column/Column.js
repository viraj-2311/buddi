import React, { useContext, useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import JobList from '../Job/JobList/JobList';
import Title from '../Title/Title';
import { Container, Header, CreateButton, AntSelect, AntSelectOption } from './Column.style';
import CompanyAccountIntro from '@iso/containers/IntroToolTip/CompanyAccountIntro';
import Popover from '@iso/components/uielements/popover';
import { TypeUser } from '@iso/containers/IntroToolTip/TooltipData';
import {
  TableColumn,
} from '@iso/components/Table/Table.style';
import { EllipsisOutlined } from '@ant-design/icons';
import Table from '@iso/components/Table';
import { Dropdown, Menu, Spin } from 'antd';
import Button from "@iso/components/uielements/button";
import JobBoardContext from '../JobBoardContext';
import PlusIcon from '@iso/components/icons/Plus';
import { formatDateRange, formatTimeString } from "@iso/lib/helpers/utility";
import JobStatus from "@iso/enums/job_status";
import { useSelector } from "react-redux";
import JobUpdateTypes from "@iso/enums/job_update_types";
import InvoiceStatus from "../../../../Person/Finance/routes/Invoices/components/InvoiceStatus";


// const { onEdit, onDelete, onOpen, onActivate, onWrap, onArchive } = useContext(JobBoardContext);


const Column = ({
  title,
  column,
  jobs,
  totalRecord,
  viewType,
  index,
  isScrollable,
  typeUser,
  currentStepIntro,
}) => {
  const { onCreate,onEdit, onDelete, onOpen, onActivate, onWrap, onArchive  } = useContext(JobBoardContext);
  const [clickedBtnId,setClickedBtnId] = useState('');
  
  const MoreActions = (record) => {
    return (
      <Menu>
      <Menu.Item onClick={() => onOpen(record)}>View</Menu.Item>
      <Menu.Item onClick={() => onEdit(record)} key={'edit-job-info'}>
        Edit Gig
      </Menu.Item>
      <Menu.Item onClick={() => onArchive(record)} key={'archive-job'}>
        Archive This Gig
      </Menu.Item>
      <Menu.Item onClick={() => onDelete(record)} key={'delete-job'}>
        Delete
      </Menu.Item>
    </Menu>
    );
  };
  const {
    update: { loading: updateLoading, type: updateType },
  } = useSelector((state) => state.ProducerJob);
  const dataLength = 10;
  
// console.log(totalRecord,'fds');
  const renderAction = (record) => {

    return (
      (record.status === JobStatus.HOLDING) ?
      onActivate(record) : ((record.status === JobStatus.ACTIVE) ? onWrap(record) : ((record.status === JobStatus.WRAPPED) ? onArchive(record) : ''))
    )
  };

 
  const tableColumns = [
    {
      title: () => <TableColumn>Band Name</TableColumn>,
      key: 'client',
      dataIndex: 'client',
      render: (client) => client,
    },
    {
      title: () => <TableColumn>Venue</TableColumn>,
      key: 'title',
      dataIndex: 'title',
      render: (title,record) =>  (record.agency != '') ? record.agency + ' - ' + title : title,
    },
    {
      title: () => <TableColumn>Gig #</TableColumn>,
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      render: (jobNumber) => jobNumber,
    },
    {
      title: () => (
        <TableColumn>
          Date
        </TableColumn>
      ),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate,wrapDate) => formatDateRange(startDate, wrapDate) ,
    },
    {
      title: () => <TableColumn>Sound Check Time</TableColumn>,
      key: 'soundCheckTime',
      dataIndex: 'soundCheckTime',
      render: (soundCheckTime) => formatTimeString(soundCheckTime),
    },
    {
      title: () => <TableColumn>Set Time</TableColumn>,
      key: 'setTime',
      dataIndex: 'setTime',
      render: (setTime) => formatTimeString(setTime),
    },
    {
      title: () => <TableColumn>Status</TableColumn>,
      key: 'status',
      dataIndex: 'status',
      render: (paidStatus) => InvoiceStatus(paidStatus.charAt(0).toUpperCase() + paidStatus.slice(1)),
    },
    {
      title: '',
      key: 'buttons',
      render: (record) => 
      (<div>
         <Button id={record.id} className="table-action-btn" loading= {clickedBtnId == record.id &&updateLoading && record.status !== JobStatus.ACTIVE} onClick={() =>{setClickedBtnId(record.id); renderAction(record)} }>{column.action}</Button>
        </div>)
    },

    {
      title: '',
      key: 'actions',
      render: (record) => (
        <div>
          <Dropdown
            overlay={MoreActions(record)}
            overlayClassName='invoiceMenu'
            placement='bottomRight'
            trigger='click'
          >
            <Button type='link' icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      ),
    },
  ];
  // console.log(tableRows.length,'sdjfkd');

  return (
    <Draggable draggableId={title} index={index} isDragDisabled ={viewType === 'grid' ? false: true}>
      {(provided, snapshot) => (
        <Container
          color={column.color}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={ viewType == 'list' ? "list-view-container":  ''}
        >
          <Header className="table-title-header" isDragging={snapshot.isDragging}>
            <Title
              isDragging={snapshot.isDragging}
              {...provided.dragHandleProps}
            >
              {title}
            </Title>
            {viewType === 'list' && 
            <CreateButton color={column.color} onClick={() => onCreate(column.type)}>
              <PlusIcon width={16} height={14} fill={column.color} />
              <span>{column.addButtonText}</span>
            </CreateButton> }
          </Header>
          <Popover
            placement={'bottom'}
            content={<CompanyAccountIntro currentStep={currentStepIntro} />}
            visible={
              currentStepIntro >= 0 && index + 1 == currentStepIntro
                ? true
                : false
            }
          >
            {viewType == 'list' && <div className="mix-gigs-list-table">
              <Table
                columns={tableColumns}
                scroll={{ x: 1024 }}
                dataSource={jobs}
                className='isoSimpleTable gigs-list'
                pagination={jobs.length > dataLength ? true : false}
                rowClassName={'gig-list-view-row'}
                // onRow={(record, rowIndex) => {
                //   return {
                //     // onClick: event => {onOpen(record)}, // click row
                //   };
                // }}
              />
            </div>}
            {viewType == 'grid' && <JobList
              listId={column.id}
              listType='JOB'
              column={column}
              jobs={jobs}
              internalScroll={isScrollable}
            />}
          </Popover>
        </Container>
      )}
    </Draggable>
  );
};

export default Column;
