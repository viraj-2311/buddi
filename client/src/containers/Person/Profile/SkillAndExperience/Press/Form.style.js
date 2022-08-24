import styled from 'styled-components';

const PressFormWrapper = styled.div`
  width: 100%;
  
  .pressFieldWrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    
    .pressLink {
      flex: auto;
    }
    
    button {
      margin-left: 10px;
    }
  }
`;

export default PressFormWrapper;
