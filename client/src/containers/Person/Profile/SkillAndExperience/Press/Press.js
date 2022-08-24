import React, {useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import PressForm from './Form';

const ProfilePress = ({presses}) => {
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onPressEdit = () => {
    setVisibleEditForm(true);
  };

  const validLink = (link) => {
    if (!/^[a-z0-9]+:\/\//.test(link)) {
      return 'http://' + link;
    }

    return link;
  };

  return (
    <ProfileSectionWrapper className="pressesSection">
      <PressForm visible={visibleEditForm} presses={presses} setModalData={setEditFormData} />

      <h3 className="title">
        Press
        <Button type="link" className="sectionEditBtn" onClick={onPressEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        {presses && presses.map((press, index) => (<a key={`press-${index}`} href={validLink(press?.url)} className="link" target="_blank">{press?.url}</a>))}
      </div>
    </ProfileSectionWrapper>
  )
};

ProfilePress.defaultProps = {
  presses: []
};

export default ProfilePress;
