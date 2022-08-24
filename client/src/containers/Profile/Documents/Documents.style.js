import styled from 'styled-components';
import { palette } from 'styled-theme';

const DocumentWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  height: 100%;

  .ant-card {
    height: 100%;
    border-radius: 10px;
  }

  .ant-card-body {
    padding: 30px;
  }

  color: #2f2e50;

  h2.sectionHead {
    font-size: 25px;
    font-weight: bold;
  }

  h3 {
    font-weight: bold;
  }

  h3,
  p {
    font-size: 15px;
  }

  p.note {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .dropzone {
    background: #f0f0f7;
    margin-bottom: 20px;
    padding: 30px;
    display: flex;
    align-items: center;
    flex-direction: column;
    border: dashed 1px ${palette('themecolor', 0)};
    border-radius: 5px;
    .browseBtn {
      background-image: none;
      width: 150px;
    }

    p {
      margin-bottom: 16px;
    }

    span.drag_and_drop {
      margin-bottom: 8px;
      text-align: center;
    }
  }
  .attachmentBox {
    display: flex;
    align-items: center;
    border: solid 1px #e8e8f1;
    background-color: #ffffff;
    border-radius: 4px;
    padding: 15px 20px;
    margin: 15px 0;
    position: relative;

    .attachmentDetails {
      color: #a2a2a9;
      flex: auto;
      display: flex;
      align-items: center;

      .rightDetail {
        display: flex;
        flex-direction: column;
        line-height: normal;
        span {
          font-size: 11px;
        }
      }

      img {
        margin-right: 25px;
      }

      .attachmentTitle {
        font-weight: bold;
        color: #2f2e50;
        font-size: 13px;
      }
    }

    .closeCircle {
      color: #9697a7;
    }
  }
`;
export { DocumentWrapper };
