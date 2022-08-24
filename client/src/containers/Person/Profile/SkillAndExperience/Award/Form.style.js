import styled from 'styled-components';

const AwardFormWrapper = styled.div`
  width: 100%;
  
  .awardFieldWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    
    .awardTitle {
      flex: auto;
    }
    
    .awardYear {
      width: 90px;
      margin-left: 10px;
    }
    
    button {
      margin-left: 10px;
    }
  }
`;

export default AwardFormWrapper;
