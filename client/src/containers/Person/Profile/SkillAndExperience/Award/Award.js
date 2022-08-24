import React, {useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import AwardForm from './Form';
import Tag from '@iso/components/uielements/tag';

const ProfileAward = ({awards}) => {
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onAwardEdit = () => {
    setVisibleEditForm(true);
  };

  return (
    <ProfileSectionWrapper className="awardsSection">
      <AwardForm visible={visibleEditForm} awards={awards} setModalData={setEditFormData} />

      <h3 className="title">
        Awards
        <Button type="link" className="sectionEditBtn" onClick={onAwardEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        {awards && awards.map((award, index) => (
          <Tag key={`award-${index}`}>{award.title} - {award.year}</Tag>
        ))}
      </div>
    </ProfileSectionWrapper>
  )
};

ProfileAward.defaultProps = {
  awards: [{title: '', year: null}]
};

export default ProfileAward;
