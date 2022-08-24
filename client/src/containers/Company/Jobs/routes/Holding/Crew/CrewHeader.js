import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Empty, Menu } from 'antd';
import DatePicker from '@iso/components/uielements/datePicker';
import Timepicker from '@iso/components/uielements/timePicker';
import DayPicker from '@iso/components/shared/DayPicker';
import CalendarIcon from '@iso/components/icons/Calendar';
import Input from '@iso/components/uielements/input';
import Button from '@iso/components/uielements/button';
import CrewHeaderWrapper from './CrewHeader.style';
import JobStatus from '@iso/enums/job_status';
import SaveTemplate from '../../JobDetails/SaveTemplate';
import { stringToDate, formatDateString, formatTimeString, stringToTime } from '@iso/lib/helpers/utility';
import { dateFormat, displayDateFormat } from '@iso/config/datetime.config';
import { SaveFilled } from '@ant-design/icons';
import moment from 'moment';
import {
  updateJobDetailsRequest,
  fetchCrewTemplateListRequest,
  loadCrewTemplateRequest,
} from '@iso/redux/producerJob/actions';
import ChooseTemplate, {
  ChooseTemplateOption,
} from '../../JobDetails/ChooseTemplate';
import ChooseDepartment, {
  ChooseDepartmentDropdownWrapper,
} from '../../JobDetails/ChooseDepartment';
import CrewSearchAutocomplete from '../../JobDetails/CrewSearchAutocomplete';
import LoadTemplateConfirm from '../../JobDetails/LoadTemplateConfirm';
import Checkbox from '../../JobDetails/CrewCheckbox';
import notify from '@iso/lib/helpers/notify';
import Spin from '@iso/components/uielements/spin';
import request from '@iso/lib/helpers/httpClient';
import { formatCurrency, showServerError } from '@iso/lib/helpers/utility';

import _ from 'lodash';

const CrewHeader = ({
  job,
  departments,
  onRefresh,
  refreshLoading,
  onDepartmentSelect,
  onToggleExpandCollapse,
}) => {
  const dispatch = useDispatch();
  const { crewTemplates, loadTemplate } = useSelector(
    (state) => state.ProducerJob
  );
  const [templateLoadConfirm, setTemplateLoadConfirm] = useState({
    visible: false,
    templateId: null,
    departments: [],
  });
  const [visibleSaveTemplate, setVisibleSaveTemplate] = useState(false);
  const [refreshLoader, setRefreshLoader] = useState(false);
  const [action, setAction] = useState('');
  const [wrapDate, setWrapDate] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    setWrapDate(job.wrapDate);
    setStartDate(job.startDate);
    dispatch(fetchCrewTemplateListRequest(job.id));
  }, [job]);

  useEffect(() => {
    if (!refreshLoading && refreshLoader) {
      setRefreshLoader(false);
    }
  }, [refreshLoading]);

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

  const handleStartWrapDateChange = (name, date) => {
    const payload = {
      [name]: formatDateString(date, dateFormat),
      shootDates: []
    };
    if (name === 'startDate') {
      setStartDate(date);
    } else if (name === 'wrapDate') {
      setWrapDate(date);
    }
    dispatch(updateJobDetailsRequest(job.id, payload));
  };

  const handleRefresh = () => {
    if (onRefresh) {
      setRefreshLoader(true);
      onRefresh();
    }
  };

  const handleShootDatesChange = (dates) => {
    const dateStrings = dates.map((date) => formatDateString(date, dateFormat));
    const payload = {
      shootDates: dateStrings,
    };
    dispatch(updateJobDetailsRequest(job.id, payload));
  };

  const handleTimeChange = (field, time) => {
    const payload = {
      [field]: time,
    };
    dispatch(updateJobDetailsRequest(job.id, payload));
  };

  const onTemplateSave = () => {
    setVisibleSaveTemplate(true);
  };

  const handleTemplateSave = (type) => {
    if (type === 'close') {
      setVisibleSaveTemplate(false);
    }
  };

  const handleCrewTemplateFetch = async (templateId) => {
    try {
      let conflicts = await request(
        `/job/${job.id}/can_load_template/${templateId}/`,
        'GET',
        null,
        true
      );
      if (conflicts.missing_job_roles && conflicts.missing_job_roles.length) {
        setTemplateLoadConfirm({
          visible: true,
          templateId: templateId,
          departments: conflicts.missing_job_roles,
        });
      } else {
        handleCrewTemplateLoad(templateId);
      }
    } catch (e) {
      notify('error', 'Failed to load template');
    }
  };

  const handleCrewTemplateLoad = (templateId, payload) => {
    setAction('load_template');
    dispatch(loadCrewTemplateRequest(job.id, templateId, payload));
  };

  const handleTemplateLoadCancel = () => {
    setTemplateLoadConfirm({ visible: false, departments: [] });
  };

  const handleLoadTemplateConfirm = (type, data) => {
    if (type === 'close') {
      handleTemplateLoadCancel();
    }

    if (type === 'confirm') {
      handleCrewTemplateLoad(templateLoadConfirm.templateId, {
        missingJobRoles: data,
      });
      setTemplateLoadConfirm({ visible: false, departments: [] });
    }
  };
  return (
    <CrewHeaderWrapper>
      <LoadTemplateConfirm
        visible={templateLoadConfirm.visible}
        departments={templateLoadConfirm.departments}
        setModalData={handleLoadTemplateConfirm}
      />

      <div className='jobContent'>
        <Row gutter={[20, 25]} className='headerTop mb-25'>
          <Col flex='300px'>
            <label className='fieldLabel'>Project Start Date</label>
            <DatePicker
              className='fieldControl w-180'
              value={stringToDate(startDate)}
              disabledDate={(current) => {
                return moment().add(-1, 'days')  >= current;
              }}
              onChange={(date) => handleStartWrapDateChange('startDate', date)}
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
              className='fieldControl w-180'
              value={stringToDate(wrapDate)}
              disabledDate={(current) => {
                return moment().add(-1, 'days')  >= current;
              }}
              onChange={(date) => handleStartWrapDateChange('wrapDate', date)}
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
              className='fieldControl w-180'
              placeholder='Select date'
              month={stringToDate(job.startDate, 'YYYY-MM').toDate()}
              suffixIcon={
                <CalendarIcon width={20} height={18} fill='#bcbccb' />
              }
              values={jobShootDates}
              onChange={handleShootDatesChange}
            />
          </Col>
          <Col flex={6}>
            <label className='fieldLabel'>Show Time(s)</label>
            <Timepicker
              format="hh:mm a"
              use12Hours 
              className="w-100"
              name="setTime"
              placeholder="hh:mm a"
              Timepicker='fieldControl w-180'
              allowClear={false}
              value={stringToTime(job.setTime, "hh:mm a")}
              onChange={(time) => handleTimeChange('setTime', formatTimeString(time, "hh:mm a"))}
            />
          </Col>
          <Col flex={4} className='customFieldControl'>
            <label className='fieldLabel'>Band Pay Total</label>
            <Input
              className='fieldControl successField'
              value={formatCurrency('', job.crewBudget)}
              prefix='$'
              disabled
            />
          </Col>
          <Col flex={4} className='customFieldControl'>
            <label className='fieldLabel'>Soundcheck Time</label>
            <Timepicker
              format="hh:mm a"
              use12Hours 
              className="w-100"
              name="soundCheckTime"
              Timepicker='fieldControl w-180'
              allowClear={false}
              value={stringToTime(job.soundCheckTime, "hh:mm a")}
              onChange={(time) => handleTimeChange('soundCheckTime', formatTimeString(time, "hh:mm a"))}
            />
          </Col>
          <Col flex={5}>
            {/* <label className='fieldLabel'>&nbsp;</label>
            <CrewSearchAutocomplete /> */}
          </Col>
        </Row>
        <Row gutter={20} className='headerBottom mb-25'>
          <Col flex='300px' className='marginBottom'>
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
                          color='#ffc06a'
                          value={department.id}
                          checked={department.selected}
                          disabled={department?.id === 2068}
                          onChange={(e) =>
                            onDepartmentSelect(department, e.target.checked)
                          }
                        >
                          {department.jobRoleGroupType.title}
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </ChooseDepartmentDropdownWrapper>
              )}
            />
          </Col>
          <Col flex='300px' className='marginBottom'>
            <Button
              type='default'
              shape='round'
              className='expandCollapseAllBtn'
              onClick={onToggleExpandCollapse}
            >
              Expand All/Collapse
            </Button>
          </Col>
          <Col className='rightAction marginBottom'>
            <Spin spinning={action === 'load_template'}>
              <ChooseTemplate
                showSearch
                style={{ width: '100%' }}
                placeholder='Choose a Template'
                optionFilterProp='children'
                onChange={handleCrewTemplateFetch}
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
              onClick={onTemplateSave}
            >
              Save As Template
            </Button>
          </Col>
        </Row>

        <SaveTemplate
          visible={visibleSaveTemplate}
          templates={crewTemplates}
          setModalData={handleTemplateSave}
        />
      </div>
    </CrewHeaderWrapper>
  );
};

export default CrewHeader;
