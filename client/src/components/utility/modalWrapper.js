import styled from 'styled-components';

const ModalWrapper = styled.div`

`;

const ModalMaskWrapper = styled.div`
  position: relative;
  height: 100%;
  
  .ant-modal-wrap {
    position: absolute;    
  }
  
`;

export default ModalWrapper;
export { ModalMaskWrapper };
