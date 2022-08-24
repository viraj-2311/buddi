import React, { useRef } from 'react';
import UploadIcon from '@iso/assets/images/upload-icon.png';

const CSVUpload = ({ rowDelimiter, columnDelimiter, onChange }) => {
  const filePicker = useRef(null);

  const openFilePicker = () => {
    filePicker.current.value = null;
    filePicker.current.click();
  };

  const onFileLoad = (files) => {
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      readCSV(e.target.result);
    };

    if (file) {
      fileReader.readAsText(file);
    }
  };

  const readCSV = (data) => {
    if (!data) {
      return;
    }

    let ROW_DELIMITER = rowDelimiter
      ? rowDelimiter
      : data.indexOf('\r\n') >= 0
      ? '\r\n'
      : '\n';
    let COLUMN_DELIMITER = columnDelimiter ? columnDelimiter : ',';

    let cells = [];

    data.split(ROW_DELIMITER).forEach((row) => {
      if (!row) {
        return;
      }

      cells.push(...row.split(COLUMN_DELIMITER));
    });

    onChange && onChange(cells);
  };

  return (
    <a href='#' className='icon-box' onClick={openFilePicker}>
      <img src={UploadIcon} alt='Upload' className='iconSize' />
      <input
        accept='.csv'
        ref={filePicker}
        type='file'
        onChange={(e) => onFileLoad(e.target.files)}
        style={{ display: 'none' }}
      />
    </a>
  );
};

export default CSVUpload;
