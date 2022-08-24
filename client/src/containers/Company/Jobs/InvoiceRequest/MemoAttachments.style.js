import styled from 'styled-components';
import { palette } from 'styled-theme';

export const MemoAttachmentsWrapper = styled.div`
  margin-top:30px;
  padding-top: 20px;
  border-top: 2px solid #b4b4c6;
  display: flex;
  flex-wrap: wrap;

  .attachment {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 17px;
    border: 1px solid #e8e8f1;
    background: #fafafa;
    margin: 0 20px 20px 0;
    
    &:last-child {
      margin-right: 0;
    }
    
    .nameAndSize {
      flex: auto;
      overflow: hidden;
      display: flex;
      align-items: center;
      
      .name {
        font-weight: 600;
        color: #3b86ff;
        max-width: 150px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    
    button {
      flex: 0 0 20px;
      margin-left: 10px;
    }
  }
`;

export default MemoAttachmentsWrapper;