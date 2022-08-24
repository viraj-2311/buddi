import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FinanceReportWrapper, { WidgetBox } from './Report.style';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import { Select } from 'antd';
import { fetchContractorFinanceStatsRequest } from '@iso/redux/contractorInvoice/actions';
import CurrencyText from '@iso/components/utility/currencyText';
import { FinanceStatusFilterType } from '@iso/enums/invoice_producer_status';
const { Option } = Select;

const FinanceReport = ({ onSelectFinanceReport }) => {
  const periodLists = [
    {
      display: '1 week',
      value: '2',
    },
    {
      display: '1 month',
      value: '1',
    },
    {
      display: '1 year',
      value: '12',
    },
  ];
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.Auth);
  const { stats } = useSelector((state) => state.ContractorInvoice);
  const [statsPeriod, setStatsPeriod] = useState(periodLists[1].value);
  const { overdue, totalPaid, sent, requested, inDispute } = stats;

  const handleClickPeriodSelect = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const filter = { period: statsPeriod };
    dispatch(fetchContractorFinanceStatsRequest(authUser.id, filter));
  }, [statsPeriod]);

  return (
    <FinanceReportWrapper>
      <li onClick={() => onSelectFinanceReport(FinanceStatusFilterType.PAID)}>
        <WidgetBox className="totalPaidWidget">
          <div
            className="isoColorIndicator"
            style={{ background: '#19913d' }}
          ></div>
          <div className="isoWidgetText">
            <h3 className="isoWidgetPrice">
              <CurrencyText value={totalPaid || 0} />
            </h3>
            <div className="totalPaidWidgetLabelWrapper">
              <span className="isoWidgetLabel">Total Paid</span>
              <Select
                className="paidMonthDropdown"
                size="small"
                value={statsPeriod}
                onClick={handleClickPeriodSelect}
                onSelect={(value) => setStatsPeriod(value)}
              >
                {periodLists.map(({ display, value }) => (
                  <Option key={value} value={value}>
                    {display}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </WidgetBox>
      </li>
      <li
        onClick={() => onSelectFinanceReport(FinanceStatusFilterType.REQUESTED)}
      >
        <WidgetBox>
          <div
            className="isoColorIndicator"
            style={{ background: '#bcbccb' }}
          ></div>
          <div className="isoWidgetText">
            <h3 className="isoWidgetPrice">
              <CurrencyText value={requested || 0} />
            </h3>
            <div className="isoWidgetLabel">Requested</div>
          </div>
        </WidgetBox>
      </li>
      <li onClick={() => onSelectFinanceReport(FinanceStatusFilterType.SENT)}>
        <WidgetBox>
          <div
            className="isoColorIndicator"
            style={{ background: '#808bff' }}
          ></div>
          <div className="isoWidgetText">
            <h3 className="isoWidgetPrice">
              <CurrencyText value={sent || 0} />
            </h3>
            <div className="isoWidgetLabel">Sent</div>
          </div>
        </WidgetBox>
      </li>
      <li
        onClick={() => onSelectFinanceReport(FinanceStatusFilterType.OVERDUE)}
      >
        <WidgetBox>
          <div
            className="isoColorIndicator"
            style={{ background: '#ffc06a' }}
          ></div>
          <div className="isoWidgetText">
            <h3 className="isoWidgetPrice">
              <CurrencyText value={overdue || 0} />
            </h3>
            <div className="isoWidgetLabel">Overdue</div>
          </div>
        </WidgetBox>
      </li>
      <li
        onClick={() =>
          onSelectFinanceReport(FinanceStatusFilterType.IN_DISPUTE)
        }
      >
        <WidgetBox>
          <div
            className="isoColorIndicator"
            style={{ background: '#ffa177' }}
          ></div>
          <div className="isoWidgetText">
            <h3 className="isoWidgetPrice">
              <CurrencyText value={inDispute || 0} />
            </h3>
            <div className="isoWidgetLabel">In Dispute</div>
          </div>
        </WidgetBox>
      </li>
    </FinanceReportWrapper>
  );
};

FinanceReport.propTypes = {
  onSelectFinanceReport: PropTypes.func,
};

FinanceReport.defaultProps = {
  onSelectFinanceReport: () => {},
};
export default FinanceReport;
