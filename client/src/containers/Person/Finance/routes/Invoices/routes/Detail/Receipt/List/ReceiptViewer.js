import React, {useEffect, useState} from 'react';
import ReceiptViewerWrapper, {ImageViewWrapper, PdfViewWrapper} from './ReceiptViewer.style';
import Scrollbar from '@iso/components/utility/customScrollBar';
import { isImage, isPdf } from '@iso/lib/helpers/file_utils';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ImageView = ({image, zoom}) => {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    const newWidth = 100 * zoom;
    setWidth(newWidth);
  }, [zoom]);

  return (
    <ImageViewWrapper>
      <img src={image} style={{width: `${width}%`}}/>
    </ImageViewWrapper>
  )
};


const PdfView = ({pdf, zoom}) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <PdfViewWrapper>
      <Document
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        <Scrollbar
          className="pdfViewScrollbar"
          style={{ height: 'calc(100vh - 70px)' }}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={zoom} renderMode="svg" />
          ))}
        </Scrollbar>
      </Document>
    </PdfViewWrapper>
  )
};

const ReceiptViewer = ({document}) => {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [document]);

  return (
    <ReceiptViewerWrapper>
      {isPdf(document) && <PdfView pdf={document} zoom={zoom} />}
      {isImage(document) && <ImageView image={document} zoom={zoom} />}
    </ReceiptViewerWrapper>
  )
};

ReceiptViewer.defaultProps = {
  document: {}
}

export default ReceiptViewer;