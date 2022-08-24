import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { Row, Col } from 'antd';
import InvoiceReceiptFormWrapper, {
  ImageCropModalBodyWrapper,
} from './Form.style';
import Dropzone from '@iso/components/uielements/dropzone';
import Button from '@iso/components/uielements/button';
import DatePicker from '@iso/components/uielements/datePicker';
import Input, { InputGroup } from '@iso/components/uielements/input';
import InputField from '@iso/components/shared/InputField';
import notification from '@iso/components/Notification';
import Spin from '@iso/components/uielements/spin';
import PdfIcon from '@iso/assets/images/pdf.png';
import Icon from '@iso/components/icons/Icon';
import FolderPlusIcon from '@iso/assets/images/folder-plus.svg';
import ImageCrop from '@iso/components/ImageCrop';
import Modal from '@iso/components/Modal';
import CalendarIcon from '@iso/components/icons/Calendar';
import { uploadFile } from '@iso/lib/helpers/s3';
import { isImage, isPdf } from '@iso/lib/helpers/file_utils';
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';
import { maxFileUploadSize } from '@iso/config/env';
import { displayDateFormat } from '@iso/config/datetime.config';
import validationSchema from './schema';
import NumberFormat from 'react-number-format';
import { formatDateString, stringToDate } from '@iso/lib/helpers/utility';
import {
  createContractorInvoiceReceiptRequest,
  updateContractorInvoiceReceiptRequest,
  fetchContractorInvoiceDetailRequest,
} from '@iso/redux/contractorInvoice/actions';

const InvoiceReceiptForm = ({ invoice, receipt }) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { receiptCreateAction, receiptUpdateAction } = useSelector(
    (state) => state.ContractorInvoice
  );
  const [documentFile, setDocumentFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [loader, setLoader] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [visibleCropper, setVisibleCropper] = useState(false);
  const [fileName, setFileName] = useState('');
  const [documentError, setDocumentError] = useState('');
  const [action, setAction] = useState('');
  const [documentForm, setDocumentForm] = useState({
    title: '',
    paymentDue: '',
    amount: 0,
    notes: '',
  });

  useEffect(() => {
    if (receipt) {
      setDocumentForm(receipt);
    }
  }, [receipt]);

  useEffect(() => {
    if (action === 'create') {
      setLoader(receiptCreateAction.loading);
      if (!receiptCreateAction.loading) {
        if (receiptCreateAction.success) {
          notify('success', showServerError(receiptCreateAction.success));
          dispatch(
            fetchContractorInvoiceDetailRequest(authUser.id, invoice.id)
          );
        }
        if (receiptCreateAction.error) {
          notify('error', showServerError(receiptCreateAction.error));
        }
        setAction('');
      }
    }
  }, [receiptCreateAction]);

  useEffect(() => {
    if (action === 'update') {
      setLoader(receiptUpdateAction.loading);
      if (!receiptUpdateAction.loading) {
        if (receiptUpdateAction.success) {
          notify('success', showServerError(receiptUpdateAction.success));
          dispatch(
            fetchContractorInvoiceDetailRequest(authUser.id, invoice.id)
          );
        }
        if (receiptUpdateAction.error) {
          notify('error', showServerError(receiptUpdateAction.error));
        }
        setAction('');
      }
    }
  }, [receiptUpdateAction]);

  const filePicker = useRef(null);
  const formikRef = useRef(null);

  const openFilePicker = () => {
    filePicker.current.value = null;
    filePicker.current.click();
  };

  const onFileLoad = (files) => {
    if (files.length === 0) return;

    const file = files[0];
    if (file.size > maxFileUploadSize) {
      notification('error', 'File size is over 20MB');
      return;
    }

    setFileName(file.name);

    if (isImage(file.name)) {
      // Crop if chosen file is image
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onloadend = () => {
        setCropImageSrc(fileReader.result);
        setVisibleCropper(true);
      };
    } else {
      // Save if chosen file is document
      setDocumentFile(file);
      setImageSrc(PdfIcon);
    }
  };

  const onImageDelete = () => {
    setImageSrc(null);
    setDocumentFile(null);
  };

  const handleSubmit = async (values) => {
    let payload = { ...values };

    try {
      setLoader(true);
      if (documentFile instanceof File) {
        const documentS3DirName =
          process.env.REACT_APP_S3_BUCKET_JOB_DOCUMENT_DIRNAME;
        const s3File = await uploadFile(documentFile, documentS3DirName);

        if (!s3File.error) {
          payload = {
            ...payload,
            document: s3File.location,
          };
        }
      }

      if (payload.id) {
        setAction('update');
        dispatch(updateContractorInvoiceReceiptRequest(payload.id, payload));
      } else {
        setAction('create');
        dispatch(
          createContractorInvoiceReceiptRequest(
            authUser.id,
            invoice.id,
            payload
          )
        );
      }
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };

  const handleCropImage = (cropImage) => {
    const file = new File([cropImage.blob], fileName);
    setDocumentFile(file);
    setImageSrc(cropImage.url);
    setVisibleCropper(false);
  };

  const cancelCropImage = () => {
    setVisibleCropper(false);
  };

  return (
    <InvoiceReceiptFormWrapper>
      <div className='dropzoneWrapper'>
        <Modal
          visible={visibleCropper}
          closable={false}
          width={620}
          footer={null}
        >
          <ImageCropModalBodyWrapper>
            <ImageCrop
              className='imageCropper'
              ruleOfThirds
              src={cropImageSrc}
              onSave={handleCropImage}
              onCancel={cancelCropImage}
            />
          </ImageCropModalBodyWrapper>
        </Modal>
        {imageSrc ? (
          <img
            onClick={() => (imageSrc ? setVisibleCropper(true) : null)}
            src={imageSrc}
            className='imagePreview'
          />
        ) : (
          <>
            <Dropzone multiple={false} onDrop={(files) => onFileLoad(files)}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <p style={{ marginBottom: 20 }}>
                    <Icon image={FolderPlusIcon} width={55} height={44} />
                  </p>
                  <p>Drag and Drop you files here</p>
                </div>
              )}
            </Dropzone>
            {documentError && <div className='errorText'>{documentError}</div>}
          </>
        )}
      </div>
      <div className='formWrapper'>
        <Formik
          enableReinitialize
          innerRef={formikRef}
          initialValues={documentForm}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ values, touched, errors, setFieldValue, isSubmitting }) => (
            <Spin spinning={loader}>
              <Form>
                <div className='formGroup'>
                  <label className='chooseImageText'>
                    Choose an image or pdf from your computer 1
                  </label>
                  <input
                    ref={filePicker}
                    type='file'
                    onChange={(e) => onFileLoad(e.target.files)}
                  />
                  <div className='helperTextWrapper'>
                    <span className='helperText'>
                      Maximum file size 20MB, PDF or JPEG
                    </span>
                  </div>
                  <div className='actions'>
                    <Button
                      hideBackGroundImage
                      shape='round'
                      type='primary'
                      onClick={openFilePicker}
                    >
                      Browse
                    </Button>
                    <Button shape='round' onClick={onImageDelete}>
                      Delete
                    </Button>
                  </div>
                </div>
                <Row gutter={20} className='receive-content'>
                  <Col span={6} className='formGroup'>
                    <label className='fieldLabel'>Receipt Title</label>
                    <Field name='title' component={InputField} />
                  </Col>
                  <Col span={4} className='formGroup'>
                    <label className='fieldLabel'>Date</label>
                    <DatePicker
                      style={{ width: '100%' }}
                      value={stringToDate(values.paymentDue)}
                      format={displayDateFormat}
                      suffixIcon={
                        <CalendarIcon width={20} height={18} fill='#bcbccb' />
                      }
                      onChange={(date) =>
                        setFieldValue('paymentDue', formatDateString(date))
                      }
                    />
                  </Col>
                  <Col span={3} className='formGroup'>
                    <label className='fieldLabel'>$ Amount</label>
                    <NumberFormat
                      style={{ width: '100%' }}
                      value={values.amount || ''}
                      thousandSeparator={true}
                      prefix='$'
                      customInput={Input}
                      onValueChange={(values) =>
                        setFieldValue('amount', values.floatValue)
                      }
                    />
                  </Col>
                  <Col span={6} className='formGroup'>
                    <label className='fieldLabel'>Notes</label>
                    <Field name='notes' component={InputField} />
                  </Col>
                  <Col span={5} className='submitBtnWrapper'>
                    <label className='fieldLabel'>&nbsp;</label>
                    <Button
                      block
                      shape='round'
                      type='primary'
                      hideBackGroundImage
                      htmlType='submit'
                    >
                      {values.id ? 'Save' : 'Add'}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Spin>
          )}
        </Formik>
      </div>
    </InvoiceReceiptFormWrapper>
  );
};

export default InvoiceReceiptForm;
