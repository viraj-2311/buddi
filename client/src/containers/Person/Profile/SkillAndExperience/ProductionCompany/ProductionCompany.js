import React, {useState} from 'react';
import { ProfileSectionWrapper } from '../SkillAndExperience.style';
import Button from '@iso/components/uielements/button';
import PenIcon from '@iso/components/icons/Pen';
import Tag from '@iso/components/uielements/tag';
import ProductionCompanyForm from './Form';

const ProfileProductionCompany = ({companies}) => {
  const [visibleEditForm, setVisibleEditForm] = useState(false);

  const setEditFormData = (type, data = null) => {
    if (type === 'close') {
      setVisibleEditForm(false)
    }
  };

  const onCompanyEdit = () => {
    setVisibleEditForm(true);
  };

  return (
    <ProfileSectionWrapper className="employmentSection">
      <ProductionCompanyForm visible={visibleEditForm} companies={companies} setModalData={setEditFormData} />

      <h3 className="title">
        Production Companies
        <Button type="link" className="sectionEditBtn" onClick={onCompanyEdit}>
          <PenIcon width={15} height={15} fill="#333"/>
        </Button>
      </h3>
      <div className="content">
        {companies && companies.map((company, index) => <Tag key={`company-${index}`}>{company}</Tag>)}
      </div>
    </ProfileSectionWrapper>
  )
};

ProfileProductionCompany.defaultProps = {
  companies: [],
};

export default ProfileProductionCompany
