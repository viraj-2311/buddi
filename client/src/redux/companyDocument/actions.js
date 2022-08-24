import * as CONSTANTS from './constants';

export const fetchCompanyJobsRequest = (companyId) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_REQUEST,
  companyId,
});

export const fetchCompanyJobsSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_SUCCESS,
  data,
});

export const fetchCompanyJobsFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_FAIL,
  error,
});

export const fetchCompanyJobsInvoiceDocumentRequest = (companyId, jobId) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_INVOICE_DOCUMENT_REQUEST,
  companyId,
  jobId,
});

export const fetchCompanyJobsInvoiceDocumentSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_INVOICE_DOCUMENT_SUCCESS,
  data,
});

export const fetchCompanyJobsInvoiceDocumentFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_INVOICE_DOCUMENT_FAIL,
  error,
});

export const fetchCompanyJobsW9DocumentRequest = (companyId, jobId) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_W9_DOCUMENT_REQUEST,
  companyId,
  jobId,
});

export const fetchCompanyJobsW9DocumentSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_W9_DOCUMENT_SUCCESS,
  data,
});

export const fetchCompanyJobsW9DocumentFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_JOB_W9_DOCUMENT_FAIL,
  error,
});

export const fetchDownloadAllW9AsZipRequest = (jobId, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_W9_AS_ZIP_REQUEST,
  jobId,
  title,
});

export const fetchDownloadAllW9AsZipSuccess = (data, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_W9_AS_ZIP_SUCCESS,
  data,
  title,
});

export const fetchDownloadAllW9AsZipFail = (error) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_W9_AS_ZIP_FAIL,
  error,
});

export const fetchDownloadAllAsZipRequest = (jobId, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_AS_ZIP_REQUEST,
  jobId,
  title,
});

export const fetchDownloadAllAsZipSuccess = (data, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_AS_ZIP_SUCCESS,
  data,
  title,
});

export const fetchDownloadAllAsZipFail = (error) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_AS_ZIP_FAIL,
  error,
});

export const fetchDownloadAllInvoiceAsZipRequest = (jobId, title, payload) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_INVOICE_AS_ZIP_REQUEST,
  jobId,
  title,
  payload
});

export const fetchDownloadAllInvoiceAsZipSuccess = (data, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_INVOICE_AS_ZIP_SUCCESS,
  data,
  title,
});

export const fetchDownloadAllInvoiceAsZipFail = (error) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ALL_INVOICE_AS_ZIP_FAIL,
  error,
});

export const fetchDownloadInvoiceRequest = (invoiceId, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_INVOICE_REQUEST,
  invoiceId,
  title,
});

export const fetchDownloadInvoiceSuccess = (data, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_INVOICE_SUCCESS,
  data,
  title,
});

export const fetchDownloadInvoiceFail = (error) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_INVOICE_FAIL,
  error,
});

export const fetchDownloadReportsRequest = (jobId, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_REPORTS_REQUEST,
  jobId,
  title,
});

export const fetchDownloadReportsSuccess = (data, title) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_REPORTS_SUCCESS,
  data,
  title,
});

export const fetchDownloadReportsFail = (error) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_REPORTS_FAIL,
  error,
});

export const fetchDownloadArchiveJobRequest = (jobs) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ARCHIVE_REQUEST,
  jobs,
});

export const fetchDownloadArchiveJobSuccess = (data,fileName) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ARCHIVE_REQUEST_SUCCESS, 
  data,
  fileName
});

export const fetchDownloadArchiveJobFail = (error) => ({
  type: CONSTANTS.FETCH_DOWNLOAD_ARCHIVE_REQUEST_FAIL,
  error,
});
