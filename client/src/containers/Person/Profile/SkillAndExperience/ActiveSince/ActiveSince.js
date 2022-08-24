import React, {useMemo, useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import ActiveSinceForm from './Form';
import moment from 'moment';

const ProfileActiveSince = ({activeSince}) => {
  const {year, month} = activeSince;
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const timeAgo = useMemo(() => {
    if (!year || !month) return null;

    const givenTime = moment([year, month]);
    return givenTime.fromNow();

  }, [year, month]);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onActiveSinceEdit = () => {
    setVisibleEditForm(true);
  };

  return (
    <ProfileSectionWrapper>
      <ActiveSinceForm visible={visibleEditForm} year={year} month={month} setModalData={setEditFormData} />

      <h3 className="title">
        Active Since
        <Button type="link" className="sectionEditBtn" onClick={onActiveSinceEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        {year && month && (
          <span className="timeAgo">{year} - Present ({timeAgo})</span>
        )}
      </div>
    </ProfileSectionWrapper>
  )
};

export default ProfileActiveSince
