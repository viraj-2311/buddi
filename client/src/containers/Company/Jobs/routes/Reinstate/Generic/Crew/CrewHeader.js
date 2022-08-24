import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'antd';
import DatePicker from '@iso/components/uielements/datePicker';
import DayPicker from '@iso/components/shared/DayPicker';
import CalendarIcon from '@iso/components/icons/Calendar';
import Input from '@iso/components/uielements/input';
import CrewHeaderWrapper from './CrewHeader.style';
import { stringToDate } from '@iso/lib/helpers/utility';
import {  displayDateFormat } from '@iso/config/datetime.config';
import {
  fetchCrewTemplateListRequest,
} from '@iso/redux/producerJob/actions';
import notify from '@iso/lib/helpers/notify';
import { showServerError, formatCurrency } from '@iso/lib/helpers/utility';
import _ from 'lodash';
import moment from 'moment';


const CrewHeader = ({
  job,
  departments,
  onToggleExpandCollapse,
  onReadOnly=()=>{}
}) => {
  const dispatch = useDispatch();
  const containerRef=useRef();
  const { crewTemplates, loadTemplate } = useSelector(
    (state) => state.ProducerJob
  );

  const [refreshLoader, setRefreshLoader] = useState(false);
  const [action, setAction] = useState('');
  const [wrapDate, setWrapDate] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    onToggleExpandCollapse();
  }, [crewTemplates]);

  useEffect(() => {
    setWrapDate(job.wrapDate);
    setStartDate(job.startDate);
    dispatch(fetchCrewTemplateListRequest(job.id));
  }, [job]);

  useEffect(() => {
    if (
      !loadTemplate.loading &&
      !loadTemplate.error &&
      action === 'load_template'
    ) {
      notify('success', 'Template loaded successfully');
    }

    if (loadTemplate.error && action === 'load_template') {
      notify('error', showServerError(loadTemplate.error));
    }

    if (!loadTemplate.loading && action === 'load_template') {
      setAction('');
    }
  }, [loadTemplate]);

  const jobShootDates = useMemo(() => {
    let dates = [];
    if (job && job.shootDates) {
      dates = job.shootDates.map((date) => stringToDate(date).toDate());
    }
    return dates;
  }, [job]);
  useEffect(() => {    
    const interval = setInterval(() => {
      if(containerRef.current)
        containerRef.current.style.pointerEvents = "none";      
      }, 1000);        
    return () => {
      if(interval)
        window.clearInterval(interval);
    };
}, [])
  return (
    <CrewHeaderWrapper onClick={onReadOnly}>
      <div className='jobContent' ref={containerRef}>
        <Row gutter={[20, 25]} className='headerTop mb-25'>
          <Col flex='300px'>
            <label className='fieldLabel'>Project Start Date</label>
            <DatePicker
              className='fieldControl'
              value={stringToDate(startDate)}
              disabledDate={(current) => {
                return moment().add(-1, 'days')  >= current;
              }}
              disabled
              suffixIcon={
                <CalendarIcon width={20} height={18} fill='#bcbccb' />
              }
              format={displayDateFormat}
              allowClear={false}
            />
          </Col>

          <Col flex='300px'>
            <label className='fieldLabel'>Project End Date</label>
            <DatePicker
              className='fieldControl'
              value={stringToDate(wrapDate)}
              disabledDate={(current) => {
                return moment().add(-1, 'days')  >= current;
              }}
              disabled
              suffixIcon={
                <CalendarIcon width={20} height={18} fill='#bcbccb' />
              }
              format={displayDateFormat}
              allowClear={false}
            />
          </Col>

          <Col flex={6}>
            <label className='fieldLabel'>Show Date(s)</label>
            <DayPicker
              className='fieldControl'
              placeholder='Select date'
              month={stringToDate(job.startDate, 'YYYY-MM').toDate()}
              suffixIcon={
                <CalendarIcon width={20} height={18} fill='#bcbccb' />
              }
              values={jobShootDates}
              disabled
            />
          </Col>
          <Col flex={4} className='customFieldControl'>
            <label className='fieldLabel'>Talent Actual</label>
            <Input
              className='fieldControl successField'
              value={formatCurrency('', job.crewBudget)}
              prefix='$'
              disabled
            />
          </Col>
        </Row>
        <Row gutter={20} className='headerBottom mb-25'>
          {/* <Col flex='300px' className='marginBottom'>
            <ChooseDepartment
              className='departmentSelect'
              mode='tags'
              style={{ width: '100%' }}
              placeholder='Choose Departments'
              dropdownRender={() => (
                <ChooseDepartmentDropdownWrapper>
                  <div className='departmentDropDownOptions'>
                    {departments.map((department, index) => (
                      <div className='departmentDropDownItem' key={index}>
                        <Checkbox
                          color='#51369a'
                          value={department.id}
                          checked={department.selected}
                        >
                          {department.jobRoleGroupType.title}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </ChooseDepartmentDropdownWrapper>
                // </div>
              )}
            />
          </Col> */}
          {/* <Col flex='300px' className='marginBottom'>
            <Button
              type='default'
              shape='round'
              className='expandCollapseAllBtn'
            >
              Expand All/Collapse
            </Button>
          </Col> */}
          <Col flex='auto'></Col>
          {/* <Col className='rightAction marginBottom'>
            <Spin
              spinning={action === 'load_template'}
              className='padding-view'
            >
              <ChooseTemplate
                showSearch
                style={{ width: '100%' }}
                placeholder='Choose a Template'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                className='templateSelect'
                suffixIcon={<SaveFilled />}
              >
                {crewTemplates.map((template) => (
                  <ChooseTemplateOption
                    key={template.id}
                    value={template.id}
                    label={template.name}
                  >
                    {template.name}
                  </ChooseTemplateOption>
                ))}
              </ChooseTemplate>
            </Spin>
            <Button
              type='default'
              shape='round'
              className='saveAsTemplateBtn padding-view marginBottom'
            >
              Save As Template
            </Button>
          </Col> */}
        </Row>
      </div>
    </CrewHeaderWrapper>
  );
};

export default CrewHeader;
