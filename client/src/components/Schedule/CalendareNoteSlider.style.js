import React from 'react';
import { Modal } from 'antd';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';

const AntModal = props => <Modal {...props} />;

const WDCalendarNoteSliderModal = styled(AntModal)`
  .ant-modal-body {
    padding: 0;
  }
  
  .ant-modal-close {
    width: 44px;
    height: 44px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: ${borderRadius('50%')};
    
    .ant-modal-close-x {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
    }    
  }
  
  .ant-modal-content {
    background: transparent;
    box-shadow: none;
  }
  
  .ant-modal-body {
    .swiper-button-next, .swiper-button-prev {
      color: #bdbdbd;
    }
    
    .fullSlider {
      img {
        width: 100%;
        height: 460px;
      }
      
      .slide {
        position: relative;
        
        .removeImgBtn {
          position: absolute;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.6);
          padding: 2px 10px;
          color: #ffffff;
        }        
      }
    }
    
    .thumbSlider {
      margin-top: 10px;
      
      img {
        width: auto;
        height: 94px;
      }
    }
  }
  
`;

const CalendarNoteSliderModal = WithDirection(WDCalendarNoteSliderModal);

export default CalendarNoteSliderModal