import React, {useState} from 'react';
import LoadTemplateConfirmWrapper from './LoadTemplateConfirm.style';
import Button from '@iso/components/uielements/button';
import Modal from '@iso/components/Modal';
import Checkbox from '@iso/components/uielements/checkbox';
import _ from 'lodash';

export default function ({visible, departments, setModalData}) {
  const [confirmDepartments, setConfirmDepartments] = useState([]);

  const handleCancel = () => {
    setModalData('close');
  };

  const handleCheckDepartment = (e) => {
    let departments = [...confirmDepartments];
    const checkedId = parseInt(e.target.value);
    if (e.target.checked) {
      departments = [...departments, checkedId];
    } else {
      departments = _.filter(departments, department => department !== checkedId);
    }

    setConfirmDepartments(departments);
  };

  const handleDepartmentConfirm = () => {
    setModalData('confirm', confirmDepartments);
  }

  return (
    <Modal
      visible={visible}
      title="Confirm Template"
      width={800}
      wrapClassName="hCentered"
      footer={null}
      onCancel={handleCancel}
    >
      <LoadTemplateConfirmWrapper>
        <div className="confirmDepartments">
          {departments.map((department, index) => (
            <div className="departmentItem" key={index}>
              <Checkbox
                value={department.id}
                checked={confirmDepartments.includes(department.id)}
                onChange={handleCheckDepartment}
              >
                {department.title}
              </Checkbox>
            </div>
          ))}
        </div>
        <div className="actionBtnWrapper">
          <Button shape="round" onClick={handleCancel}>Cancel</Button>
          <Button
            type="primary"
            shape="round"
            onClick={handleDepartmentConfirm}
          >
            Confirm
          </Button>
        </div>
      </LoadTemplateConfirmWrapper>
    </Modal>
  );
}