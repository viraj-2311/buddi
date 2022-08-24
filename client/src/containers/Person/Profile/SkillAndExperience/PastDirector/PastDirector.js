import React, {useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import Tag from '@iso/components/uielements/tag';
import SkillForm from './Form';

const ProfilePastDirector = ({directorsGroup}) => {
  const {directors, directorsPhotography} = directorsGroup;
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onPastDirectorEdit = () => {
    setVisibleEditForm(true);
  };

  return (
    <ProfileSectionWrapper className="employmentSection">
      <SkillForm visible={visibleEditForm} directorsGroup={directorsGroup} setModalData={setEditFormData} />

      <h3 className="title">
        Directors Worked With
        <Button type="link" className="sectionEditBtn" onClick={onPastDirectorEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        <div className="directorGroup">
          <h4 className="groupTitle">Directors</h4>
          <div className="directorList">
            {directors && directors.map((director, index) => <Tag key={`director-${index}`}>{director}</Tag>)}
          </div>
        </div>
        <div className="directorGroup">
          <h4 className="groupTitle">Directors of Photography</h4>
          <div className="directorList">
            {directorsPhotography && directorsPhotography.map((director, index) => <Tag key={`director-photography-${index}`}>{director}</Tag>)}
          </div>
        </div>
      </div>
    </ProfileSectionWrapper>
  )
};

ProfilePastDirector.defaultProps = {
  directorsGroup: {
    directors: [],
    directorsPhotography: []
  }
};

export default ProfilePastDirector
