import styled from 'styled-components';
import Modal from '@iso/components/Modal';
import { Row } from 'antd';

const UserContactInfoModal = styled(Modal)`
  &.ant-modal {
    width: 450px !important;
  }
  .ant-modal-body {
    padding: 25px 35px;
    .content {
      h3,
      h4,
      p {
        color: #2f2e50;
      }
      .title {
        h3 {
          font-size: 20px;
          font-weight: normal;
          color: #2f2e50;
        }
      }

      .sourceList {
        .sourceItem {
          display: flex;
          justify-content: flex-start;
          margin-top: 20px;

          h4 {
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 6px;
          }

          p {
            font-size: 13px;
          }

          svg {
            float: left;
            margin-top: 3px;
          }

          .sourceItemInfo {
            overflow: hidden;
            margin-left: 19px;
          }
          .websiteInfo {
            span {
              display: flex;
              font-size: 13px;
              margin-bottom: 5px;

              &:last-child {
                margin-bottom: 0px;
              }

              p {
                color: #80808a;
                padding-left: 1px;
              }
            }
          }

          .phoneDetail {
            span {
              display: flex;
              align-items: center;

              h6,
              p {
                font-size: 13px;
              }
              h6 {
                color: #2f2e50;
              }
              p {
                color: #80808a;
              }
            }
          }
        }
      }
    }
  }
`;

export const SectionRow = styled(Row)`
  flex-flow: row nowrap;
`;

export default UserContactInfoModal;
