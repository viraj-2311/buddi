import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import Autocomplete from 'react-autocomplete';
import AutocompleteWrapper from './Autocomplete.style';

const CustomAutocomplete = ({
  inputProps,
  shouldItemRender,
  wrapperStyle,
  items,
  getItemValue,
  renderMenu,
  renderItem,
  value,
  onSelect,
  onChange,
}) => {
  const [stateValue, setStateValue] = useState('');
  const acRef = useRef();

  useEffect(() => {
    setStateValue(value);
  }, [value]);

  const handleSelect = (value, item) => {
    setStateValue(value);
    if (onSelect) onSelect(item);
  };

  const handleChange = (event, value) => {
    setStateValue(value);
    if (onChange) onChange(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      const { highlightedIndex } = acRef.current.state;

      let filtered = items;
      if (shouldItemRender) {
        filtered = items.filter(item => shouldItemRender(item, e.target.value));
      }

      if (filtered.length > 0) {
        const highlightItem = filtered[highlightedIndex || 0];
        setStateValue(getItemValue(highlightItem));

        if (onSelect) onSelect(highlightItem);
      }
    }

    if (inputProps.onKeyDown) inputProps.onKeyDown(e);
  };

  return (
    <AutocompleteWrapper>
      <Autocomplete
        ref={acRef}
        inputProps={{
          ...inputProps,
          onKeyDown: handleKeyDown
        }}
        shouldItemRender={shouldItemRender}
        wrapperStyle={wrapperStyle}
        value={stateValue}
        items={items}
        getItemValue={getItemValue}
        onSelect={handleSelect}
        onChange={handleChange}
        renderMenu={renderMenu}
        renderItem={renderItem}
      />
    </AutocompleteWrapper>
  );
};

CustomAutocomplete.propTypes = {
  inputProps: PropTypes.object,
  shouldItemRender: PropTypes.func,
  wrapperStyle: PropTypes.object,
  items: PropTypes.array,
  getItemValue: PropTypes.func,
  renderMenu: PropTypes.func,
  renderItem: PropTypes.func,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
};

export default CustomAutocomplete;
