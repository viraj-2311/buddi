import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { Row, Col } from 'antd';
import InvoiceDocumentFormWrapper, {
  ImageCropModalBodyWrapper,
} from './Form.style';
import Dropzone from '@iso/components/uielements/dropzone';
import Button from '@iso/components/uielements/button';
import Input, { InputGroup } from '@iso/components/uielements/input';
import InputField from '@iso/components/shared/InputField';
import notification from '@iso/components/Notification';
import Spin from '@iso/components/uielements/spin';
import Icon from '@iso/components/icons/Icon';
import FolderPlusIcon from '@iso/assets/images/folder-plus.svg';
import PdfIcon from '@iso/assets/images/pdf.png';
import ImageCrop from '@iso/components/ImageCrop';
import Modal from '@iso/components/Feedback/Modal';
import { uploadFile } from '@iso/lib/helpers/s3';
import { isImage, isPdf } from '@iso/lib/helpers/file_utils';
import { maxFileUploadSize } from '@iso/config/env';
import validationSchema from './schema';
import NumberFormat from 'react-number-format';
import {
  createContractorInvoiceDocumentRequest,
  updateContractorInvoiceDocumentRequest,
} from '@iso/redux/contractorInvoice/actions';

const InvoiceDocumentForm = ({ invoice, document }) => {
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { documentCreateAction, documentUpdateAction } = useSelector(
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
    amount: 0,
    note: '',
  });

  const filePicker = useRef(null);
  const formikRef = useRef(null);

  useEffect(() => {
    if (document) {
      setDocumentForm(document);
    }
  }, [document]);

  useEffect(() => {
    if (
      !documentCreateAction.loading &&
      !documentCreateAction.error &&
      action === 'create'
    ) {
      setLoader(false);
    }
  }, [documentCreateAction]);

  useEffect(() => {
    if (
      !documentUpdateAction.loading &&
      !documentUpdateAction.error &&
      action === 'update'
    ) {
      setLoader(false);
    }
  }, [documentUpdateAction]);

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
        dispatch(updateContractorInvoiceDocumentRequest(payload.id, payload));
      } else {
        setAction('create');
        dispatch(
          createContractorInvoiceDocumentRequest(
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
    <InvoiceDocumentFormWrapper>
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
                  <label>Choose an image or pdf from your computer</label>
                  <input
                    ref={filePicker}
                    type='file'
                    onChange={(e) => onFileLoad(e.target.files)}
                  />
                  <div className='helperTextWrapper'>
                    <span className='helperText'>Maximum file size 20MB</span>
                  </div>
                  <div className='actions'>
                    <Button
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
                <Row gutter={20}>
                  <Col span='6' className='document-title'>
                    <div className='formGroup'>
                      <label className='fieldLabel'>Document Title</label>
                      <Field name='title' component={InputField} />
                    </div>
                  </Col>
                  <Col span='6' className='amount'>
                    <div className='formGroup'>
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
                    </div>
                  </Col>
                  <Col span='6' className='notes'>
                    <div className='formGroup'>
                      <label className='fieldLabel'>Notes</label>
                      <Field name='note' component={InputField} />
                    </div>
                  </Col>
                  <Col span='6' className='submitBtnWrapper'>
                    <label className='fieldLabel'>&nbsp;</label>
                    <Button
                      block
                      shape='round'
                      type='primary'
                      htmlType='submit'
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Spin>
          )}
        </Formik>
      </div>
    </InvoiceDocumentFormWrapper>
  );
};

export default InvoiceDocumentForm;
