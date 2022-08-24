import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import DocumentTypeList from './DocumentTypeList';
import BackIcon from '@iso/components/icons/Back';
import JobList from './JobList';
import DocumentList from './DocumentList';
import {
  DocumentsWrapper,
  DocumentHead,
  DocumentBody,
  BreadCrumb,
} from './Documents.style';
import { SearchOutlined } from '@ant-design/icons';
import { JobDocumentTypes } from '@iso/lib/helpers/appConstant';
import Input from '@iso/components/uielements/input';
import {
  fetchCompanyJobsRequest,
  fetchCompanyJobsW9DocumentRequest,
  fetchCompanyJobsInvoiceDocumentRequest,
} from '@iso/redux/companyDocument/actions';

const ViewTypeEnum = {
  JOBS: 'JOBS',
  DOCUMENT_TYPE: 'DOCUMENT_TYPE',
  DOCUMENT: 'DOCUMENT',
};

const Documents = () => {
  const dispatch = useDispatch();
  const { companyId } = useSelector((state) => state.AccountBoard);

  const [selectedView, setSelectedView] = useState(ViewTypeEnum.JOBS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const {
    w9: { list: w9documentList, loading: w9documentLoading },
    invoices: { list: invoicesDocumentList, loading: invoicesDocumentLoading },
  } = useSelector((state) => state.CompanyDocument);

  const jobTitleBc = () => {
    return { id: 1, type: ViewTypeEnum.JOBS, title: 'Gig Documents' };
  };

  const jobNameBC = (jobRecord) => {
    return {
      id: 2,
      type: ViewTypeEnum.DOCUMENT_TYPE,
      title: jobRecord.client,
    };
  };

  const documentTypeBc = (title) => {
    return { id: 3, type: ViewTypeEnum.DOCUMENT, title };
  };

  const [breadCrumbArray, setBreadCrumbArray] = useState([jobTitleBc()]);

  useEffect(() => {
    if (selectedJob) {
      if (selectedType === JobDocumentTypes.W9) {
        dispatch(fetchCompanyJobsW9DocumentRequest(companyId, selectedJob.id));
      } else if (selectedType === JobDocumentTypes.INVOICES) {
        dispatch(
          fetchCompanyJobsInvoiceDocumentRequest(companyId, selectedJob.id)
        );
      }
    }
  }, [selectedType, selectedJob]);

  useEffect(() => {
    dispatch(fetchCompanyJobsRequest(companyId));
  }, [companyId]);

  const documents = useMemo(() => {
    let documentArray = [];
    if (selectedType === JobDocumentTypes.W9) {
      w9documentList.forEach((w9) => {
        if (documentArray.findIndex((d) => d.id === w9.id) === -1)
          documentArray.push(w9);
      });
    } else if (selectedType === JobDocumentTypes.INVOICES) {
      documentArray = invoicesDocumentList;
    }
    return documentArray;
  }, [selectedType, invoicesDocumentList, w9documentList]);

  const handleJobSelect = (jobRecord) => {
    setSelectedJob(jobRecord);
    setSelectedView(ViewTypeEnum.DOCUMENT_TYPE);
    setBreadCrumbArray([jobTitleBc(), jobNameBC(jobRecord)]);
  };

  const handleDocumentTypeSelect = (title) => {
    setSelectedView(ViewTypeEnum.DOCUMENT);
    setSelectedType(title);
    setBreadCrumbArray([
      jobTitleBc(),
      jobNameBC(selectedJob),
      documentTypeBc(title),
    ]);
  };

  const handleBreadCrumbClick = (type) => {
    setSelectedView(type);
    const bcArray = [jobTitleBc()];
    if (type === ViewTypeEnum.DOCUMENT_TYPE) {
      bcArray.push(jobNameBC(selectedJob));
    } else if (type === ViewTypeEnum.JOBS) {
      setSelectedJob(null);
    }
    setBreadCrumbArray(bcArray);
  };

  const goBack = () => {
    const backBC = breadCrumbArray[breadCrumbArray.length - 2];
    if (backBC) {
      handleBreadCrumbClick(backBC.type);
    }
  };

  return (
    <DocumentsWrapper>
      <DocumentHead>
        <div className='document-head-left'>
          <a onClick={goBack} className='backBtn'>
            <BackIcon />
          </a>
          <BreadCrumb>
            {breadCrumbArray.map((bc, i) => {
              const { title, id, type } = bc;
              let bcItem = <span>{title}</span>;
              if (i !== breadCrumbArray.length - 1) {
                bcItem = (
                  <>
                    <a
                      onClick={() => {
                        handleBreadCrumbClick(type);
                      }}
                    >
                      {title}
                    </a>
                    <span>/</span>
                  </>
                );
              }
              return (
                <div className='breadcrumb_item' key={id}>
                  {bcItem}
                </div>
              );
            })}
          </BreadCrumb>
        </div>
        <div className='search'>
          <Input placeholder='Search' prefix={<SearchOutlined />} />
        </div>
      </DocumentHead>
      <DocumentBody>
        {selectedView === ViewTypeEnum.JOBS && (
          <JobList onJobSelect={handleJobSelect} />
        )}
        {selectedView === ViewTypeEnum.DOCUMENT_TYPE && selectedJob && (
          <DocumentTypeList
            onDocumentTypeSelect={handleDocumentTypeSelect}
            selectedJob={selectedJob}
          />
        )}
        {selectedView === ViewTypeEnum.DOCUMENT &&
          selectedJob &&
          selectedType && (
            <DocumentList
              documents={documents}
              documentType={selectedType}
              documentLoading={invoicesDocumentLoading || w9documentLoading}
            />
          )}
      </DocumentBody>
    </DocumentsWrapper>
  );
};

export default Documents;
