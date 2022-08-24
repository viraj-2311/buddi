import { object, string } from 'yup';
import { InvoiceStatusSummaryStatus } from '@iso/enums/invoice_producer_status';

const changeInvoiceStatusValidationSchema = object().shape({
  invoiceStatus: string().required('Invoice status is Required'),
  reason: string().when('invoiceStatus', {
    is: InvoiceStatusSummaryStatus.IN_DISPUTE,
    then: string().required('Reason is required'),
  }),
});

export { changeInvoiceStatusValidationSchema };
