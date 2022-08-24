import React, { useState, useEffect } from 'react';
import Table from '@iso/components/Table';
import { useDispatch, useSelector } from 'react-redux';
import Spin from '@iso/components/uielements/spin';
import { TableColumn, TableWrapper } from '@iso/components/Table/Table.style';
import Button from '@iso/components/uielements/button';
import { DownloadOutlined, FilePdfFilled } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import { sortList } from '@iso/lib/helpers/utility';
import {
  ActionDiv,
  IconWithText,
  TableHeaderActionDiv,
} from '../Documents.style';
import { DocumentListWrapper } from './DocumentList.style';
import SortIcon from '@iso/components/icons/Sort';
import {
  JobDocumentTypes,
  sortIconHeightWidth,
} from '@iso/lib/helpers/appConstant';
import { downloadFile } from '@iso/lib/helpers/s3';
import _ from 'lodash';
import { fetchDownloadInvoiceRequest } from '@iso/redux/companyDocument/actions';

const DocumentList = ({ documents, documentLoading, documentType }) => {
  const dispatch = useDispatch();
  const [tableRecords, setTableRecords] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const {
    download_invoice: { loading: downloadInvoiceLoading },
  } = useSelector((state) => state.CompanyDocument);
  const [downloadW9Loading, setDownloadW9Loading] = useState(false);

  useEffect(() => {
    setTableRecords(
      documents.map((doc) => ({
        ...doc,
        key: documentType === JobDocumentTypes.W9 ? doc.id : doc.invoiceId,
      }))
    );
  }, [documents]);

  const columnKey = {
    name: documentType === JobDocumentTypes.W9 ? 'name' : 'fileName',
  };

  const downloadW9 = (record) => {
    const { path, name } = record;
    downloadFile(path, name);
  };

  const downloadInvoice = (record) => {
    const { invoiceId, fileName } = record;
    dispatch(fetchDownloadInvoiceRequest(invoiceId, fileName));
  };

  const handleDownloadFile = (record) => {
    if (documentType === JobDocumentTypes.W9) {
      downloadW9(record);
    } else if (documentType === JobDocumentTypes.INVOICES) {
      downloadInvoice(record);
    }
  };
  const handleNameClick = (record) => {
    if (documentType === JobDocumentTypes.INVOICES) {
      downloadInvoice(record);
    }
  };

  const handleDownloadMultipleDocument = () => {
    setDownloadW9Loading(true);
    selectedDocuments.forEach(async (document) => {
      handleDownloadFile(document);
    });
    setDownloadW9Loading(false);
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

  const columns = [
    {
      title: () => (
        <TableColumn className='action-btn'>
          <TableHeaderActionDiv>
            <Button
              type='primary'
              shape='round'
              className='downloadBtn'
              loading={downloadW9Loading || downloadInvoiceLoading}
              onClick={handleDownloadMultipleDocument}
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
      key: columnKey.name,
      render: (record) => (
        <IconWithText
          href={record.path}
          target='_blank'
          title={record.name || record.fileName}
          onClick={() => handleNameClick(record)}
        >
          <div className='no-background'>
            <FilePdfFilled
              width={20}
              height={16}
              style={{ color: '#ff6565' }}
            />
          </div>
          {record.name || record.fileName}
        </IconWithText>
      ),
    },

    {
      title: '',
      key: 'actions',
      render: (record) => (
        <ActionDiv>
          <Button type='link' onClick={() => handleDownloadFile(record)}>
            <DownloadOutlined />
          </Button>
        </ActionDiv>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedDocuments.map((job) => job.key),
    onSelect: (record, selected, selectedRows) => {
      setSelectedDocuments(selectedRows);
    },
    onSelectAll: (selected) => {
      setSelectedDocuments(selected ? tableRecords : []);
    },
  };

  return (
    <DocumentListWrapper>
      <Spin spinning={documentLoading}>
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
    </DocumentListWrapper>
  );
};

export default DocumentList;
