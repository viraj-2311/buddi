import styled from 'styled-components';

const TagAutoCompleteWrapper = styled.div`
  width: 100%;
  border: 1px solid #bdbdbd;
  border-radius: 5px;

  .react-tags {
    position: relative;

    .ant-tag {
      font-size: 13px;
      font-weight: normal;
      color: #2f2e50;
      border: none;
      margin: 0 10px 10px 0;
      padding: 8px 13px;
      white-space: normal;
      border-radius: 100px;
      background-color: #f0f0f7;
    }
  }

  .react-tags__selected,
  .react-tags__search-input {
    background: #fafbff;
    border-radius: 5px;
  }

  .react-tags__selected {
    padding: 20px 20px 0px 20px;
  }

  .react-tags__search-input {
    padding: 0px 20px 10px 20px;
    width: 100%;
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

export default TagAutoCompleteWrapper;
