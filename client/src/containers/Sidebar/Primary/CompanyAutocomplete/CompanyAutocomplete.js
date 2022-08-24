import React, { useEffect, useState } from 'react';
import AutoComplete from '@iso/components/Autocomplete';
import { CompanyAutocompleteWrapper } from './CompanyAutocomplete.style';
import Icon from '@iso/components/icons/Icon';
import { SearchOutlined } from '@ant-design/icons';
import cn from 'classnames';

export default function ({ companies: companyList, onSelect }) {
  const [companyAutoCompleteValue, setCompanyAutoCompleteValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.addEventListener('click', function (e) {
      const inputSection = document.getElementsByClassName('inputSection');
      if (inputSection[0] && !inputSection[0].contains(e.target)) {
        setIsOpen(false);
      }
    });
  }, []);

  const handleItemSelection = (selectedItem) => {
    setIsOpen(false);
    setCompanyAutoCompleteValue(selectedItem.title);
    onSelect(selectedItem.id);
  };

  const renderItem = (company, isHighlighted) => {
    return (
      <a
        className='searchSectionItem'
        key={company.id}
        onClick={(_) => {
          handleItemSelection(company);
        }}
      >
        <div
          key={`company_${company.id}`}
          className={`ant-select-item ant-select-item-option companyDropdownItemWithAvatar ${
            isHighlighted ? 'ant-select-item-option-active' : ''
          }`}
        >
          <div className='companyAvatar'>
            <div
              className={cn('isoCompanyLogoWrapper', {
                isoCompanyImage: company.profilePhotoS3Url,
              })}
            >
              {company.profilePhotoS3Url && (
                <Icon
                  src={company.profilePhotoS3Url}
                  width={35}
                  height={35}
                  title={company.title}
                />
              )}

              {!company.profilePhotoS3Url && (
                <div className='companyTitle' title={company.title}>
                  {company.title.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div className='companyInfo'>
            <div className='basicDetail'>
              <h4>{company.title}</h4>
            </div>
          </div>
        </div>
      </a>
    );
  };

  const filterCompany = (value) => {
    return companyList.filter(
      (company) => company.title.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      // setIsOpen(false);
    }, 200);
  };

  const handleKeyUp = ({ key }) => {
    setIsOpen(key !== 'Escape');
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <CompanyAutocompleteWrapper>
      <AutoComplete
        inputProps={{
          className: 'ant-input',
          placeholder: 'Company',
        }}
        items={[]}
        wrapperStyle={{
          position: 'relative',
          display: 'inline-block',
          width: '100%',
          zIndex: 3,
        }}
        value={companyAutoCompleteValue}
        renderItem={() => {}}
        renderInput={(props) => {
          return (
            <div className='inputSection'>
              <input
                {...props}
                onFocus={handleFocus}
                onKeyUp={handleKeyUp}
                onBlur={handleBlur}
                onClick={handleClick}
              />
              <SearchOutlined onClick={() => setIsOpen(true)} />
            </div>
          );
        }}
        open={isOpen}
        getItemValue={(company) => company.title}
        renderMenu={(items, value, style) => {
          return (
            <div className='searchSection'>
              {filterCompany(companyAutoCompleteValue).map((company, i) =>
                renderItem(company)
              )}
              {filterCompany(companyAutoCompleteValue).length === 0 && (
                <div className='noRecordDiv'>No Records</div>
              )}
            </div>
          );
        }}
        onChange={(value) => {
          setCompanyAutoCompleteValue(value);
          onSelect('');
        }}
      />
    </CompanyAutocompleteWrapper>
  );
}
