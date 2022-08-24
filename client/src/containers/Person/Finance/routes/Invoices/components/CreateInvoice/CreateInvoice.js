import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import InvoiceForm from './InvoiceForm';
import { InvoiceFormWrapper, CreateInvoiceModal } from './CreateInvoice.style';
import validationSchema from './schema';
import { createInvoiceRequest } from '@iso/redux/contractorInvoice/actions';
import { showServerError } from '@iso/lib/helpers/utility';
import notify from '@iso/lib/helpers/notify';

const initialValues = {
  agencyDescription: '',
  clientDescription: '',
  jobName: '',
  invoiceDate: '',
  paymentDue: '',
  jobNumber: '',
  invoiceNumber: '',
  bill_from: {
    address: '',
    city: '',
    email: null,
    name: '',
    phone: '',
    state: '',
    zipCode: '',
  },
  bill_to: {
    address: '',
    city: '',
    email: null,
    name: '',
    phone: '',
    state: '',
    zipCode: '',
  },
};

const CreateInvoice = ({ visible, setModalData }) => {
  const dispatch = useDispatch();
  const { create, created_invoice } = useSelector(
    (state) => state.ContractorInvoice
  );
  const [action, setAction] = useState('');
  const formikRef = useRef();

  const initials = {
    ...initialValues,
  };

  useEffect(() => {
    if (action === 'invoice_create') {
      if (!create.loading && !create.error) {
        notify('success', 'Invoice created successfully');
        formikRef.current.resetForm();
        setModalData({ type: 'close', isRefreshList: true });
      }
      if (create.error) {
        notify('error', showServerError(create.error));
      }
      if (!create.loading) {
        setAction('');
      }
    }
  }, [create]);

  const handleCancel = () => {
    setModalData({ type: 'close' });
  };

  const handleCreateInvoice = (values) => {
    let payload = { ...values };
    setAction('invoice_create');
    dispatch(createInvoiceRequest(payload));
  };

  return (
    <CreateInvoiceModal
      visible={visible}
      title='Create Invoice'
      width={950}
      footer={null}
      wrapClassName='hCentered'
      onCancel={handleCancel}
    >
      <InvoiceFormWrapper>
        <Formik
          enableReinitialize
          initialValues={initials}
          innerRef={formikRef}
          onSubmit={handleCreateInvoice}
          validationSchema={validationSchema}
          render={(formikProps) => (
            <InvoiceForm
              {...formikProps}
              onCancel={handleCancel}
              action={action}
            />
          )}
        />
      </InvoiceFormWrapper>
    </CreateInvoiceModal>
  );
};

export default CreateInvoice;
