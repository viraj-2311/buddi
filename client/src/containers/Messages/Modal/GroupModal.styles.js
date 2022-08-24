import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { transition, borderRadius } from '@iso/lib/helpers/style_utils';
import WithDirection from '@iso/lib/helpers/rtl';

const GroupModalWrapper = styled(Modal)`
  .ant-modal {
    width: 460px !important;
    min-height: 480px !important;
  }
  .ant-modal-content {
    border-radius: 4px;
    min-height: 480px;
    

    .ant-modal-body {
      padding: 0;
      height: calc(100% - 55px);

      .ant-input-affix-wrapper {
        background: #f2f2f2;
        padding: 0 19px 0 24px;
      }
      .ant-input {
        
        padding: 16px 0;
        font-size: 14px;

        &__placeholder {
          color : #828282;
        }
      }

      .personList {
        padding-top: 15px;

        .person {
          display: flex;
          padding: 0 10px 0 13px;
          .personAvatar {

            padding: 5px 10px;
            img {
              width: 33px;
              height: 33px;
              border-radius: 50%;
            }
          }

          .personButtons {
            width: calc(100% - 53px);
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e0e0e0;

            .confirm-btn {
              border: 1px solid #bdbdbd;

              &.active {
                border: 0;
              }
            }

            .personName {
              color: #333333;
              font-size: 14px;
            }

            .icon-trash {
              margin-right: 20px;
            }
          }
        }
      }
    }

    .ant-modal-header {
      border-radius: 4px 4px 0 0;
      position: relative;

      .ant-modal-title {
        font-size: 18px;
        font-weight: 600;
        color: #333333;
        text-align: center;
      }

      .save-group-btn {
        position: absolute;
        top: 50%;
        right: 10px;
        padding: 5px 20px;
        border-radius: 50px;
        font-size: 14px;
        transform: translateY(-50%);
      }
    }

    .ant-modal-close {
        left: 0;
        right: none;
      .ant-modal-close-x {
        svg {
          path {
            fill: #333333;
          }
        }
      }
    }
  }

  .panel-header {
    padding: 10px 0 2px 24px;
    font-size: 14px;
    color: #828282;
  }

  .memberList {
    padding: 16px 24px 0;

    .memberItem {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      overflow: hidden;
      margin-right: 10px;
      position: relative;
      margin-right: 20px;

      .memberAvatar {
        border-radius: 50%;
        width: 33px;
        height: 33px;
        object-fit: cover;
      }

      .userActivity {
        width: 14px;
        height: 14px;
        display: block;
        background-color: #eb5757;
        position: absolute;
        top: 0;
        right: 0;
        border: 2px solid #ffffff;
        ${borderRadius('50%')};
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .memberName{
        font-size: 10px;
        color: #828282;
        text-align: center;
        margin-top: 4px;
      }
    }
  }

  .ant-collapse {
    background-color: transparent;
    .ant-collapse-item {
      border-bottom: 0 !important;

      .ant-collapse-header {
        background-color: #2f80ed;
        color: white !important;
        font-size: 14px;
        padding: 10px 20px 10px 24px;
      }

      .ant-collapse-content {
        background-color: transparent;

        .ant-collapse-content-box {
          padding: 0;
        }
      }
    }
  }
`;

export default WithDirection(GroupModalWrapper);
