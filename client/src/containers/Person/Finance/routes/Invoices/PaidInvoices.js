import React, { useEffect, useState } from 'react';
import { Dropdown, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownloadOutlined, DeleteFilled } from '@ant-design/icons';
import StyledContractorInvoiceTable, { TableColumn } from './components/Table';
import {
  LocationSpan,
  TotalInvoice,
  ActionDiv,
  LeftActionDiv,
} from './Invoices.style';
import Button from '@iso/components/uielements/button';
import CurrencyText from '@iso/components/utility/currencyText';
import LocationIcon from '@iso/components/icons/Location';
import { EllipsisOutlined } from '@ant-design/icons';
import { sortIconHeightWidth } from '@iso/lib/helpers/appConstant';
import SortIcon from '@iso/components/icons/Sort';
import {
  sortList,
  formatDateString,
  replaceBlankSpace,
} from '@iso/lib/helpers/utility';
import { Sorter } from '@iso/lib/helpers/sorter';
import ConfirmModal from '@iso/components/Modals/ConfirmNew';
import _ from 'lodash';
import { fetchDownloadInvoiceRequest } from '@iso/redux/companyDocument/actions';

const PaidInvoices = ({ invoices, onView }) => {
  const [tableRecords, setTableRecords] = useState([]);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const columnClassName = selectedInvoices.length ? 'display-none' : '';
  const authUser = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();

  const invoiceAction = {
    DELETE: 'Delete',
    VIEW: 'View',
    DOWNLOAD: 'Download',
  };
  useEffect(() => {
    setTableRecords(
      invoices.map((invoice) => ({ ...invoice, key: invoice.id }))
    );
  }, [invoices]);

  const rowSelection = {
    selectedRowKeys: selectedInvoices.map((invoice) => invoice.key),
    onSelect: (record, selected, selectedRows) => {
      setSelectedInvoices(selectedRows);
    },
    onSelectAll: (selected) => {
      if (selected) {
        setSelectedInvoices(tableRecords);
      } else {
        setSelectedInvoices([]);
      }
    },
  };

  const MoreActions = (record) => {
    return (
      <Menu
        onClick={(e) => {
          if (e.item.node.innerText === invoiceAction.DELETE) {
            setIsConfirmVisible(true);
          } else if (e.item.node.innerText === invoiceAction.DOWNLOAD) {
            const { id: invoiceId, fileName } = record;
            dispatch(
              fetchDownloadInvoiceRequest(
                invoiceId,
                fileName ||
                  `Invoice_${replaceBlankSpace(authUser.fullName)}.pdf`
              )
            );
          } else if (e.item.node.innerText === invoiceAction.VIEW) {
            onView(record);
          }
        }}
      >
        <Menu.Item>{invoiceAction.VIEW}</Menu.Item>
        <Menu.Item>{invoiceAction.DELETE}</Menu.Item>
        <Menu.Item>{invoiceAction.DOWNLOAD}</Menu.Item>
      </Menu>
    );
  };

  const ClientSortActions = (sortKey) => (
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
  const DateSortActions = (sortKey) => (
    <Menu
      onClick={(e) => {
        let sortOption = { sortKey };
        sortOption.sortDir =
          e.item.node.innerHTML === 'Sort Oldest to Newest' ? 'ASC' : 'DESC';
        const copiedTableRecords = _.cloneDeep(tableRecords);
        const sorted = copiedTableRecords.sort((a, b) => {
          if (a.job.startDate === b.job.startDate) {
            // if startDate are same, sort by wrapDate
            return Sorter.DATE(
              a.job.wrapDate,
              b.job.wrapDate,
              sortOption.sortDir === 'DESC' ? -1 : 1
            );
          }
          // otherwise sort by startDate
          return Sorter.DATE(
            a.job.startDate,
            b.job.startDate,
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
  const TotalInvoiceSortActions = (sortKey) => (
    <Menu
      onClick={(e) => {
        let sortOption = { sortKey };
        sortOption.sortDir =
          e.item.node.innerHTML === 'Ascending by Number' ? 'ASC' : 'DESC';
        const copiedTableRecords = _.cloneDeep(tableRecords);
        setTableRecords(
          copiedTableRecords.sort((a, b) => {
            return sortList(a, b, sortOption);
          })
        );
      }}
    >
      <Menu.Item>Ascending by Number</Menu.Item>
      <Menu.Item>Descending by Number</Menu.Item>
    </Menu>
  );

  const columnKey = {
    job_client: 'job.client',
    date: 'dates',
    invoice_amount: 'totalInvoiceAmount',
  };
  const columns = [
    {
      title: () => {
        return columnClassName ? (
          <LeftActionDiv>
            <Button shape='circle' icon={<DeleteFilled />} />
            <Button shape='circle' icon={<DownloadOutlined />} />
          </LeftActionDiv>
        ) : (
          <TableColumn>
            Band
            <Dropdown
              overlay={ClientSortActions(columnKey.job_client)}
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
        );
      },
      dataIndex: ['job', 'client'],
      key: columnKey.job_client,
      render: (client) => client,
    },
    {
      title: <TableColumn className={columnClassName}>Venue</TableColumn>,
      dataIndex: ['job', 'title'],
      render: (title) => title,
    },
    {
      title: <TableColumn className={columnClassName}>Bandleader</TableColumn>,
      dataIndex: ['job', 'agency'],
      render: (agency) => agency,
    },
    {
      title: <TableColumn className={columnClassName}>Gig ID</TableColumn>,
      dataIndex: ['job', 'jobNumber'],
      render: (jobNumber) => jobNumber,
    },
    {
      title: <TableColumn className={columnClassName}>Location</TableColumn>,
      render: (record) => (
        <LocationSpan>
          <LocationIcon height='18' width='14' />
          {record.city}, {record.state}
        </LocationSpan>
      ),
    },
    {
      title: () => (
        <TableColumn className={columnClassName}>
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
          record.job.startDate,
          'MMMM Do, YYYY'
        )} - ${formatDateString(record.job.wrapDate, 'MMMM Do, YYYY')}`;
      },
    },
    {
      title: () => (
        <TableColumn className={columnClassName}>
          Total Invoice
          <Dropdown
            overlay={TotalInvoiceSortActions(columnKey.invoice_amount)}
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
      key: columnKey.invoice_amount,
      render: (record) => (
        <TotalInvoice>
          <CurrencyText value={record.totalInvoiceAmount} />
        </TotalInvoice>
      ),
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
    <>
      <StyledContractorInvoiceTable
        rowSelection={rowSelection}
        columns={columns}
        scroll={{ x: 1024 }}
        dataSource={tableRecords}
        className='paidInvoiceTable'
      />
      {isConfirmVisible && (
        <ConfirmModal
          visible={isConfirmVisible}
          container={true}
          title='Are you sure?'
          description='Do you really want to Delete this Invoice? This action cannot be undone.'
          confirmLoading={false}
          onYes={() => {}}
          onNo={() => setIsConfirmVisible(false)}
          yesButtonColor={'#e25656'}
        />
      )}
    </>
  );
};

export default PaidInvoices;
