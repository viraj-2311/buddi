import React from 'react';
import { Row, Col } from 'antd';
import TransferHistoryWrapper from './TransferHistory.style';
import Button from '@iso/components/uielements/button';
import { displayDateFormat } from '@iso/config/datetime.config';
import { formatDateString } from '@iso/lib/helpers/utility';
import Collapse from '@iso/components/uielements/collapse';
import MasterIcon from '@iso/components/icons/Master';
import {
  displayFormatMoney,
  convertCurrencyToDollar,
} from '@iso/lib/helpers/numberUtil';
import DownloadIcon from '@iso/components/icons/Download';

const { Panel } = Collapse;

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
                <span>{receivingMoney ? '+ ' : '- '}</span>
                <span>$</span>
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
                    <span>$</span>
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
                    <span>$</span>
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
                  shape='circle'
                  className='downloadBtn'
                  icon={
                    <DownloadIcon width={18} height={18} stroke='#2f2e50' />
                  }
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
                    <span>$</span>
                    <span>{`${money}`}</span>
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

const TransferHistory = ({
  hasOpenHistoryItem,
  currentHistoryItem,
  userId,
  companyId,
  handleDownload,
}) => {
  return (
    <TransferHistoryWrapper>
      <div className='content'>
        <p className='content-status'>Completed</p>
        <p className='content-date'>
          {formatDateString(new Date(), displayDateFormat)}
        </p>
        <Collapse
          bordered={false}
          expandIconPosition='right'
          defaultActiveKey={'item-0'}
          accordion={true}
        >
          {currentHistoryItem.map((transaction, index) => {
            let amountTransaction = displayFormatMoney(
              convertCurrencyToDollar(transaction.amount)
            );
            const receivingMoney = transaction.side === 'credit';
            return (
              <Panel
                header={
                  <PanelHeader
                    icon={<MasterIcon width={16} height={16} fill='#FFFFFF' />}
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
      </div>
    </TransferHistoryWrapper>
  );
};

export default TransferHistory;
