import { Col, Row } from 'antd';
import cn from 'classnames';
import React from 'react';
import { Tag } from 'antd';
import CurrencyText from '@iso/components/utility/currencyText';
// import BookCrewStatus from '@iso/components/utility/BookCrewStatus';
import { bookCrewStatusList } from '@iso/lib/helpers/appConstant';

const BookCrewItem = ({ crew }) => {
  const statusColor = (memoStatus) => {
    const memoStatusObj = bookCrewStatusList.find(
      (e) => e.status === memoStatus || !e.status
    );
    return memoStatusObj.color;
  };

  const choiceValue = (choice) => {
    switch (choice) {
      case 1:
        return { text: '1st choice', color: '#19913d' };
      case 2:
        return { text: '2nd choice', color: '#79acff' };
      case 3:
        return { text: '3rd choice', color: '#ffa177' };
      default:
        return { text: '', color: '' };
    }
  };

  return (
    crew && (
      <Row>
        <Col span={8}>
          <Tag
            className='choiceTag text-center'
            color={choiceValue(crew.choiceLevel).color}
          >
            {choiceValue(crew.choiceLevel).text}
          </Tag>
          {crew.name}
        </Col>
        <Col span={6}>{crew.date}</Col>
        <Col span={4}>{crew.dailyHours}</Col>
        <Col span={3} className='boldText'>
          <CurrencyText value={crew.totalPay} />
        </Col>
        <Col span={3} className='status-col'>
          <Tag
            className={cn('text-center', {
              blank_status: !crew.memoStatus,
            })}
            color={statusColor(crew.memoStatus)}
          >
            {crew.memoStatus}
          </Tag>
        </Col>
      </Row>
    )
  );
};

export default BookCrewItem;
