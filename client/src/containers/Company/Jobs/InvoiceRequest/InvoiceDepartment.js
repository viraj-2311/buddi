import React, { useState, useEffect, useMemo } from "react";
import { Col, Menu, Row } from "antd";
import InvoiceDepartmentWrapper from "./InvoiceDepartment.style";
import Checkbox from "@iso/components/uielements/checkbox";
import CurrencyText from "@iso/components/utility/currencyText";
import InvoiceMemo from "./InvoiceMemo";

const { SubMenu } = Menu;

const InvoiceDepartment = ({
  job,
  department,
  memos,
  selectedPositions,
  onSelect,
  opened,
}) => {
  const [open, setOpen] = useState(opened);
  const [memoEdit, setMemoEdit] = useState({ visible: false, memo: null });

  const departmentKey = useMemo(() => {
    return `department-${department.id}`;
  }, [department]);

  const departmentPositions = useMemo(() => {
    return department.jobRoles.map((p) => p.id);
  }, [department]);

  const onPositionSelectAll = (selected) => {
    let newPositions = [];
    if (selected) {
      newPositions = [...selectedPositions, ...departmentPositions];
    } else {
      newPositions = selectedPositions.filter(
        (p) => !departmentPositions.includes(p)
      );
    }

    onSelect(newPositions);
  };

  const onPositionSelect = (selected, position) => {
    let newPositions = [];
    if (selected) {
      newPositions = [...selectedPositions, position.id];
    } else {
      newPositions = selectedPositions.filter((p) => p !== position.id);
    }

    onSelect(newPositions);
  };

  const onMemoEdit = (memo) => {
    setMemoEdit({ visible: true, memo: memo });
  };

  const handleInvoiceMemo = (type, data = null) => {
    if (type === "close") {
      setMemoEdit({ visible: false, memo: null });
    }
  };

  return (
    <InvoiceDepartmentWrapper>
      <div className="departmentListWrapper">
        <Menu
          mode="inline"
          inlineIndent={0}
          selectable={false}
          className="departmentList"
          defaultOpenKeys={opened ? [departmentKey] : []}
        >
          <SubMenu
            key={departmentKey}
            className="departmentPositionList"
            onTitleClick={(key, e) => setOpen(!open)}
            title={
              <>
                <Checkbox
                  color="#51369a"
                  checked={departmentPositions.every((dp) =>
                    selectedPositions.includes(dp)
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPositionSelectAll(e.target.checked);
                  }}
                />
                <span className="departmentName" title={department.title}>
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
                  <Checkbox
                    color="#51369a"
                    checked={selectedPositions.includes(jobRole.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPositionSelect(e.target.checked, jobRole);
                    }}
                  />
                  <span className="positionName" title={jobRole.title}>
                    {jobRole.title}
                  </span>
                </Menu.Item>
              );
            })}
          </SubMenu>
        </Menu>
      </div>

      <div className="invoiceDepartmentTable">
        <table className="table-global">
          <thead>
            <tr>
              <th>Talent</th>
              <th>Total Rate</th>
              <th>Booking Memo</th>
            </tr>
          </thead>
          <tbody>
            {open && (
              <>
                {department.jobRoles.map((jobRole) => {
                  const jobMemo = memos[jobRole.id]
                    ? memos[jobRole.id][0]
                    : null;
                  if (!jobMemo) return null;
                  return (
                    <tr key={`crew-memo-${jobMemo.id}`} id={`crew-memo-${jobMemo.id}`}>
                      <td>{jobMemo.fullName}</td>
                      <td>
                        <CurrencyText value={jobMemo.invoiceMemo.totalPrice} />
                      </td>
                      <td className="userInfo">
                        <a href="#" onClick={() => onMemoEdit(jobMemo)}>
                          Edit Memo
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {memoEdit.visible && (
        <InvoiceMemo
          job={job}
          memo={memoEdit.memo}
          setModalData={handleInvoiceMemo}
        />
      )}
    </InvoiceDepartmentWrapper>
  );
};

export default InvoiceDepartment;
