import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@iso/components/Table';
import { TableColumn, TableWrapper } from '@iso/components/Table/Table.style';
import Document from '@iso/components/icons/Document';
import { Dropdown, Menu } from 'antd';
import Button from '@iso/components/uielements/button';
import {
  ActionDiv,
  IconWithText,
  TableHeaderActionDiv,
} from '../Documents.style';
import { DocumentListWrapper } from './DocumentTypeList.style';
import _ from 'lodash';
import SortIcon from '@iso/components/icons/Sort';
import { sortList } from '@iso/lib/helpers/utility';
import {
  JobDocumentTypes,
  sortIconHeightWidth,
} from '@iso/lib/helpers/appConstant';
import { DownloadOutlined } from '@ant-design/icons';

import {
  fetchDownloadAllInvoiceAsZipRequest,
  fetchDownloadAllW9AsZipRequest,
} from '@iso/redux/companyDocument/actions';

const DocumentList = ({ selectedJob, onDocumentTypeSelect }) => {
  const dispatch = useDispatch();
  const {
    download_w9s: { loading: downloadW9Loading },
    download_invoices: { loading: downloadInvoicesLoading },
  } = useSelector((state) => state.CompanyDocument);

  const [tableRecords, setTableRecords] = useState([
    { type: JobDocumentTypes.INVOICES, key: 1 },
    { type: JobDocumentTypes.W9, key: 2 },
  ]);

  const [selectedDocumentType, setSelectedDocumentType] = useState([]);

  const columnKey = {
    name: 'type',
  };

  const handleDownload = (docType) => {
    const { id, title } = selectedJob;
    if (docType === JobDocumentTypes.W9) {
      dispatch(fetchDownloadAllW9AsZipRequest(id, title));
    } else if (docType === JobDocumentTypes.INVOICES) {
      dispatch(fetchDownloadAllInvoiceAsZipRequest(id, title, {}));
    }
  };

  const handleDownloadMultipleDocumentType = () => {
    selectedDocumentType.forEach((documentType) => {
      const { type } = documentType;
      handleDownload(type);
    });
  };

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
    selectedRowKeys: selectedDocumentType.map((job) => job.key),
    onSelect: (record, selected, selectedRows) => {
      setSelectedDocumentType(selectedRows);
    },
    onSelectAll: (selected) => {
      setSelectedDocumentType(selected ? tableRecords : []);
    },
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
              onClick={handleDownloadMultipleDocumentType}
              loading={downloadW9Loading || downloadInvoicesLoading}
              icon={<DownloadOutlined />}
            >
              Download
            </Button>
          </TableHeaderActionDiv>
          Name
          <Dropdown
            overlay={StringSortActions(columnKey.name)}
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
      dataIndex: columnKey.name,
      render: (type) => (
        <IconWithText onClick={() => onDocumentTypeSelect(type)}>
          <div>
            <Document width={20} height={16} fill={'#f48d3a'} />
          </div>
          <p>{type}</p>
        </IconWithText>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: (record) => (
        <ActionDiv>
          <Button type='link' onClick={() => handleDownload(record.type)}>
            <DownloadOutlined />
          </Button>
        </ActionDiv>
      ),
    },
  ];

  return (
    <DocumentListWrapper>
      <TableWrapper>
        <Table
          columns={columns}
          rowSelection={rowSelection}
          scroll={{ x: 1024 }}
          dataSource={tableRecords}
          className='producersCompletedInvoice'
        />
      </TableWrapper>
    </DocumentListWrapper>
  );
};

export default DocumentList;
