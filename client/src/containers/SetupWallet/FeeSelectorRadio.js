import React from 'react';
import FeeSelectorRadioWrapper from './FeeSelectorRadio.style';
import { Row, Col } from 'antd';
import Icon from '@iso/components/icons/Icon';
import BankIcon from '@iso/assets/images/bank.svg';
import LightningIcon from '@iso/assets/images/Lightning.svg';

const FeeSelectorRadio = () => {
  let message = '1-3 business days';
  return (
    <FeeSelectorRadioWrapper>
      <Row className='standard-view'>
        {/* <Col xs={24} md={12}>
          <div className='fee-container left'>
            <input
              id='instant'
              type='radio'
              name='gender'
              value='instant'
              checked
            />
            <label for='instant'>
              <div className='fee-option-container'>
                <div className='fee-option-icon'>
                  <Icon src={LightningIcon} width={25} height={18} />
                </div>
                <div className='fee-option-group'>
                  <p className='fee-option-text'>
                    <span className='bold'>Instant</span>
                    <span>(1% fee)</span>
                  </p>
                  <p className='fee-option-sub-text'>1% fee (max $10.00)</p>
                </div>
              </div>
            </label>
          </div>
        </Col> */}
        <Col md={12} sm={24} xs={24}>
          <div className='fee-container right'>
            <input
              id='standard'
              type='radio'
              name='gender'
              value='standard'
              checked={true}
            />
            <label for='standard'>
              <div className='fee-option-container'>
                <div className='fee-option-icon'>
                  <Icon src={BankIcon} height={30} />
                </div>
                <div className='fee-option-group'>
                  <p className='fee-option-text'>
                    <span className='bold'>Standard </span>
                    <span>(Free)</span>
                  </p>
                  <p className='fee-option-sub-text'>{message}</p>
                </div>
              </div>
            </label>
          </div>
        </Col>
      </Row>
    </FeeSelectorRadioWrapper>
  );
};

export default FeeSelectorRadio;
