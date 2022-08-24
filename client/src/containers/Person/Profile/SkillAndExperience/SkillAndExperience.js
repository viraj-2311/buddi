import React from 'react';
import SkillAndExperienceWrapper from './SkillAndExperience.style';
import ProfileHeadline from './Headline/Headline';
import ProfileActiveSince from './ActiveSince';
import ProfileEducation from './Education';
import ProfileSkill from './Skill';
import ProfilePastDirector from './PastDirector';
import ProfileProductionCompany from './ProductionCompany';
import ProfileADAgency from './ADAgency';
import ProfilePastClient from './PastClient';
import ProfileAward from './Award';
import ProfilePress from './Press';

const SkillAndExperience = ({user}) => {
  return (
    <SkillAndExperienceWrapper>
      <ProfileHeadline headline={user.headline}/>
      <ProfileActiveSince activeSince={user.activeSince} />
      <ProfileEducation educations={user.educations}/>
      <ProfileSkill skills={user.skills} />
      <ProfilePastDirector directorsGroup={user.directors} />
      <ProfileProductionCompany companies={user.productionCompanies}/>
      <ProfileADAgency adAgencies={user.advertisingAgencies} />
      <ProfilePastClient clients={user.pastClients} />
      <ProfileAward awards={user.awards} />
      <ProfilePress presses={user.presses} />
    </SkillAndExperienceWrapper>
  );
};

export default SkillAndExperience;
