import React, { useEffect, useState, forwardRef } from 'react';
import TagAutoCompleteWrapper from './TagAutoComplete.style';
import ReactTags from 'react-tag-autocomplete';
import Tag from '@iso/components/uielements/tag';
const delimiters = ['Enter', ','];

const TagAutoComplete = (
  { tags, suggestions, placeholder, maxLength, onChange },
  ref
) => {
  const [stateTags, setStateTags] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);

  useEffect(() => {
    setStateTags(tags);
  }, [tags]);

  useEffect(() => {
    setStateSuggestions(suggestions);
  }, [suggestions]);

  const onTagDelete = (tagIndex) => {
    const newTags = stateTags.filter((tag, index) => index !== tagIndex);
    setStateTags(newTags);
    onChange(newTags);
  };

  const onTagAdd = (tag) => {
    // Check max length
    if (maxLength && stateTags.length >= maxLength) return;

    // Check duplicated tag
    const names = stateTags.map(({ name }) => name.toLowerCase());
    if (names.includes(tag.name.toLowerCase())) return;

    const newTags = [...stateTags, tag];
    setStateTags(newTags);
    onChange(newTags);
  };

  const TagComponent = ({ tag, onDelete }) => {
    return (
      <Tag closable onClose={onDelete}>
        {tag.name}
      </Tag>
    );
  };

  const SuggestionComponent = ({ item, query }) => {
    return <span>{item.name}</span>;
  };

  const suggestionFilter = (suggestion, query) => {
    return suggestion.name.toLowerCase().includes(query.toLowerCase());
  };

  return (
    <TagAutoCompleteWrapper>
      <ReactTags
        ref={ref}
        tags={stateTags}
        suggestions={stateSuggestions}
        delimiters={delimiters}
        allowNew={true}
        autoresize={false}
        placeholderText={placeholder}
        onDelete={onTagDelete}
        onAddition={onTagAdd}
        suggestionsFilter={suggestionFilter}
        tagComponent={TagComponent}
        suggestionComponent={SuggestionComponent}
      />
    </TagAutoCompleteWrapper>
  );
};

TagAutoComplete.defaultProps = {
  tags: [],
  suggestions: [],
};

export default forwardRef(TagAutoComplete);
