import styled from 'styled-components';

const ProducerJobAttachmentsWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .attachmentBox {
    display: flex;
    flex: 1;
    align-items: center;
    background-color: #fff;
    border-radius: 10px;
    padding: 20px 30px 19px 20px;
    margin-bottom: 20px;

    position: relative;
    @media only screen and (max-width: 520px) {
      padding: 10px;
      margin: 0 0 20px 0;
    }

    .attachmentDetails {
      color: #a2a2a9;
      flex: auto;
      display: flex;
      align-items: center;
      
      .attachmentTitleAndSize {
        margin-left: 45px;
        display: flex;
        flex-direction: column;
        
        .attachmentTitle {
            display: block;
            font-weight: bold;
            color: #2f2e50;
            font-size: 13px;
            max-width: 150px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            @media only screen and (max-width: 425px) {
              max-width: 100px;
            }
            @media only screen and (min-width: 768px) {
              max-width: 300px;
            }
        }
        
        .attachmentSize {
            font-size: 11px;
            color: #2f2e50;
        }
      }
    }
    
    .attachmentActions {
        display: flex;
        align-items: center;
        
        .removeBtn {
            margin-right: 30px;
        }
    }
  }
`;

const ContractorJobAttachmentsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .attachmentBox {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 5px;
    padding: 15px 16px 14px 13px;
    border: 1px solid #e8e8f1;
    margin-right: 20px;
    width: 278px;
    margin-bottom: 10px;

    position: relative;
    @media only screen and (max-width: 520px) {
      padding: 10px;
    }

    .attachmentDetails {
      color: #a2a2a9;
      flex: auto;
      display: flex;
      align-items: center;
      
      .attachmentTitleAndSize {
        margin-left: 15px;
        display: flex;
        flex-direction: row;
        font-size: 15px;
        max-width: 150px;
        white-space: nowrap;
        @media only screen and (max-width: 425px) {
          max-width: 100px;
        }
        @media only screen and (min-width: 768px) {
          max-width: 190px;
        }

        a{
          color:#f48d3a;
        }
        
        .attachmentTitle {
            font-weight: 600;
            margin-right: 5px;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        
        .attachmentSize {
            color: #80808a;
        }
      }
    }
    
    .attachmentActions {
        display: flex;
        align-items: center;
    }
  }
`;

export { ProducerJobAttachmentsWrapper, ContractorJobAttachmentsWrapper };
