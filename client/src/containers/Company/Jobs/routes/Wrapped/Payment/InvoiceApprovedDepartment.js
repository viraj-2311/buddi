import React, { useState, useEffect, useMemo } from 'react';
import { Col, Menu, Row } from 'antd';
import InvoiceApprovedDepartmentWrapper from './InvoiceApprovedDepartment.style';
import Checkbox from '@iso/components/uielements/checkbox';
import StatusTag from '@iso/components/utility/statusTag';
import CurrencyText from '@iso/components/utility/currencyText';

const { SubMenu } = Menu;

const InvoiceApprovedDepartment = ({
  job,
  department,
  memos,
  opened = false,
}) => {
  const [open, setOpen] = useState(opened);
  const [leftWidth, setLeftWidth] = useState(0);
  const [invoicePreview, setInvoicePreview] = useState({
    visible: false,
    invoiceMemo: null,
  });

  const departmentKey = useMemo(() => {
    return `department-${department.id}`;
  }, [department]);

  const onInvoiceView = (invoiceMemo) => {
    setInvoicePreview({ visible: true, invoiceMemo: invoiceMemo });
  };

  const handleInvoicePreview = (type, data) => {
    if (type === 'close') {
      setInvoicePreview({ visible: false, invoiceMemo: null });
    }
  };

  const calculateWidthLeftMenu = () => {
    const widthContent = document.getElementById('departmentPositionList');
    if (widthContent) {
      if (widthContent.clientWidth + 1 < leftWidth) {
        return leftWidth + 'px';
      } else if (widthContent.clientWidth + 1 > leftWidth) {
        setLeftWidth(widthContent.clientWidth + 1);
      } else {
        return leftWidth + 'px';
      }
    }
    return 0;
  };

  return (
    <InvoiceApprovedDepartmentWrapper
      className='inner-scroll'
      leftContentWidth={calculateWidthLeftMenu()}
    >
      <Row span='24' className='left-table d-flex'>
        <div
          className='departmentListWrapper'
          style={{ width: `${leftWidth > 0 ? leftWidth + 'px' : 'auto'}` }}
        >
          <Menu
            mode='inline'
            inlineIndent={0}
            selectable={false}
            className='departmentList'
            defaultOpenKeys={opened ? [departmentKey] : []}
          >
            <SubMenu
              key={departmentKey}
              className='departmentPositionList'
              id='departmentPositionList'
              onTitleClick={(key, e) => setOpen(!open)}
              title={
                <>
                  {/* <Checkbox
                    color='#19913d'
                    checked={true}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  /> */}
                  <span className='departmentName' title={department.title}>
                    {department.title}
                  </span>
                </>
              }
            >
              {department.jobRoles.map((jobRole) => {
                return (
                  <Menu.Item
                    key={`department-${department.id}-role-${jobRole.id}`}
                  >
                    {/* <Checkbox
                      color='#19913d'
                      checked={true}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    /> */}
                    <span className='positionName' title={jobRole.title}>
                      {jobRole.title}
                    </span>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          </Menu>
        </div>
        <div className='invoiceDepartmentTable'>
          <table className='table-global'>
            <thead>
              <tr>
                <th>Talent</th>
                <th>Project Rate</th>
                <th> { (job.wrapAndPayType !== 1) ? 'Invoice Amount' : 'Memo Amount' }</th>
                <th> { (job.wrapAndPayType !== 1) ? 'Invoice Status' : 'Memo Status' }</th>
              </tr>
            </thead>
            <tbody>
              {open && (
                <>
                  <tr className='padding-view' />
                  {department.jobRoles.map((jobRole) => {
                    const invoiceMemo = memos[jobRole.id]
                      ? memos[jobRole.id][0]
                      : null;
                    if (!invoiceMemo) return null;

                    return (
                      <tr key={`crew-invoice-memo-${invoiceMemo.id}`}>
                        <td>{invoiceMemo.fullName}</td>
                        <td>
                          <CurrencyText
                            value={invoiceMemo.jobMemo.totalPrice}
                          />
                        </td>
                        <td>
                          <CurrencyText
                            value={invoiceMemo.invoice.totalPrice}
                          />
                        </td>
                        <td className='action-btn'>
                          <StatusTag className='success'>Approved</StatusTag>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className='padding-view' />
                </>
              )}
            </tbody>
          </table>
        </div>
      </Row>
    </InvoiceApprovedDepartmentWrapper>
  );
};

export default InvoiceApprovedDepartment;
