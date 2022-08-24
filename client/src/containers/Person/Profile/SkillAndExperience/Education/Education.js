import React, {useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import EducationForm from './Form';

const ProfileEducation = ({educations, onUpdate}) => {
  const [editForm, setEditForm] = useState({visible: false, education: null});

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setEditForm({visible: false, education: null});
    }
  };

  const onEducationAdd = () => {
    setEditForm({visible: true, education: {}});
  };

  const onEducationEdit = (education) => {
    setEditForm({visible: true, education});
  };

  return (
    <ProfileSectionWrapper className="educationSection">
      <EducationForm visible={editForm.visible} educations={educations} education={editForm.education} setModalData={setEditFormData} />

      <h3 className="title">
        Education
        <Button type="link" className="educationAddBtn" onClick={onEducationAdd}>Add Education</Button>
      </h3>
      <div className="content">
        {educations.map((education, index) => (
          <div className="educationItem" key={`education-${index}`}>
            <div className="degree">
              <strong>{education.degree} in {education.studyField}</strong>
              <Button type="link" className="sectionEditBtn" onClick={() => onEducationEdit(education)}>
                <PenIcon width={15} height={15} fill="#333"/>
              </Button>
            </div>
            <div className="schoolName">{education.university}</div>
            <div className="graduation">{education.startYear} - {education.endYear}</div>
          </div>
        ))}
      </div>
    </ProfileSectionWrapper>
  )
};

ProfileEducation.defaultProps = {
  educations: []
};

export default ProfileEducation
