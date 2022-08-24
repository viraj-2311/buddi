import React, {useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import Tag from '@iso/components/uielements/tag';
import ClientForm from './Form';

const ProfilePastClient = ({clients}) => {
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onPastClientEdit = () => {
    setVisibleEditForm(true);
  };

  return (
    <ProfileSectionWrapper className="clientsSection">
      <ClientForm visible={visibleEditForm} clients={clients} setModalData={setEditFormData} />

      <h3 className="title">
        Past Clients
        <Button type="link" className="sectionEditBtn" onClick={onPastClientEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        {clients && clients.map((client, index) => <Tag key={`client-${index}`}>{client}</Tag>)}
      </div>
    </ProfileSectionWrapper>
  )
};

ProfilePastClient.defaultProps = {
  clients: [],
};

export default ProfilePastClient
