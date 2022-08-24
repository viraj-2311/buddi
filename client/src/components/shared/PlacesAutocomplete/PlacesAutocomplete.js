import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import PlacesAutocompleteWrapper from './PlacesAutocomplete.style';
import Spin from '@iso/components/uielements/spin';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

const getAddressByPlace = (place) => {
  let address = {
    addressLine1: '',
    city: '',
    state: '',
    zipCode: ''
  };

  for (const component of place.address_components) {
    if (component.types.includes('street_number')) {
      address.addressLine1 = component.short_name;
    }

    if (component.types.includes('route')) {
      if (address.addressLine1) {
        address.addressLine1 += ' ' + component.short_name;
      } else {
        address.addressLine1 = component.short_name;
      }
    }

    if (component.types.includes('locality') || component.types.includes('sublocality')) {
      address.city = component.long_name;
    }

    if (component.types.includes('administrative_area_level_1')) {
      address.state = component.short_name;
    }

    if (component.types.includes('postal_code')) {
      address.zipCode = component.short_name;
    }
  }

  return address;
};

const CustomPlacesAutocomplete = ({value, onChange, onSelect, onError}) => {

  const handleSelect = async (address) => {
    try {
      const geocode = await geocodeByAddress(address);
      const addressObject = getAddressByPlace(geocode[0]);
      const latLng = await getLatLng(geocode[0]);

      onSelect({address: addressObject, latLng});
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <PlacesAutocompleteWrapper>
      <PlacesAutocomplete
        value={value}
        onChange={onChange}
        onSelect={handleSelect}
        onError={onError}
        searchOptions={{
          componentRestrictions: { country: ['us'] }
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                className: 'ant-input'
              })}
            />
            <div className="isoAutocompleteDropdown">
              <Spin spinning={loading}>
                {suggestions.map((suggestion, index) => {
                  const activeClass = suggestion.active
                    ? 'ant-select-item-option-active'
                    : '';

                  return (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className: `ant-select-item ant-select-item-option ${activeClass}`
                      })}
                      key={index}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  );
                })}
              </Spin>
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </PlacesAutocompleteWrapper>
  );
};

export default CustomPlacesAutocomplete;