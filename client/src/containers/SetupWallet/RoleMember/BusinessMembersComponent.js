import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row } from 'antd';
import Modal from '@iso/components/Modal';
import AddBusinessMember from './AddBusinessMember';
import ConfirmModal from '@iso/components/Modals/Confirm';
import {
  addNewMember,
  updateMember,
  deleteMember,
  requestListMembers,
} from '@iso/redux/user/actions';
import RoleMemberItem from './RoleMembersItem';
import notify from '@iso/lib/helpers/notify';
import { RoleMembers } from '@iso/enums/wallet_status';

const BusinessMembersComponent = () => {
  const dispatch = useDispatch();
  const [hasEditMember, setHasEditMember] = useState(false);
  const [hasDeleteMember, setDeleteMember] = useState(false);
  const [waitingDelete, setWaitingDelete] = useState(false);
  const [visibleAddMember, setVisibleAddMember] = useState(false);
  const [currentMember, setCurrentMember] = useState({});
  const { listMembers, roleMember } = useSelector((state) => state.User);
  const { companyId } = useSelector((state) => state.AccountBoard);

  useEffect(() => {
    if (
      !roleMember.loading &&
      roleMember.success &&
      (visibleAddMember || hasDeleteMember) &&
      companyId
    ) {
      setVisibleAddMember(false);
      setDeleteMember(false);
      setHasEditMember(false);
      setWaitingDelete(false);
      let payload = { company_id: companyId };
      dispatch(requestListMembers(payload));
    } else if (!roleMember.loading && roleMember.error) {
      if (roleMember.error.error) {
        notify('error', roleMember.error.error);
      } else {
        notify('error', 'Process Business Member has issue');
      }
      setVisibleAddMember(false);
      setDeleteMember(false);
      setHasEditMember(false);
      setWaitingDelete(false);
    }
  }, [roleMember]);

  const onCloseAddMember = () => {
    setVisibleAddMember(false);
    setDeleteMember(false);
    setHasEditMember(false);
    setWaitingDelete(false);
  };

  const handleAddNewMember = (data) => {
    const payload = {
      role: data.role,
      email: data.email,
      title: data.fullName,
    };
    dispatch(addNewMember(payload, companyId));
  };

  const handleUpdateMember = (data) => {
    const payload = {
      role: data.role,
      title: data.fullName,
    };
    dispatch(updateMember(payload, companyId, data.id));
  };

  const onDeleteMember = () => {
    dispatch(deleteMember(companyId, currentMember.id));
    setWaitingDelete(true);
  };

  const addBusinessMember = () => {
    setVisibleAddMember(true);
  };

  const editBusinessMember = (member) => {
    console.log('editBusinessMember');
    setCurrentMember(member);
    setHasEditMember(true);
    setVisibleAddMember(true);
  };

  const deleteBusinessMember = (member) => {
    setCurrentMember(member);
    setDeleteMember(true);
  };

  const onCancelBusinessMember = () => {
    setVisibleAddMember(false);
  };

  return (
    <>
      <div className='business-member-view'>
        <p className='title-header'>Wallet Access</p>
      </div>
      <div className='content-members'>
        <RoleMemberItem
          addBusinessMember={addBusinessMember}
          editBusinessMember={editBusinessMember}
          deleteBusinessMember={deleteBusinessMember}
          members={listMembers.data}
        />
      </div>
      <Modal
        visible={visibleAddMember}
        onCancel={onCloseAddMember}
        footer={null}
      >
        <AddBusinessMember
          onClose={onCloseAddMember}
          addNewMember={handleAddNewMember}
          updateMember={handleUpdateMember}
          hasEditMember={hasEditMember}
          dataMember={currentMember}
          visibleAddMember={visibleAddMember}
        />
      </Modal>
      <ConfirmModal
        wrapClassName='popup-delete'
        visible={hasDeleteMember}
        container={true}
        title={`Are you sure you want to 
          Unlink this ${RoleMembers[currentMember.role]} role?`}
        description=''
        confirmLoading={waitingDelete}
        onYes={onDeleteMember}
        onNo={() => setDeleteMember(false)}
      />
    </>
  );
};

export default BusinessMembersComponent;
