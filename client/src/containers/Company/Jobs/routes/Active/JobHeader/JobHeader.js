import React, {  useEffect, useState, useContext, useMemo } from 'react';
import { useHistory } from 'react-router';
import JobHeaderWrapper from './JobHeader.style';
import InvoiceRequest from '../../../InvoiceRequest';
import basicStyle from '@iso/assets/styles/constants';
import { Row, Col, Menu, Dropdown } from 'antd';
import Button from '@iso/components/uielements/button';
import Icon from '@iso/components/icons/Icon';
import MoreIcon from '@iso/assets/images/more.svg';
import BackIcon from '@iso/components/icons/Back';
import JobBoardContext from '../../../JobBoard/JobBoardContext';
import ChooseWaysToWrapNPayModal from '../../Wrapped/Components/ChooseWaysToWrapNPayModal';
import {
  updateJobDetailsRequest
} from "@iso/redux/producerJob/actions";
import { sendJobInvoiceRequest, updateWrapPaySelectOptionRequest, fetchJobDealMemosRequest } from '@iso/redux/jobInvoice/actions';
import { useDispatch, useSelector } from 'react-redux';
import { GlobalModalContext } from '../../../../../../components/GlobalModal/GlobalModalContext';
import cannotWrapPayModalProps from '../../../CannotWrapPayModal/cannotWrapPayModalProps';
import Loader from "@iso/components/utility/loader";
import _ from 'lodash';
import moment from 'moment';
const { rowStyle, colStyle, gutter } = basicStyle;

const JobHeader = ({ job }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [wrapModal, setWrapModal] = useState(false);
  const [chooseOptionToWrapNPay, setOptionToWrapNPay] = useState(false);
  const { jobFullView } = useSelector(state => state.ProducerJob)
  const { onArchive, onDelete, onEdit } = useContext(JobBoardContext);
  const { initGlobalModal } = useContext(GlobalModalContext);
  const { jobDepartments, fetchDealMemos, sendInvoice } = useSelector((state) => state.JobInvoice);
  const [action, setAction] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const goBack = () => {
    history.push('../../jobs');
  };

  const onJobWrapPay = () => {
    if (jobFullView?.length == 0) {      
      initGlobalModal({
        ...cannotWrapPayModalProps,
        visible:true,
        onSecondary: () => {
          onArchive();
        }
      });
    }
    else setOptionToWrapNPay(true);
  };

  const handleInvoiceModal = (type, data) => {
    if (type === 'close') {
      setWrapModal(false);
      setOptionToWrapNPay(true);
    }

    if (type === 'success') {
      history.push('../../jobs');
    }
  };

  const allPositions = useMemo(() => {
    let all = [];
    jobDepartments.map((department) => {
      const ids = department.jobRoles.map((jr) => jr.id);
      all = [...all, ...ids];
    });

    return _.uniq(all);
  }, [jobDepartments]);
  
  useEffect(() => {
    if(!fetchDealMemos.loading && action == 'fetch_deal_memos'){
      const payload = { jobRoles: allPositions, currentDate: moment().format('YYYY-MM-DD') };
      dispatch(sendJobInvoiceRequest(job.id, payload));
      setAction('send_invoice');
    }
  }, [fetchDealMemos]);

  useEffect(() => {
    if(!sendInvoice.loading && action == 'send_invoice'){
      dispatch(
        updateJobDetailsRequest(job?.id, {
          originalStatus: "ACTIVE",
          status: "WRAPPED",
        })
      );
      setTimeout(() => {
        setShowLoader(false);
        history.push(`./jobs/${job.id}`);
      }, 500);
    }
  }, [sendInvoice]);

  if (showLoader) {
    return <Loader />;
  }
  
  const ActiveJobMoreActions = (
    <Menu>
      <Menu.Item key={'edit-job-info'} onClick={onEdit}>Edit Gig Info</Menu.Item>
      {/* <Menu.Item>Postpone Job</Menu.Item> */}
      <Menu.Item key={'archive-job'} onClick={onArchive}>Archive This Gig</Menu.Item>
      {/* <Menu.Item>Cancel This Job</Menu.Item> */}
      <Menu.Item key={'delete-job'} onClick={onDelete}>Delete</Menu.Item>
    </Menu>
  );

  return (
    <JobHeaderWrapper>
      {wrapModal.visible && (
        <InvoiceRequest job={job} setModalData={handleInvoiceModal} />
      )}

      {chooseOptionToWrapNPay && (
        <ChooseWaysToWrapNPayModal 
          visible={chooseOptionToWrapNPay}
          setCallback={async (choosed) => {
            const params = { wrap_and_pay_type: choosed };
            await dispatch(updateWrapPaySelectOptionRequest(job?.id, params))
            if(choosed !== 1){
              setWrapModal({ visible: true, job: job });
              setOptionToWrapNPay(false);
            } else {
              setShowLoader(true);
              setWrapModal({ visible: false, job: null });
              setOptionToWrapNPay(false);
              await dispatch(fetchJobDealMemosRequest(job.id));
              setAction('fetch_deal_memos');
            }
          }}
          onCancel={() => setOptionToWrapNPay(!chooseOptionToWrapNPay)}
        />
      )}

      <div className='header-top'>
        <Row style={rowStyle} gutter={gutter}>
          <Col md={12} xs={24}>
            <div className='header-left'>
              <div className='header-title'>
                <div className='badge'>Active</div>
                <h1>
                  <a onClick={goBack}>
                    <BackIcon />
                  </a>
                  {job.client}
                </h1>
                <p>
                  {job.agency} | {job.title}
                </p>
              </div>
            </div>
          </Col>
          <Col md={12} xs={24}>
            <div className='header-right'>
              <div className='header-right-text'>
                <strong>Gig # </strong>
                <span>{job.jobNumber}</span>
              </div>
              <Button
                type='default'
                className='wrapPayBtn'
                onClick={onJobWrapPay}
              >
                Wrap/Pay
              </Button>
              <div className='header-right-action'>
                <Dropdown
                  overlay={ActiveJobMoreActions}
                  overlayClassName='jobMenu'
                  placement='bottomRight'
                  trigger='click'
                >
                  <Button type='link'>
                    <Icon image={MoreIcon} width={5} height={20} />
                  </Button>
                </Dropdown>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </JobHeaderWrapper>
  );
};

export default JobHeader;
