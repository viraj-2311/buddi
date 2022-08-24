import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDNotificationListWrapper = styled.div`
  .notification-item-wrapper {
    padding: 20px 25px;

    &.active {
      background-color: #f2f2f2;

      .notification-time {
        color: #333;
      }
    }

    .sender-photo-wrapper {

      border-radius: 50%;
      width: 72px;
      height: 72px;
      overflow: hidden;
      
      .empty-photo {
        width: 72px;
        height: 72px;
      }
      
      .notification-sender-photo {
        width: 72px;
        height: 72px;
        border-radius: 50%;
      }
    }

    p {
      padding: 5px 0 0;
    }

    .notification-sender-name {
      font-size: 18px;
      font-weight: 600;
      line-height: 1.33;
      color: #333333;
    }

    .notification-content {
      font-size: 14px;
      line-height: 1.36;
      text-align: left;
      color: #333333;
    }

    .notification-time {
      font-size: 12px;
      line-height: 1.42;
      color: #828282;
    }

    
  }

  .ant-divider {
    margin: 0;
  }
  

  @media only screen and (max-width: 767px) {
    
  }

  @media only screen and (min-width: 768px) and (max-width: 991px) {
    
  }
  
`;

const NotificationListWrapper = WithDirection(WDNotificationListWrapper);

export default NotificationListWrapper;
