import styled from 'styled-components';

const ArchiveJobsWrapper = styled.div`
  padding: 35px 40px;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
  .goBackBtn {
    margin-right: 26px;
  }

  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TotalInvoicePrice = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const ClientNameDiv = styled.div`
  font-size: 15px;
  font-weight: bold;
`;

const ComponentTitle = styled.h3`
  font-size: 30px;
  font-weight: bold;
  color: #2f2e50;
  display: inline-block;
`;

const ButtonHolders = styled.div`
  display: flex;
  justify-content: flex-end;

  &.archive-header-btns{
    @media (max-width:767px){
      display: flex;
      flex-direction: row;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      margin-top:15px;
    }
    @media (max-width:575px){
      flex-direction:column;
      button{
        width:100%;
        min-width:100% !important;
        margin-bottom:10px;
      }
    }
    .deleteBtn {
      @media (max-width:767px){
        margin-top:0px;
      }
    }

  }

  button.ant-btn.ant-btn-round {
    border: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 185px;
    margin-left: 20px;

    @media (max-width: 767px) {
      min-width: 155px;
      margin-left: 0;
      // :not(:first-child) {
      //   margin-top: 15px;
      // }
    }

    svg {
      margin-right: 10px;
    }

    &.reinstateBtn {
      &:hover {
        background-image: linear-gradient(to right, #6e52fc -10%, #52a0f8 90%);
      }
    }
    &.downloadBtn {
      background-color: #38923F;
      color: #fff;
      border: 0;
      margin-left: 20px;            
      &:hover {        
        background: #67c46e;
      }
    }
    &.deleteBtn {
      border-color: #2f2e50;
      background: #e25656;
      color: #ffffff;
      svg {
        color: #000;
      }
      &:hover {
        border-color: #2f2e50;
        background: #ee9391;
      }
    }
  }

  // @media (max-width: 767px) {
  //   margin-top: 15px;
  // }
`;

const ActionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionDiv = styled.div`
  svg {
    height: 25px;
    width: 25px;
    color: #2f2e50;
  }
`;

const ArchiveJobTableWrapper = styled.div`
  .ant-table-tbody {
    > tr {
      th,
      td {
        padding: 20px 20px;
      }
    }
  }

  .ant-table-tbody > tr > td {
    font-size: 13px;
  }
  .ant-table-container table {
    thead {
      tr{
        &:first-child {
          th{
             &:first-child{
              padding-left:17px !important;
             }
              &:last-child{
                min-width:100px;
                width:100px;
              }
          }
        }
      }
    } 
    tr{
      td{
        &:last-child{
         text-align:center;
         padding:0;
        }
      }
    }
  }

.ant-table table{
  white-space:nowrap
}
.location-name{
  display:flex;
  align-items: center;
  p{
    margin-left:10px;
  }
}

  // .ant-table-selection{
  //   top:20px;
  // }
`;

export {
  ActionWrapper,
  TitleWrapper,
  ButtonHolders,
  TotalInvoicePrice,
  ClientNameDiv,
  ArchiveJobTableWrapper,
  ComponentTitle,
  ActionDiv,
};

export default ArchiveJobsWrapper;
