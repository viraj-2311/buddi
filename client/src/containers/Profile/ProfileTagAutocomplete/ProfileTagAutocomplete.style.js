import styled from 'styled-components';

const ProfileTagAutocompleteWrapper = styled.div`
  width: 100%;
  border: 1px solid #bdbdbd;
  border-radius: 5px;
  overflow: hidden;

  .react-tags {
    position: relative;

    .react-tags__selected {
      padding: 20px 20px 10px 20px;
    }
    .react-tags__search-input {
      padding: 10px 20px 20px 20px;
    }
    .ant-tag {
      padding: 7px 10px 8px 19px;
      border-radius: 100px;
      background-color: #f0f0f7;
      font-size: 13px;
      font-weight: normal;
      text-align: center;
      color: #2f2e50;
      border: none;
      margin-right: 10px;
      margin-bottom: 10px;
      border: solid 1px #868698;
      .ant-tag-close-icon {
        margin-left: 12px;
      }
    }
  }

  .react-tags__selected {
    padding: 10px;
  }

  .react-tags__selected,
  .react-tags__search-input {
    background-color: #fafbff;
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

  .react-tags__suggestions li {
    padding: 10px;
    cursor: pointer;
  }
`;

export default ProfileTagAutocompleteWrapper;
