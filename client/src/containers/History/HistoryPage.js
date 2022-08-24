import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Row, Col } from 'antd';
import HistoryWrapper from './HistoryPage.style';
import Button from '@iso/components/uielements/button';
import TextField from '@iso/components/TextField';
import { SearchOutlined } from '@ant-design/icons';
import { displayDateFormat } from '@iso/config/datetime.config';
import { stringToDate, formatDateString } from '@iso/lib/helpers/utility';
import Paginations from '@iso/components/uielements/pagination';
import DatePicker from '@iso/components/uielements/datePicker';
import Collapse from '@iso/components/uielements/collapse';
import CalendarIcon from '@iso/components/icons/Calendar';
import MasterIcon from '@iso/components/icons/Master';
import LeftIcon from '@iso/components/icons/Left';
import {
  getHistoryPayment,
  getDownloadHistoryTransactionPdf,
} from '@iso/redux/wallet/actions';
import notify from '@iso/lib/helpers/notify';
import Spin from '@iso/components/uielements/spin';
import PageHeader from './Header';
import {
  displayFormatMoney,
  convertCurrencyToDollar,
} from '@iso/lib/helpers/numberUtil';
import DownloadIcon from '@iso/components/icons/Download';
import { getFileTransactionFdf } from '@iso/redux/wallet/actions';
import Select, { SelectOption } from '@iso/components/uielements/select';
import { DownloadOutlined } from '@ant-design/icons';
const Option = SelectOption;

const { Panel } = Collapse;

const filterType = [
  {
    name: 'All',
    value: 'ALL',
  },
  {
    name: 'Transfers',
    value: 'TRANSFERS',
  },
  {
    name: 'Buddi Payments',
    value: 'BUDDY_PAYMENTS',
  },
  {
    name: 'Payments Received',
    value: 'PAYMENTS_RECEIVED',
  },
  {
    name: 'Job Payments',
    value: 'JOB_PAYMENTS',
  },
];

const hasReceiving = (transferItem) => {
  return transferItem.side === 'credit';
};

const displayTitle = (transferItem) => {
  let title = '-';
  const receivingMoney = hasReceiving(transferItem);
  if (receivingMoney) {
    if (transferItem.processed) {
      if (transferItem.senderName) {
        title = `${transferItem.senderName} paid you`;
      } else if (transferItem.type === 'fiat_to_sila') {
        title = `Transferred funds from your bank to your wallet account`;
      } else if (transferItem.type === 'sila_to_fiat') {
        title = `Transferred funds from your wallet to your bank account`;
      }
    } else {
      if (transferItem.senderName) {
        title = `Pending - Payment from ${transferItem.senderName}`;
      } else if (transferItem.type === 'fiat_to_sila') {
        title = `Pending - Bank to Wallet Account Transfer`;
      } else if (transferItem.type === 'sila_to_fiat') {
        title = `Pending - Wallet to Bank Account Transfer`;
      }
    }
  } else {
    if (transferItem.processed) {
      if (transferItem.receiverName) {
        title = `Transferred payment to ${transferItem.receiverName}`;
      } else if (transferItem.type === 'fiat_to_sila') {
        title = `Transferred funds from your bank to your wallet account`;
      } else if (transferItem.type === 'sila_to_fiat') {
        title = `Transferred funds from your wallet to your bank account`;
      }
    } else {
      if (transferItem.receiverName) {
        title = `Pending - Payment to ${transferItem.receiverName}`;
      } else if (transferItem.type === 'fiat_to_sila') {
        title = `Pending - Bank to Wallet Account Transfer`;
      } else if (transferItem.type === 'sila_to_fiat') {
        title = `Pending - Wallet to Bank Account Transfer`;
      }
    }
  }
  return title;
};

const PanelHeader = ({
  icon,
  eventName,
  description,
  dateString,
  money = 0,
  receivingMoney,
  isPending,
}) => (
  <div className='panel-header'>
    <Row className='panel-header-container'>
      <Col className='header-icon-view' xs={6} md={3}>
        {icon && (
          <Button type='defaut' shape='circle' size={15}>
            {icon}
          </Button>
        )}
      </Col>
      <Col xs={18} md={21}>
        <div className='panel-header-content'>
          <Row>
            <Col xs={14}>
              <p className={`event ${isPending && 'pending'}`}>{eventName}</p>
              <p className='date'>{dateString}</p>
              <p className='description'>{description}</p>
            </Col>
            <Col xs={10}>
              <div
                className={`total-money ${receivingMoney ? 'positive' : ''}`}
              >
                <span>{receivingMoney ? '+' : '-'}</span>
                <span>$ </span>
                <span>{`${money}`}</span>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </div>
);

const PanelContent = ({
  transferFrom,
  transferID,
  transferDetail,
  money,
  receivingMoney,
  isPending,
  handleDownload,
}) => (
  <div className='panel-content'>
    <Row>
      <Col xs={6} md={3}></Col>
      <Col xs={18} md={21}>
        <div className='panel-content-content'>
          <Row>
            <Col xs={24} sm={12}>
              <p className='content-header'>Transfer from</p>
              <p className='content-value'>{transferFrom}</p>
              <p className='content-header transfer-id'>Transfer ID</p>
              <p className='content-value'>{transferID}</p>
            </Col>
            <Col xs={24} sm={12}>
              <p className='content-header'>Instant transfer to</p>
              <Row>
                <Col xs={16}>
                  <p className=''>Visa</p>
                </Col>
                <Col xs={8}>
                  <div className='money'>
                    <span>{receivingMoney ? '+' : '-'}$ </span>
                    <span>{`${money}`}</span>
                  </div>
                </Col>
              </Row>
              <p className='content-header detail'>Detail</p>
              <Row>
                <Col xs={16}>
                  <p className={`content-value ${isPending && 'pending'}`}>
                    {transferDetail}
                  </p>
                </Col>
                <Col xs={8}>
                  <div className='money'>
                    <span>{receivingMoney ? '+' : '-'}$ </span>
                    <span>{`${money}`}</span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className='panel-content-bottom'>
            <Col xs={24} sm={12}>
              <div className='action'>
                <Button
                  icon={<DownloadOutlined />}
                  shape='circle'
                  className='downloadBtn'
                  onClick={() => handleDownload()}
                />
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <Row className='summary'>
                <Col xs={16}>
                  <p className='content-header'>Amount</p>
                </Col>
                <Col xs={8}>
                  <div className='total-money'>
                    <span>{receivingMoney ? '+' : '-'}$ </span>
                    <span>{money}</span>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  </div>
);

const HistoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userHistoryPayment, historyTransactionPdf } = useSelector(
    (state) => state.Wallet
  );
  const { companyId } = useSelector((state) => state.AccountBoard);
  const { user } = useSelector((state) => state.User);
  const [currentHistoryItem, setCurrentHistoryItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [keySearch, setKeySearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState('ALL');

  useEffect(() => {
    let today = new Date();
    let last3Months = new Date();
    if (startDate == '' && endDate == '') {
      last3Months.setMonth(today.getMonth() - 3);
      setStartDate(last3Months);
      setEndDate(today);
    }
    if (companyId == null || companyId == 'null') {
      let payload = {
        start_date: Date.parse(last3Months),
        end_date: Date.parse(today),
      };
      if (keySearch.length > 0) {
        payload.key_search = keySearch;
      }
      dispatch(getHistoryPayment(null, payload));
    } else {
      let payload = {
        start_date: Date.parse(last3Months),
        end_date: Date.parse(today),
      };
      if (keySearch.length > 0) {
        payload.key_search = keySearch;
      }
      dispatch(getHistoryPayment(companyId, payload));
    }
  }, []);

  useEffect(() => {
    if (
      userHistoryPayment.data &&
      userHistoryPayment.data.length >= 0 &&
      !userHistoryPayment.loading
    ) {
      setLoading(false);
      let data = userHistoryPayment.data.slice(0, 10);
      setCurrentHistoryItem(data);
      setCurrentPage(1);
    } else if (!userHistoryPayment.loading) {
      setLoading(false);
      setCurrentPage(0);
    }
  }, [userHistoryPayment]);

  useEffect(() => {
    if (!historyTransactionPdf.loading && historyTransactionPdf.success) {
      setLoading(false);
    } else if (!historyTransactionPdf.loading && historyTransactionPdf.error) {
      setLoading(false);
      notify(
        'error',
        'Sorry, Buddi can not download your history transactions'
      );
    }
  }, [historyTransactionPdf]);

  const onChangePage = (page, pageSize) => {
    let data = userHistoryPayment.data.slice((page - 1) * 10, page * 10);
    setCurrentHistoryItem(data);
  };

  const setDateFilter = (name, date) => {
    if (name === 'startDate') {
      setStartDate(date);
    } else if (name === 'endDate') {
      setEndDate(date);
    }
  };

  const onSearchTextChange = (event) => {
    setKeySearch(event.target.value);
  };

  const downloadHistory = () => {
    setLoading(true);
    let payload = {
      start_date: Date.parse(startDate),
      end_date: Date.parse(endDate),
      transaction_type: '',
    };
    if (keySearch.length > 0) {
      payload.key_search = keySearch;
    }
    if (currentFilterType !== 'ALL') {
      payload.transaction_type = currentFilterType;
    }
    if (companyId == null || companyId == 'null') {
      dispatch(getDownloadHistoryTransactionPdf(null, payload));
    } else {
      dispatch(getDownloadHistoryTransactionPdf(companyId, payload));
    }
  };

  const filterHistory = () => {
    setLoading(true);
    let payload = {
      start_date: Date.parse(startDate),
      end_date: Date.parse(endDate),
      transaction_type: '',
    };
    if (keySearch.length > 0) {
      payload.key_search = keySearch;
    }
    if (currentFilterType !== 'ALL') {
      payload.transaction_type = currentFilterType;
    }
    if (companyId == null || companyId == 'null') {
      dispatch(getHistoryPayment(null, payload));
    } else {
      dispatch(getHistoryPayment(companyId, payload));
    }
  };

  const handleDownload = (transferID, type) => {
    dispatch(getFileTransactionFdf({ transferID, type }));
  };

  const goBack = () => {
    if (companyId == null || companyId == 'null') {
      history.push(`/wallet`);
    } else {
      history.push(`/companies/${companyId}/wallet`);
    }
  };

  if (currentPage < 1) {
    return (
      <HistoryWrapper>
        <div className='loading-view'>
          <Spin></Spin>
        </div>
      </HistoryWrapper>
    );
  }

  return (
    <Spin spinning={loading}>
      <HistoryWrapper>
        <PageHeader goBack={goBack} />
        <div className='content-title'>
          <span>History</span>
        </div>
        <div className='content'>
          <Row>
            <Col xs={24} md={12}>
              <div className='datetime-wrapper'>
                <div className='formGroup'>
                  <label className='fieldLabel'>Start</label>
                  <DatePicker
                    className='datetime-from'
                    allowClear={false}
                    name='startDate'
                    style={{ width: '100%' }}
                    value={stringToDate(startDate)}
                    onChange={(date) => {
                      setDateFilter('startDate', formatDateString(date));
                    }}
                    suffixIcon={
                      <CalendarIcon width={22} height={22} fill='#bcbccb' />
                    }
                    format={displayDateFormat}
                    placeholder=''
                  />
                </div>
                <div className='formGroup'>
                  <label className='fieldLabel fake-label'>To</label>
                  <div className='fake-input-container'>
                    <LeftIcon width={19} height={8} fill='#bcbccb' />
                  </div>
                </div>
                <div className='formGroup'>
                  <label className='fieldLabel'>End</label>
                  <DatePicker
                    className='datetime-to'
                    allowClear={false}
                    name='endDate'
                    style={{ width: '100%' }}
                    value={stringToDate(endDate)}
                    onChange={(date) => {
                      setDateFilter('endDate', formatDateString(date));
                    }}
                    suffixIcon={
                      <CalendarIcon width={22} height={22} fill='#bcbccb' />
                    }
                    format={displayDateFormat}
                    placeholder=''
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} md={12} className='filtering'>
              <div className='search-container-wrapper'>
                <label className='fieldLabel fake-label'>Seach</label>
                <div className='search-container'>
                  <TextField
                    prefixIcon={<SearchOutlined />}
                    onChange={onSearchTextChange}
                    value={keySearch}
                    placeholder='Search Activities'
                  ></TextField>
                </div>
              </div>
              <div className='search-container-wrapper'>
                <label className='fieldLabel'>Filter</label>
                <div className='search-container'>
                  <Select
                    className='filter-style'
                    name='businessType'
                    value={currentFilterType}
                    onChange={(value) => {
                      console.log(value);
                      setCurrentFilterType(value);
                    }}
                  >
                    {filterType.map((item) => (
                      <Option value={item.value} key={item.value}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </Col>
          </Row>
          <Row className='button-area'>
            <Button
              type='primary'
              shape='round'
              className={'buttonWrap'}
              onClick={() => filterHistory()}
            >
              Search
            </Button>
            <Button
              icon={DownloadIcon}
              type='primary'
              shape='round'
              className={'buttonWrap'}
              onClick={() => downloadHistory()}
              icon={<DownloadOutlined />}
            >
              Download
            </Button>
          </Row>
          <p className='content-status'>Completed</p>
          <p className='content-date'>
            {formatDateString(startDate, displayDateFormat)}
          </p>

          <Collapse
            bordered={false}
            expandIconPosition='right'
            defaultActiveKey={'item-0'}
            accordion={true}
          >
            {currentHistoryItem.map((transaction, index) => {
              const receivingMoney = transaction.side === 'credit';
              let amountTransaction = displayFormatMoney(
                convertCurrencyToDollar(transaction.amount)
              );
              return (
                <Panel
                  header={
                    <PanelHeader
                      icon={
                        <MasterIcon width={16} height={16} fill='#FFFFFF' />
                      }
                      eventName={displayTitle(transaction)}
                      description={transaction.note ? transaction.note : '-'}
                      dateString={formatDateString(
                        transaction.createdAt,
                        displayDateFormat
                      )}
                      money={amountTransaction}
                      receivingMoney={receivingMoney}
                      isPending={!transaction.processed}
                    />
                  }
                  id={`${index}`}
                  key={`item-${index}`}
                >
                  <PanelContent
                    transferFrom='Buddi Wallet'
                    transferID={transaction.transferId || '-'}
                    transferDetail={
                      transaction.processed ? 'Transferred' : 'Pending'
                    }
                    money={amountTransaction}
                    receivingMoney={receivingMoney}
                    isPending={!transaction.processed}
                    handleDownload={() =>
                      handleDownload(transaction.id, transaction.type)
                    }
                  />
                </Panel>
              );
            })}
          </Collapse>
          {userHistoryPayment.data && userHistoryPayment.data.length > 0 && (
            <div className='paging-history'>
              <Paginations
                onChange={onChangePage}
                total={userHistoryPayment.data.length}
              />
            </div>
          )}
        </div>
      </HistoryWrapper>
    </Spin>
  );
};

export default HistoryPage;
