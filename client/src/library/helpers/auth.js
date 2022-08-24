import UserTypes from '@iso/enums/user_types';
import AccountTypes from '@iso/enums/account_types';

export const isProducer = (authUser) => {
  const staffCompanies = authUser.companies.filter((company) =>
    UserTypes.PRODUCER.includes(company.relationship)
  );

  return staffCompanies.length;
};

export const isExecutiveProducer = (authUser) => {
  const ownerCompanies = authUser.companies.filter((company) =>
    UserTypes.EXECUTIVE_PRODUCER.includes(company.relationship)
  );

  return ownerCompanies.length;
};

export const isContractor = (authUser) => {
  if (authUser.companies.length === 0) return true;

  const contractorCompanies = authUser.companies.filter((company) =>
    UserTypes.CONTRACTOR.includes(company.relationship)
  );

  return contractorCompanies.length;
};

export const isExecutiveUser = (authUser) => {
  return (
    authUser.type === AccountTypes.COMPANY ||
    authUser.type === AccountTypes.PRODUCER ||
    authUser.type === AccountTypes.BAND_LEADER ||
    authUser.type === AccountTypes.TALENT
    
  );
};

export const isCompanyAccount = (account) =>
  typeof account.businessType !== 'undefined';
