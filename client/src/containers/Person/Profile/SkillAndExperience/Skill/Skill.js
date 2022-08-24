import React, {useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import Tag from '@iso/components/uielements/tag';
import SkillForm from './Form';

const ProfileSkill = ({skills}) => {
  const { primarySkills, secondarySkills } = skills;
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onSkillEdit = () => {
    setVisibleEditForm(true);
  };

  return (
    <ProfileSectionWrapper className="skillsSection">
      <SkillForm visible={visibleEditForm} skills={skills} setModalData={setEditFormData} />

      <h3 className="title">
        Skills
        <Button type="link" className="sectionEditBtn" onClick={onSkillEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        <div className="skillGroup">
          <h4 className="groupTitle">Primary Skills</h4>
          <div className="skillList">
            {primarySkills.primarySkill.map((skill, index) => <Tag key={`primary-${index}`}>{skill}</Tag>)}
          </div>
        </div>
        <div className="skillGroup">
          <h4 className="groupTitle">Secondary Skills</h4>
          <div className="skillList">
            {secondarySkills.secondarySkill.map((skill, index) => <Tag key={`secondary-${index}`}>{skill}</Tag>)}
          </div>
        </div>
      </div>
    </ProfileSectionWrapper>
  )
};

ProfileSkill.defaultProps = {
  skills: {
    primarySkills: [],
    secondarySkills: []
  }
};

export default ProfileSkill
