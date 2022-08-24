import React, {useEffect, useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import HeadlineForm from './Form';

const ProfileHeadline = ({headline}) => {
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onHeadlineEdit = () => {
    setVisibleEditForm(true);
  };

  return (
    <ProfileSectionWrapper>
      <HeadlineForm visible={visibleEditForm} headline={headline} setModalData={setEditFormData} />

      <h3 className="title">
        Headline
        <Button type="link" className="sectionEditBtn" onClick={onHeadlineEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        {headline}
      </div>
    </ProfileSectionWrapper>
  )
};

export default ProfileHeadline
