import React, {useState} from 'react';
import LocationFieldWrapper from './LocationField.style';
import AutoComplete from '@iso/components/shared/Autocomplete';

const LocationField = ({value, locations, placeholder, onChange, onSelect}) => {
  const shouldItemRender = (option, value) => {
    return option.toLowerCase().indexOf(value.toLowerCase()) >= 0
  };

  const renderItem = (location, isHighlighted) => (
    <div
      key={location}
      className={`ant-select-item ant-select-item-option ${isHighlighted ? 'ant-select-item-option-active' : ''}`}
    >
      {location}
    </div>
  );

  const handleLocationInput = (value) => {
    if (onChange) onChange(value);
  };

  const handleLocationSelect = (location) => {
    if (onSelect) onSelect(location);
    if (onChange) onChange(location);
  };

  return (
    <LocationFieldWrapper>
      <AutoComplete
        inputProps={{
          className: 'ant-input',
          placeholder: placeholder
        }}
        shouldItemRender={shouldItemRender}
        items={locations}
        wrapperStyle={{
          position: 'relative',
          display: 'inline-block',
          width: '100%',
          zIndex: 2
        }}
        renderItem={renderItem}
        getItemValue={location => location}
        value={value ? value : ''}
        renderMenu={(children) => (
          <div className="isoAutocompleteDropdown">
            {children}
          </div>
        )}
        onChange={handleLocationInput}
        onSelect={handleLocationSelect}
      />
    </LocationFieldWrapper>
  )
};

LocationField.defaultProps = {
  value: '',
  locations: []
};

export default LocationField;