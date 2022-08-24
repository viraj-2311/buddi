import styled from 'styled-components';

const ReceiptViewerWrapper = styled.div`
  width: 100%;  
`;

const ImageViewWrapper = styled.div`
  width: 100%;
  text-align: center;
  overflow: auto;
  
  img {
    width: 100%;
    height: auto;
  }
`;

const PdfViewWrapper = styled.div`
  width: 100%;
  overflow: auto;
  
  .react-pdf__Document {
    padding: 10px;
  }
    
  .react-pdf__Page {
    margin-top: 10px;
  }
  
  .react-pdf__Page__annotations.annotationLayer {
    padding: 20px;
  }
  
  .react-pdf__Page__svg {
    margin: 0 auto;
    border: 1px solid #d3d3d3;
    box-shadow: 5px 5px 5px 1px #d3d3d3;
    border-radius: 5px;
  }
`;

export { ImageViewWrapper, PdfViewWrapper }

export default ReceiptViewerWrapper;

