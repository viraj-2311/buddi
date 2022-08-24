import React, {useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import Tag from '@iso/components/uielements/tag';
import ADAgencyForm from './Form';

const ProfileADAgency = ({adAgencies}) => {
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onADAgencyEdit = () => {
    setVisibleEditForm(true);
  };

  return (
    <ProfileSectionWrapper className="employmentSection">
      <ADAgencyForm visible={visibleEditForm} agencies={adAgencies} setModalData={setEditFormData} />

      <h3 className="title">
        Advertising Agencies
        <Button type="link" className="sectionEditBtn" onClick={onADAgencyEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        {adAgencies && adAgencies.map((agency, index) => <Tag key={`agency-${index}`}>{agency}</Tag>)}
      </div>
    </ProfileSectionWrapper>
  )
};

ProfileADAgency.defaultProps = {
  adAgencies: [],
};

export default ProfileADAgency
