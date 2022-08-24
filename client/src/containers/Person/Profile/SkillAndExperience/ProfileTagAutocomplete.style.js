import styled from 'styled-components';

const ProfileTagAutocompleteWrapper = styled.div`
  width: 100%;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  
  .react-tags {
    position: relative;
  }

  .react-tags__selected {
    padding: 10px;
  }

  .react-tags__search-input {
    width: 100%;
    padding: 10px;
    border: none;
    outline: none;
  }

  .react-tags__search {
    position: relative;
  }

  .reactTags__suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
  }

  .react-tags__suggestions ul {
  }

  .react-tags__suggestions li {
    padding: 10px;
    cursor: pointer;
  }
`;

export default ProfileTagAutocompleteWrapper;
