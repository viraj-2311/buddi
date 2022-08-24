import styled from 'styled-components';
import { palette } from 'styled-theme';

const LoadTemplateConfirmWrapper = styled.div`
  .confirmDepartments {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    
    .departmentItem {
      margin: 0 20px 15px 0;
    }
  }
  .actionBtnWrapper {
    margin-top: 30px;
    text-align: right;
    
    button {
      margin-left: 20px;
      width: 160px;
    }
  }
`;

export default LoadTemplateConfirmWrapper;