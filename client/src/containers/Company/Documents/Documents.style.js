import styled from 'styled-components';

const ActionDiv = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin-right: 30px;

    &:last-child {
      margin-right: 0;
    }
    &.ant-btn-link {
      color: #f48d3a;
      font-size:20px;
      &:hover,
      &:focus {
        color:#f48d3a;
      }
    }
  }
`;

const IconWithText = styled.a`
  display: flex;
  color: #4d4f5c;
  font-size: 15px;
  align-items: center;
  font-weight: bold;
  &:hover,
  &:focus {
    color: #4d4f5c;
  }

  > div {
    height: 40px;
    width: 40px;
    background: #fff1e7;
    margin-right: 20px;
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg{
      fill: #f48d3a;
    }

    &.no-background {
      background: none;
    }
  }
  a {
    color: #4d4f5c;
  }
`;

const TableHeaderActionDiv = styled.div`
  display: flex;
  position: absolute;
  top: 30px;
  left: 14px;

  @media (max-width: 767px) {
    flex-direction: column;
  }

  button.ant-btn.ant-btn-round {
    background-image: none;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 165px;

    @media (max-width: 767px) {
      min-width: 145px;
    }

    svg {
      margin-right: 10px;
      width: 20px;
      height: 20px;
      color: #fff;
    }

    &.downloadBtn {
      background-color: rgba(81, 54, 154, 1);
     
      color: #ffffff;
      margin-right: 20px;
      &:hover {
        background-color: rgba(81, 54, 154, 0.8);
        
      }
      @media (max-width: 767px) {
        margin-right: 0;
      }
    }
    &.deleteBtn {
      border-color: #2f2e50;
      color: #2f2e50;
      background: none;
      svg {
        color: #000;
      }
      &:hover {
        border-color: #2f2e50;
        background: none;
        color: #2f2e50;
      }

      @media (max-width: 767px) {
        margin-top: 20px;
      }
    }
  }
`;

const DocumentsWrapper = styled.div``;

const DocumentHead = styled.div`
  display: flex;
  padding: 25px;
  align-items: center;

  @media (max-width: 991px) {
    flex-direction: column;
    align-items: flex-start;
    padding-bottom: 0;
  }

  .document-head-left {
    display: flex;
    a {
      margin: 5px 15px 0 0;
    }

    .backBtn {
      svg {
        display: block;
      }
    }
  }
  .search {
    margin-left: auto;
    @media (max-width: 991px) {
      margin-left: 30px;
      margin-bottom: 25px;
    }
    svg {
      width: 100%;
      height: 100%;
    }

    input {
      height: 50px;
      width: 250px;
    }
  }
`;

const DocumentBody = styled.div`
  padding-left: 30px;
`;

const BreadCrumb = styled.div`
  display: flex;
  align-items: center;

  .breadcrumb_item {
    a,
    span {
      font-size: 20px;
      color: #2f2e50;
      @media (max-width: 991px) {
        font-size: 18px;
        margin-bottom: 10px;
      }
    }
    span {
      font-weight: bold;
      margin-right: 15px;
    }
    @media (max-width: 991px) {
      margin-bottom: 10px;
    }
  }

  @media (max-width: 991px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
export {
  ActionDiv,
  IconWithText,
  TableHeaderActionDiv,
  DocumentsWrapper,
  DocumentHead,
  BreadCrumb,
  DocumentBody,
};
